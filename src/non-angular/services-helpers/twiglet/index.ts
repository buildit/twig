import { UserState } from './../../interfaces/userState/index';
import { ModelNodeAttribute } from './../../interfaces/model/index';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { fromJS, Map, List } from 'immutable';
import { clone, merge } from 'ramda';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Twiglet } from './../../interfaces/twiglet';
import { ChangeLogService } from '../changelog';
import { ModelService, } from './model.service';
import { ViewService } from './view.service';

import { TwigletToSend } from './../../interfaces/twiglet';
import { UserStateService } from '../userState';
import { StateCatcher } from '../index';
import { D3Node, isD3Node, Link, ViewNode } from '../../interfaces/twiglet';
import { Config } from '../../config';
import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';

interface IdOnly {
  id: string;
}

export class TwigletService {

  public changeLogService: ChangeLogService;
  public modelService: ModelService;
  public viewService: ViewService;

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

  private _twigletBackup: Map<string, any> = null;

  private _nodeLocations: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map({}));

  private isSiteWide: boolean;

  constructor(private http: Http,
              private toastr: ToastsManager,
              private router: Router,
              public modalService: NgbModal,
              siteWide = true,
              private userState: UserStateService = null) {
    this.isSiteWide = siteWide;
    if (this.isSiteWide) {
      this.changeLogService = new ChangeLogService(http, this);
      this.viewService = new ViewService(http, this, userState, toastr);
      this.modelService = new ModelService(http, router, this, userState);
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

  get nodeLocations(): Observable<Map<string, any>> {
    return this._nodeLocations.asObservable();
  }

  createBackup() {
    this.modelService.createBackup();
    this._twigletBackup = this._twiglet.getValue();
  }

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
   * Handles server errors.
   *
   * @param {any} error
   *
   * @memberOf TwigletService
   */
  handleError(error) {
    console.error(error);
    this.toastr.error(error.statusText, 'Server Error');
  }

  /**
   * Updates the list of models from the backend.
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
    const twiglet = this._twiglet.getValue();
    const self = this;
    return this.http.get(`${Config.apiUrl}/${Config.twigletsFolder}/${name}`).map((res: Response) => res.json())
      .flatMap((results) => this.processLoadedTwiglet.bind(this)(results, viewName)
      .catch(() => {
        this.handleError.bind(self);
        this.userState.stopSpinner();
      }));
  }

  /**
   * Processes a loaded twiglet from the server
   *
   * @param {any} twigletFromServer
   * @returns
   *
   * @memberOf TwigletService
   */
  processLoadedTwiglet(twigletFromServer: Twiglet, viewName?) {
    this._twiglet.next(fromJS({ name: '', nodes: Map({}), links: Map({}) }));
    return this.http.get(twigletFromServer.model_url).map((res: Response) => res.json())
    .flatMap(modelFromServer =>
      this.viewService.loadView(twigletFromServer.views_url, viewName)
      .flatMap((viewFromServer) => {
        if (this.isSiteWide) {
          this.modelService.clearModel();
          this.clearLinks();
          this.clearNodes();
          this.modelService.setModel(modelFromServer);
        }
        const newTwiglet = {
          _rev: twigletFromServer._rev,
          changelog_url: twigletFromServer.changelog_url,
          description: twigletFromServer.description,
          links: convertArrayToMapForImmutable(twigletFromServer.links as Link[]).mergeDeep(viewFromServer.links),
          model_url: twigletFromServer.model_url,
          name: twigletFromServer.name,
          nodes: convertArrayToMapForImmutable(twigletFromServer.nodes as D3Node[]).mergeDeep(viewFromServer.nodes),
          url: twigletFromServer.url,
          views_url: twigletFromServer.views_url,
        };
        this._twiglet.next(fromJS(newTwiglet));
        if (this.changeLogService) {
          this.changeLogService.refreshChangelog();
        }
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
    const bodyString = JSON.stringify(body);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(`${Config.apiUrl}/${Config.twigletsFolder}`, body, options).map((res: Response) => res.json());
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
  saveChanges(commitMessage: string, _rev?: string) {
    const twiglet = this._twiglet.getValue();
    const twigletToSend: TwigletToSend = {
      _rev: _rev || twiglet.get('_rev'),
      commitMessage: commitMessage,
      description: twiglet.get('description'),
      doReplacement: _rev ? true : false,
      links: convertMapToArrayForUploading<Link>(twiglet.get('links')),
      name: twiglet.get('name'),
      nodes: convertMapToArrayForUploading<D3Node>(twiglet.get('nodes')).map(this.sanitizeNodesAndGetTrueLocation.bind(this)) as D3Node[],
    };
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this._twiglet.getValue().get('url'), twigletToSend, options)
      .map((res: Response) => res.json())
      .flatMap(newTwiglet => {
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
        throw failResponse;
      });
  }

  getViews(name) {
    this.http.get(`${Config.apiUrl}/${Config.twigletsFolder}/${name}/views`).map((res: Response) => res.json());
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

  clearNodes() {
    const twiglet = this._twiglet.getValue();
    const mutableNodes = twiglet.get('nodes').asMutable();
    mutableNodes.clear();
    this._twiglet.next(twiglet.set('nodes', mutableNodes.asImmutable()));
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

  replaceNodesAndLinks(updatedNodes: D3Node[], updatedLinks: Link[]) {
    let twiglet = this._twiglet.getValue();
    // update nodes
    const currentNodeLocations = this._nodeLocations.getValue();
    const newSetOfNodes = updatedNodes.reduce((mutable, node) => {
      const currentNodeLocation = currentNodeLocations.get(node.id);
      node.x = currentNodeLocation ? currentNodeLocation.get('x') : node.x;
      node.y = currentNodeLocation ? currentNodeLocation.get('y') : node.y;
      return mutable.set(node.id, fromJS(node));
    }, Map({}).asMutable());
    twiglet = twiglet.set('nodes', newSetOfNodes);

    // update links
    const newSetOfLinks = updatedLinks.reduce((mutable, link) => {
      return mutable.set(link.id, fromJS(sourceAndTargetBackToIds(link)));
    }, Map({}).asMutable()).asImmutable();
    twiglet = twiglet.set('links', newSetOfLinks);

    // publish update
    this._twiglet.next(twiglet);
  }

  private mergeNodesIntoTwiglet(twiglet, newNodes: Object | Map<string, any>): Map<string, any> {
    let nodes = twiglet.get('nodes').asMutable() as Map<string, any>;
    nodes = nodes.mergeDeep(newNodes);
    return twiglet.set('nodes', nodes);
  }

  updateNodeViewInfo(nodes: D3Node[]) {
    const locationInformationToSave = ['x', 'y', 'hidden', 'fx', 'fy', 'collapsed', 'collapsedAutomatically'];
    this._nodeLocations.next(nodes.reduce((map, node) =>
      locationInformationToSave.reduce((sameMap, key) => {
        return map.setIn([node.id, key], node[key]);
      }, map)
    , Map({}).asMutable()).asImmutable());
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
    const twiglet = this._twiglet.getValue();
    const mutableLinks = twiglet.get('links').asMutable();
    const newSetOfLinks = newLinks.reduce((mutable, link) => {
      return mutable.set(link.id, fromJS(sourceAndTargetBackToIds(link)));
    }, mutableLinks).asImmutable();
    this._twiglet.next(twiglet.set('links', newSetOfLinks));
  }

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

  sanitizeNodesAndGetTrueLocation(d3Node: D3Node): D3Node {
    delete d3Node.depth;
    delete d3Node.px;
    delete d3Node.py;
    delete d3Node.connected;
    delete d3Node.fixed;
    delete d3Node.radius;
    delete d3Node.vx;
    delete d3Node.vy;
    delete d3Node.index;
    delete d3Node.weight;
    d3Node.attrs = d3Node.attrs.map(cleanAttribute);
    const nodeLocations = this._nodeLocations.getValue();
    d3Node.x = nodeLocations.get('x') || d3Node.x;
    d3Node.y = nodeLocations.get('y') || d3Node.y;
    return d3Node;
  }
}

function sourceAndTargetBackToIds(link: Link) {
  // There is no reason to have a node memory reference anywhere outside of twiglet-graph
  const returner = clone(link);
  if (returner.source && isD3Node(returner.source)) {
    returner.source = returner.source.id;
  }
  if (returner.target && isD3Node(returner.target)) {
    returner.target = returner.target.id;
  }
  return returner;
}

function convertMapToArrayForUploading<K>(map: Map<string, any>): K[] {
  const mapAsJs = map.toJS();
  return Reflect.ownKeys(mapAsJs).reduce((array, key) => {
    array.push(mapAsJs[key]);
    return array;
  }, []);
}

function convertArrayToMapForImmutable<K>(array: any[]): Map<string, K> {
  return array.reduce((mutable, node) => {
    return mutable.set(node.id, fromJS(node));
  }, Map({}).asMutable()).asImmutable();
}

function cleanAttribute(attr: ModelNodeAttribute): ModelNodeAttribute {
  delete attr.dataType;
  delete attr.required;
  return attr;
}
