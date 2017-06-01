import { NgZone } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { clone, merge, pick } from 'ramda';
import { BehaviorSubject, Observable, Subscription } from 'rxjs/Rx';

import { handleError } from '../httpHelpers';
import { ChangeLogService } from '../changelog';
import { Config } from '../../config';
import { D3Node, isD3Node, Link, ModelNodeAttribute, Twiglet, TwigletToSend, UserState, ViewNode } from './../../interfaces';
import { EventsService } from './events.service';
import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';
import { ModelService, } from './model.service';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { StateCatcher } from '../index';
import { UserStateService } from '../userState';
import { ViewService } from './view.service';

interface IdOnly {
  id: string;
}

export class TwigletService {

  public changeLogService: ChangeLogService;
  public modelService: ModelService;
  public viewService: ViewService;
  public eventsService: EventsService;
  playbackSubscription: Subscription;

  private _twiglets: BehaviorSubject<List<any>> =
    new BehaviorSubject(List([]));

  private _twiglet: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map<string, any>({
      _rev: null,
      changelog_url: null,
      description: null,
      links: fromJS({}),
      model_url: null,
      name: null,
      nodes: fromJS({}),
      url: null,
      views_url: null,
    }));

  private _pristineTwiglet: Map<string, any> = null;

  private _twigletBackup: Map<string, any> = null;

  private _nodeLocations: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map({}));

  private isSiteWide: boolean;

  constructor(private http: Http,
              private toastr: ToastsManager,
              private router: Router,
              public modalService: NgbModal,
              siteWide = true,
              private userState: UserStateService = null,
              private ngZone: NgZone) {
    this.isSiteWide = siteWide;
    if (this.isSiteWide) {
      this.changeLogService = new ChangeLogService(http, this);
      this.viewService = new ViewService(http, this, userState, toastr);
      this.modelService = new ModelService(http, router, this);
      this.eventsService = new EventsService(http, this, userState, toastr);
      this.updateListOfTwiglets();
    }
  }

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get twiglets(): Observable<List<any>> {
    return this._twiglets.asObservable();
  }

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<Map<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get observable(): Observable<Map<string, any>> {
    return this._twiglet.asObservable();
  }

  /**
   * The node locations, not stored with nodes so d3 can update without making angular re-render.
   *
   * @readonly
   * @type {Observable<Map<string, any>>}
   * @memberOf TwigletService
   */
  get nodeLocations(): Observable<Map<string, any>> {
    return this._nodeLocations.asObservable();
  }

  /**
   * Creates a backup of the current twiglet state.
   *
   *
   * @memberOf TwigletService
   */
  createBackup() {
    this.modelService.createBackup();
    this._twigletBackup = this._twiglet.getValue();
  }

  /**
   * Restores a backup of the twiglet.
   *
   * @returns {boolean}
   *
   * @memberOf TwigletService
   */
  restoreBackup(): boolean {
    this.userState.stopSpinner();
    if (this._twigletBackup) {
      this._twiglet.next(this._twigletBackup);
      this.modelService.restoreBackup();
      return true;
    }
    return false;
  }

  /**
   * Updates the list of twiglets from the backend.
   *
   *
   * @memberOf TwigletService
   */
  updateListOfTwiglets() {
    this.http.get(`${Config.apiUrl}/${Config.twigletsFolder}`).map((res: Response) => res.json())
    .subscribe(response => {
      this._twiglets.next(fromJS(response).sort((a, b) => a.get('name').localeCompare(b.get('name'))));
    });
  }

  /**
   * updates the entity types of all of the nodes
   *
   * @param {string} oldType
   * @param {string} newType
   *
   * @memberOf TwigletService
   */
  updateNodeTypes(oldType: string, newType: string) {
    if (oldType !== newType) {
      let needToUpdate = false;
      let nodes = <List<Map<string, any>>>this._twiglet.getValue().get('nodes').asMutable();
      nodes.forEach((node, key) => {
        if (node.get('type') === oldType) {
          needToUpdate = true;
          nodes = nodes.set(key, node.set('type', newType));
        }
      });
      if (needToUpdate) {
        this._twiglet.next(this._twiglet.getValue().set('nodes', nodes.asImmutable()));
      }
    }
  }

  /**
   * GETs a twiglet from the server.
   *
   * @param {any} name the name of the twiglet to be loaded.
   *
   * @memberOf TwigletService
   */
  loadTwiglet(name, viewName?) {
    this.userState.startSpinner();
    return this.http.get(`${Config.apiUrl}/${Config.twigletsFolder}/${name}`)
      .map((res: Response) => res.json())
      .flatMap((results) => this.processLoadedTwiglet.bind(this)(results, viewName))
      .catch((error) => {
        handleError.bind(this)(error);
        this.userState.stopSpinner();
        return Observable.throw(error);
      });
  }

  /**
   * Processes a loaded twiglet from the server
   *
   * @param {any} twigletFromServer
   * @returns
   *
   * @memberOf TwigletService
   */
  private processLoadedTwiglet(twigletFromServer: Twiglet, viewName?) {
    this._twiglet.next(fromJS({ name: '', nodes: Map({}), links: Map({}) }));
    return this.http.get(twigletFromServer.model_url).map((res: Response) => res.json())
    .flatMap(modelFromServer =>
      this.viewService.loadView(twigletFromServer.views_url, viewName)
      .flatMap((viewFromServer) => {
        if (this.isSiteWide) {
          this.modelService.clearModel();
          this.clearLinks();
          this.clearNodes();
          const model = merge(modelFromServer, { url: twigletFromServer.model_url });
          this.modelService.setModel(model);
        }
        const links = convertArrayToMapForImmutable(twigletFromServer.links as Link[]);
        const nodes = convertArrayToMapForImmutable(twigletFromServer.nodes as D3Node[]);
        const editableViewFromServer = clone(viewFromServer);
        Reflect.ownKeys(editableViewFromServer.links).forEach((id: string) => {
          if (!links.get(id)) {
            delete editableViewFromServer.links[id];
          }
        });
        Reflect.ownKeys(editableViewFromServer.nodes).forEach((id: string) => {
          if (!nodes.get(id)) {
            delete editableViewFromServer.nodes[id];
          }
        });
        const newTwiglet = {
          _rev: twigletFromServer._rev,
          changelog_url: twigletFromServer.changelog_url,
          description: twigletFromServer.description,
          events_url: twigletFromServer.events_url,
          links: links.mergeDeep(editableViewFromServer.links),
          model_url: twigletFromServer.model_url,
          name: twigletFromServer.name,
          nodes: nodes.mergeDeep(editableViewFromServer.nodes),
          sequences_url: twigletFromServer.sequences_url,
          url: twigletFromServer.url,
          views_url: twigletFromServer.views_url,
        };
        this._twiglet.next(fromJS(newTwiglet));
        if (this.changeLogService) {
          this.changeLogService.refreshChangelog();
        }
        this._pristineTwiglet = this._twiglet.getValue();
        this.userState.stopSpinner();
        return Observable.of({
          modelFromServer,
          twigletFromServer,
          viewFromServer,
        });
      })
    );
  }

  /**
   * Clears the current twiglet
   *
   *
   * @memberOf TwigletService
   */
  clearCurrentTwiglet() {
    this._twiglet.next(fromJS({ name: '', nodes: Map({}), links: Map({}) }));
  }

  /**
   * Loads and shows a specific event from the past.
   *
   * @param {string} id then id of the event to show.
   *
   * @memberOf TwigletService
   */
  showEvent(id: string) {
    if (id) {
      this.userState.startSpinner();
      this.eventsService.getEvent(id).subscribe(event => {
        this.userState.setCurrentEvent(id);
        this.replaceNodesAndLinks(event.nodes, event.links);
      });
    } else {
      this.userState.setCurrentEvent(null);
      this.showOriginal();
    }
  }

  previousEvent() {
    const previous = this.eventsService.stepBack();
    if (previous) {
      this.showEvent(previous.get('id'));
    } else {
      this.toastr.warning('no events selected');
    }
  }

  nextEvent() {
    const next = this.eventsService.stepForward();
    if (next) {
      this.showEvent(next.get('id'));
    } else {
      this.toastr.warning('no events selected');
    }
  }

  /**
   * Goes back to displaying the original twiglet.
   *
   *
   * @memberOf TwigletService
   */
  showOriginal() {
    this.replaceNodesAndLinks(
      this._pristineTwiglet.get('nodes').valueSeq().toJS(),
      this._pristineTwiglet.get('links').valueSeq().toJS()
    );
  }

  /**
   * Plays the sequence of events.
   *
   *
   * @memberOf TwigletService
   */
  playSequence() {
    this.playbackSubscription = this.eventsService.getSequenceAsTimedEvents()
      .subscribe(event => {
        if (!this.playbackSubscription.closed) {
          this.userState.setCurrentEvent(event.id);
          this.replaceNodesAndLinks(event.nodes, event.links);
        }
      }, (error) => {
        this.toastr.warning(error);
        this.userState.setPlayingBack(false);
      }, () => {
        this.userState.setPlayingBack(false);
      });
  }

  /**
   * Stops the playback of events.
   *
   *
   * @memberOf TwigletService
   */
  stopPlayback() {
    this.userState.setPlayingBack(false);
    this.playbackSubscription.unsubscribe();
  }

  /**
   * Sets the name of the twiglet.
   *
   * @param {string} name
   *
   * @memberOf TwigletService
   */
  setName(name: string) {
    this._twiglet.next(this._twiglet.getValue().set('name', name));
  }

  /**
   * Sets the description of the twiglet.
   *
   * @param {string} description
   *
   * @memberOf TwigletService
   */
  setDescription(description: string) {
    this._twiglet.next(this._twiglet.getValue().set('description', description));
  }

  /**
   * Adds a twiglet to the database.
   *
   * @param {any} body
   * @returns {Observable<any>}
   *
   * @memberOf TwigletService
   */
  addTwiglet(body): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(`${Config.apiUrl}/${Config.twigletsFolder}`, body, options);
  }

  /**
   * Removes a twiglet from the database, perhaps this should be on the backend service?
   *
   * @param {any} name the name of the twiglet to be removed
   * @returns {Observable<any>}
   *
   * @memberOf TwigletService
   */
  removeTwiglet(name): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.delete(`${Config.apiUrl}/${Config.twigletsFolder}/${name}`, options).map((res: Response) => res.json());
  }

  /**
   * Saves changes to the currently loaded twiglet.
   *
   * @param {string} commitMessage
   * @returns
   *
   * @memberOf TwigletService
   */
  saveChanges(commitMessage: string, _rev?: string): Observable<any> {
    const twiglet = this._twiglet.getValue();
    const twigletToSend: TwigletToSend = {
      _rev: _rev || twiglet.get('_rev'),
      commitMessage: commitMessage,
      description: twiglet.get('description'),
      doReplacement: _rev ? true : false,
      links: convertMapToArrayForUploading<Link>(twiglet.get('links')),
      name: twiglet.get('name'),
      nodes: convertMapToArrayForUploading<D3Node>(twiglet.get('nodes'))
              .map(this.sanitizeNodesAndGetTrueLocation.bind(this)) as D3Node[],
    };
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this._twiglet.getValue().get('url'), twigletToSend, options)
      .map((res: Response) => res.json())
      .flatMap((newTwiglet: Twiglet) => {
        this.setRev(newTwiglet._rev);
        if (this.isSiteWide) {
          this.router.navigate(['twiglet', newTwiglet.name]);
          this.changeLogService.refreshChangelog();
          this.viewService.refreshViews();
        }
        this.toastr.success(`${newTwiglet.name} saved`);
        return Observable.of(newTwiglet);
      }).catch(failResponse => {
        if (failResponse.status === 409) {
          const updatedTwiglet = JSON.parse(failResponse._body).data;
          const modelRef = this.modalService.open(OverwriteDialogComponent);
          const component = <OverwriteDialogComponent>modelRef.componentInstance;
          component.commit = updatedTwiglet.latestCommit;
          return component.userResponse.asObservable().flatMap(userResponse => {
            if (userResponse === true) {
              modelRef.close();
              return this.saveChanges(commitMessage, updatedTwiglet._rev);
            } else if (userResponse === false) {
              modelRef.close();
              return Observable.of(failResponse);
            }
          });
        }
        return Observable.throw(failResponse);
      });
  }

  /**
   * Adds a node to the twiglet.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf NodesService
   */
  addNode(newNode: D3Node) {
    this.addNodes([newNode]);
  }

  /**
   * Adds an array of nodes to the twiglet.
   *
   * @param {D3Node[]} newNodes an array of nodes be to be added.
   *
   * @memberOf NodesService
   */
  addNodes(newNodes: D3Node[]) {
    let twiglet = this._twiglet.getValue();
    const mutableNodes = twiglet.get('nodes').asMutable();
    const newSetOfNodes = newNodes.reduce((mutable, node) => {
      return mutable.set(node.id, fromJS(node));
    }, mutableNodes).asImmutable();
    twiglet = this.mergeNodesIntoTwiglet(twiglet, this._nodeLocations.getValue());
    twiglet = twiglet.set('nodes', newSetOfNodes);
    this._twiglet.next(twiglet);
  }

  /**
   * Removes all of the nodes from the twiglet.
   *
   *
   * @memberOf TwigletService
   */
  clearNodes() {
    const twiglet = this._twiglet.getValue();
    const mutableNodes = twiglet.get('nodes').asMutable();
    mutableNodes.clear();
    this._twiglet.next(twiglet.set('nodes', mutableNodes.asImmutable()));
  }

  updateNodeParam(id, key, value) {
    let twiglet = this._twiglet.getValue();
    twiglet = this.mergeNodesIntoTwiglet(twiglet, this._nodeLocations.getValue());
    twiglet = twiglet.setIn(['nodes', id, key], value);
    this._twiglet.next(twiglet);
  }

  /**
   * Updates a single node on the twiglet. Contains a state catcher so that D3 doesn't keep looping
   * on itself when it pushes x and y updates and think it needs to recalculate again and again and again.
   *
   * @param {D3Node} updatedNode The node to be updated, requires ID and any other changes being made.
   * @param {StateCatcher} [stateCatcher] alerts the caller of the state before it is pushed.
   *                                      Don't use it, unless you are working on D3 stuff. Seriously.
   *
   * @memberOf NodesService
   */
  updateNode(updatedNode: D3Node) {
    this.updateNodes([updatedNode]);
  }

  /**
   * Updates multiple nodes on the twiglet. Contains a state catcher so that D3 doesn't keep looping
   * on itself when it pushes x and y updates and think it needs to recalculate again and again and again.
   *
   * @param {D3Node[]} updatedNodes the array of nodes to be updated, requires ID and any other changes being made.
   * @param {StateCatcher} [stateCatcher] alerts the caller of the state before it is pushed.
   *                                      Don't use it, unless you are working on D3 stuff. Seriously.
   *
   * @memberOf NodesService
   */
  updateNodes(updatedNodes: D3Node[]) {
    let twiglet = this._twiglet.getValue();
    const updatedNodesAsObject = updatedNodes.reduce((object, node) => {
      object[node.id] = node;
      return object;
    }, {});
    twiglet = this.mergeNodesIntoTwiglet(twiglet, this._nodeLocations.getValue());
    twiglet = this.mergeNodesIntoTwiglet(twiglet, updatedNodesAsObject);
    this._twiglet.next(twiglet);
  }

  /**
   * Replaces all of the nodes and links.
   *
   * @param {D3Node[]} updatedNodes
   * @param {Link[]} updatedLinks
   *
   * @memberOf TwigletService
   */
  replaceNodesAndLinks(updatedNodes: D3Node[], updatedLinks: Link[]) {
    let twiglet = this._twiglet.getValue();
    // update nodes
    const currentNodeLocations = this._nodeLocations.getValue();
    const newSetOfNodes = updatedNodes.reduce((mutable, node) => {
      const currentNodeLocation = <Map<string, any>>currentNodeLocations.get(node.id) || Map({});
      currentNodeLocation.keySeq().forEach(key => {
        node[key] = currentNodeLocation.get(key) ? currentNodeLocation.get(key) : node[key];
      });
      return mutable.set(node.id, fromJS(node));
    }, Map({}).asMutable()).asImmutable();
    twiglet = twiglet.set('nodes', newSetOfNodes);

    // update links
    const newSetOfLinks = updatedLinks.reduce((mutable, link) => {
      return mutable.set(link.id, fromJS(sourceAndTargetBackToIds(link)));
    }, Map({}).asMutable()).asImmutable();
    twiglet = twiglet.set('links', newSetOfLinks);

    // publish update
    this._twiglet.next(twiglet);
    this.userState.stopSpinner();
  }

  private mergeNodesIntoTwiglet(twiglet, newNodes: Object | Map<string, any>): Map<string, any> {
    let nodes = twiglet.get('nodes').asMutable() as Map<string, any>;
    nodes = nodes.mergeDeep(newNodes);
    return twiglet.set('nodes', nodes);
  }

  /**
   * Called from D3 to update node locations.
   *
   * @param {D3Node[]} nodes
   *
   * @memberOf TwigletService
   */
  updateNodeViewInfo(nodes: D3Node[]) {
    const locationInformationToSave = ['gravityPoint', 'x', 'y', 'hidden', 'fx', 'fy', 'collapsed', 'collapsedAutomatically'];
    this.ngZone.runOutsideAngular(() => {
      this._nodeLocations.next(nodes.reduce((map, node) =>
        locationInformationToSave.reduce((sameMap, key) => {
          return map.setIn([node.id, key], node[key]);
        }, map)
      , Map({}).asMutable()).asImmutable());
    });
  }

  /**
   * Removes a node from the twiglet.
   *
   * @param {D3Node} removedNode The node to be removed, only requires id, ignores other keys.
   *
   * @memberOf NodesService
   */
  removeNode(removedNode: D3Node) {
    this.removeNodes([removedNode]);
  }

  /**
   * Removes multiple nodes from the twiglet.
   *
   * @param {D3Node[]} removedNodes The nodes to be removed, only requires id, ignores other keys
   *
   * @memberOf NodesService
   */
  removeNodes(removedNodes: D3Node[]) {
    const mutableNodeLocations = this._nodeLocations.getValue().asMutable();
    const newSetOfNodeLocations = removedNodes.reduce((mutable, node) => {
      return mutable.delete(node.id);
    }, mutableNodeLocations).asImmutable();
    this._nodeLocations.next(newSetOfNodeLocations);
    let twiglet = this._twiglet.getValue();
    const mutableNodes = twiglet.get('nodes').asMutable();
    const newSetOfNodes = removedNodes.reduce((mutable, node) => {
      return mutable.delete(node.id);
    }, mutableNodes).asImmutable();
    twiglet = twiglet.set('nodes', newSetOfNodes);
    twiglet = this.mergeNodesIntoTwiglet(twiglet, this._nodeLocations.getValue());
    this._twiglet.next(twiglet);
  }

  /**
   * Adds a link to the twiglet. Works by wrapping single link in array and calling addLinks
   *
   * @param {Link} newLink Requires id, source and target to work correctly.
   *
   * @memberOf LinksService
   */
  addLink(newLink: Link) {
    this.addLinks([newLink]);
  }

  /**
   * Adds multiple links to the twiglets.
   *
   * @param {Link[]} newLinks requires id, source and target to work correctly/
   *
   * @memberOf LinksService
   */
  addLinks(newLinks: Link[]) {
    let twiglet = this._twiglet.getValue();
    twiglet = this.mergeNodesIntoTwiglet(twiglet, this._nodeLocations.getValue());
    const mutableLinks = twiglet.get('links').asMutable();
    const newSetOfLinks = newLinks.reduce((mutable, link) => {
      return mutable.set(link.id, fromJS(sourceAndTargetBackToIds(link)));
    }, mutableLinks).asImmutable();
    this._twiglet.next(twiglet.set('links', newSetOfLinks));
  }

  /**
   * Removes all of the links from the twiglet.
   *
   *
   * @memberOf TwigletService
   */
  clearLinks() {
    const twiglet = this._twiglet.getValue();
    const mutableLinks = twiglet.get('links').asMutable();
    mutableLinks.clear();
    this._twiglet.next(twiglet.set('links', mutableLinks.asImmutable()));
  }

  /**
   * updates any {key, value} pair on links except for id. Works by wrapping in array and calling addLinks.
   *
   * @param {Link} updatedLink requires id and updates any other {key, value} pair
   *
   * @memberOf LinksService
   */
  updateLink(updatedLink: Link) {
    this.updateLinks([updatedLink]);
  }

  /**
   * updates any {key, value} pair for an array of nodes (except for id).
   *
   * @param {Link[]} updatedLinks requires id and updates any {key, value} pair
   *
   * @memberOf LinksService
   */
  updateLinks(updatedLinks: Link[]) {
    const twiglet = this._twiglet.getValue();
    const mutableLinks = twiglet.get('links').asMutable();
    const newSetOfLinks = updatedLinks.reduce((mutable, link) => {
      const currentLink = mutableLinks.get(link.id).toJS();
      return mutable.set(link.id, fromJS(merge(currentLink, sourceAndTargetBackToIds(link))));
    }, mutableLinks).asImmutable();
    this._twiglet.next(twiglet.set('links', newSetOfLinks));
  }

  /**
   * Removes a single from the twiglet. Works by wrapping singleton in array and calling removeLinks.
   *
   * @param {Link} removedLink only needs { id }
   *
   * @memberOf LinksService
   */
  removeLink(removedLink: IdOnly) {
    this.removeLinks([removedLink]);
  }

  /**
   * Removes multiple links from the twiglet.
   *
   * @param {Link[]} removedLinks only needs { id }
   *
   * @memberOf LinksService
   */
  removeLinks(removedLinks: IdOnly[]) {
    const twiglet = this._twiglet.getValue();
    const mutableLinks = twiglet.get('links').asMutable();
    const newSetOfLinks = removedLinks.reduce((mutable, link) => {
      return mutable.delete(link.id);
    }, mutableLinks).asImmutable();
    this._twiglet.next(twiglet.set('links', newSetOfLinks));
  }

  /**
   * Removes the extra d3 information and adds the location information for saving nodes to db.
   *
   * @param {D3Node} d3Node
   * @returns {D3Node}
   *
   * @memberOf TwigletService
   */
  sanitizeNodesAndGetTrueLocation(d3Node: D3Node): D3Node {
    let nodeLocation = {};
    if (this._nodeLocations.getValue().get(d3Node.id)) {
      nodeLocation = this._nodeLocations.getValue().get(d3Node.id).toJS();
    }
    const sanitizedNode = pick([
      'id',
      'location',
      'name',
      'size',
      'type',
      '_color',
      '_size'
    ], merge(d3Node, nodeLocation)) as any as D3Node;
    sanitizedNode.attrs = d3Node.attrs.map(cleanAttribute);
    return sanitizedNode;
  }

  private setRev(rev) {
    this._twiglet.next(this._twiglet.getValue().set('_rev', rev));
  }
}

/**
 * Removes the reference to the nodes and replaces it with the node id.
 *
 * @param {Link} link
 * @returns
 */
function sourceAndTargetBackToIds(link: Link) {
  const returner = clone(link);
  if (returner.source && isD3Node(returner.source)) {
    returner.source = returner.source.id;
  }
  if (returner.target && isD3Node(returner.target)) {
    returner.target = returner.target.id;
  }
  return returner;
}

/**
 * return an array of nodes or links
 *
 * @template K
 * @param {Map<string, any>} map
 * @returns {K[]}
 */
export function convertMapToArrayForUploading<K>(map: Map<string, any>): K[] {
  const mapAsJs = map.toJS();
  return Reflect.ownKeys(mapAsJs).reduce((array, key) => {
    array.push(mapAsJs[key]);
    return array;
  }, []);
}

/**
 * Converts array from server into map for use in ng2
 *
 * @template K
 * @param {any[]} array
 * @returns {Map<string, K>}
 */
export function convertArrayToMapForImmutable<K>(array: any[]): Map<string, K> {
  return array.reduce((mutable, node) => {
    return mutable.set(node.id, fromJS(node));
  }, Map({}).asMutable()).asImmutable();
}

/**
 * Removes the extra information from the node attributes.
 *
 * @param {ModelNodeAttribute} attr
 * @returns {ModelNodeAttribute}
 */
export function cleanAttribute(attr: ModelNodeAttribute): ModelNodeAttribute {
  delete attr.dataType;
  delete attr.required;
  return attr;
}
