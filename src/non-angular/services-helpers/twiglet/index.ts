
import { of as observableOf, throwError as observableThrowError, BehaviorSubject, Observable, Subscription } from 'rxjs';

import { catchError, map, mergeMap } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';
import { clone, merge, mergeDeepLeft, pick, omit, equals } from 'ramda';

import { cleanAttribute } from './helpers';
import { ChangeLogService } from '../changelog';
import { Config } from '../../config';
import { D3Node, isD3Node, Link, ModelNodeAttribute, Twiglet, TwigletToSend, UserState, View, ViewNode } from './../../interfaces';
import { EventsService } from './events.service';
import { FilterByObjectPipe } from './../../../app/shared/pipes/filter-by-object.pipe';
import { handleError } from '../httpHelpers';
import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';
import { ModelService } from './model.service';
import { OverwriteDialogComponent } from './../../../app/shared/overwrite-dialog/overwrite-dialog.component';
import { StateCatcher } from '../index';
import { UserStateService } from '../userState';
import { ViewService } from './view.service';
import TWIGLET from './constants';
import NODE from './constants/node';
import EVENT from './constants/event';
import VIEW from './constants/view';
import VIEW_DATA from './constants/view/data';

interface IdOnly {
  id: string;
}

const locationInformationToSave = [
  NODE.GRAVITY_POINT,
  NODE.X,
  NODE.Y,
  NODE.HIDDEN,
  NODE.FX,
  NODE.FY,
  NODE.COLLAPSED,
  NODE.COLLAPSED_AUTOMATICALLY,
];

export class TwigletService {

  public changeLogService: ChangeLogService;
  public modelService: ModelService;
  public viewService: ViewService;
  public eventsService: EventsService;
  playbackSubscription: Subscription;

  private viewData: Map<string, any> = Map({});

  private allNodes: { [key: string]: D3Node } = {};
  private allNodesBackup: { [key: string]: D3Node };
  private allLinks: { [key: string]: Link } = {};
  private allLinksBackup: { [key: string]: Link };

  private _nodeTypes: BehaviorSubject<List<string>> = new BehaviorSubject(List([]));
  private _nodeTypesBackup: List<string> = null;

  private _twiglets: BehaviorSubject<List<any>> =
    new BehaviorSubject(List([]));

  private _twiglet: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map<string, any>({
      _rev: null,
      changelog_url: null,
      description: null,
      json_url: null,
      links: fromJS({}),
      model_url: null,
      name: null,
      nodes: fromJS({}),
      url: null,
      views_url: null,
    }));

  private _isDirty: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _originalTwiglet: Map<string, any> = null;

  private _twigletBackup: Map<string, any> = null;

  private _nodeLocations: BehaviorSubject<{ [key: string]: ViewNode }> =
    new BehaviorSubject({});

  private isSiteWide: boolean;

  constructor(private http: Http,
    private toastr: ToastrService,
    private router: Router,
    public modalService: NgbModal,
    siteWide = true,
    private userStateService: UserStateService = null,
    private ngZone: NgZone) {
    this.isSiteWide = siteWide;
    if (this.isSiteWide) {
      this.changeLogService = new ChangeLogService(http, this);
      this.viewService = new ViewService(http, this, toastr);
      this.viewService.observable.subscribe((viewData) => {
        const oldViewData = this.viewData;
        this.viewData = viewData;
        if (oldViewData.getIn([VIEW.DATA, VIEW_DATA.FILTERS]) !== this.viewData.getIn([VIEW.DATA, VIEW_DATA.FILTERS])
          || oldViewData.getIn([VIEW.DATA, VIEW_DATA.LEVEL_FILTER]) !== this.viewData.getIn([VIEW.DATA, VIEW_DATA.LEVEL_FILTER])) {
          this.updateNodesAndLinksOnTwiglet();
        }
      });
      this.modelService = new ModelService(http, router, this);
      this.eventsService =
        new EventsService(http, this.observable, this.nodeLocations, userStateService, toastr);
      this.updateListOfTwiglets();
    }
  }

  get dirty(): Observable<boolean> {
    return this._isDirty.asObservable();
  }

  get nodeTypes(): Observable<List<string>> {
    return this._nodeTypes.asObservable();
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
  get nodeLocations(): Observable<{ [key: string]: ViewNode }> {
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
    this._isDirty.next(false);
    this._twigletBackup = this._twiglet.getValue();
    this._nodeTypesBackup = this._nodeTypes.getValue();
    this.allLinksBackup = this._twiglet.getValue().get(TWIGLET.LINKS).toJS();
    this.allNodesBackup = this._twiglet.getValue().get(TWIGLET.NODES).toJS();
  }

  /**
   * Restores a backup of the twiglet.
   *
   * @returns {boolean}
   *
   * @memberOf TwigletService
   */
  restoreBackup(): boolean {
    this._isDirty.next(false);
    this.userStateService.stopSpinner();
    if (this._twigletBackup) {
      this.allLinks = this.allLinksBackup;
      this.allNodes = this.allNodesBackup;
      this._nodeTypes.next(this._nodeTypesBackup);
      this._twiglet.next(this._twigletBackup);
      this.modelService.restoreBackup();
      this.allLinksBackup = null;
      this.allNodesBackup = null;
      this._nodeTypesBackup = null;
      this._twigletBackup = null;
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
    this.http.get(`${Config.apiUrl}/${Config.twigletsFolder}`).pipe(map((res: Response) => res.json()))
      .subscribe(response => {
        this._twiglets.next(fromJS(response).sort((a, b) => a.get(TWIGLET.NAME).localeCompare(b.get(TWIGLET.NAME))));
      });
  }

  /**
   * GETs a twiglet from the server.
   *
   * @param {any} name the name of the twiglet to be loaded.
   *
   * @memberOf TwigletService
   */
  loadTwiglet(name, viewName?): Observable<{
    modelFromServer: any;
    twigletFromServer: Twiglet;
    viewFromServer: View;
  }> {
    this.userStateService.startSpinner();
    return this.http.get(`${Config.apiUrl}/${Config.twigletsFolder}/${name}`).pipe(
      map((res: Response) => res.json()),
      mergeMap((results) => this.processLoadedTwiglet.bind(this)(results, viewName)),
      catchError((error) => {
        handleError.bind(this)(error);
        this.userStateService.stopSpinner();
        return observableThrowError(error);
      })) as any;
  }

  /**
   * Processes a loaded twiglet from the server
   *
   * @param {any} twigletFromServer
   * @returns
   *
   * @memberOf TwigletService
   */
  private processLoadedTwiglet(twigletFromServer: Twiglet, viewName?): Observable<{
    modelFromServer: any;
    twigletFromServer: Twiglet;
    viewFromServer: View;
  }> {
    this._twiglet.next(fromJS({ name: '', nodes: Map({}), links: Map({}) }));
    return this.http.get(twigletFromServer.model_url).pipe(map((res: Response) => res.json()),
      mergeMap(modelFromServer =>
        this.viewService.loadView(twigletFromServer.views_url, viewName).pipe(
          // This handles errors from loading the view or if no view name is passed in.
          catchError((error) => {
            return observableOf(<View>{
              links: {},
              nodes: {},
            })
          }), mergeMap((viewFromServer) => {
            if (this.isSiteWide) {
              this.modelService.clearModel();
              this.clearLinks();
              this.clearNodes();
              const model = merge(modelFromServer, { url: twigletFromServer.model_url });
              this.modelService.setModel(model);
            }
            this._nodeLocations.next(viewFromServer.nodes);
            this.allLinks = mergeDeepLeft(viewFromServer.links, (twigletFromServer.links as Link[]).reduce(arrayToIdMappedObject, {}));
            this.allNodes = (twigletFromServer.nodes as D3Node[]).reduce(arrayToIdMappedObject, {});
            const { links, nodes } = this.getFilteredNodesAndLinks();
            const twigletLinks = <Map<string, any>>convertArrayToMapForImmutable(links);
            const twigletNodes = <Map<string, any>>convertArrayToMapForImmutable(nodes)
              .mergeDeep(fromJS(viewFromServer.nodes))
              .filter(node => node.get(NODE.TYPE) !== undefined);
            const editableViewFromServer = clone(viewFromServer);
            Reflect.ownKeys(editableViewFromServer.nodes).forEach((id: string) => {
              if (!twigletNodes.get(id)) {
                delete editableViewFromServer.nodes[id];
              }
            });

            const newTwiglet = {
              _rev: twigletFromServer._rev,
              changelog_url: twigletFromServer.changelog_url,
              description: twigletFromServer.description,
              events_url: twigletFromServer.events_url,
              json_url: twigletFromServer.json_url,
              links: twigletLinks,
              model_url: twigletFromServer.model_url,
              name: twigletFromServer.name,
              nodes: twigletNodes.mergeDeep(<any>editableViewFromServer.nodes),
              sequences_url: twigletFromServer.sequences_url,
              url: twigletFromServer.url,
              views_url: twigletFromServer.views_url,
            };
            this._twiglet.next(fromJS(newTwiglet));
            if (this.changeLogService) {
              this.changeLogService.refreshChangelog();
            }
            this._originalTwiglet = this._twiglet.getValue();
            this.userStateService.stopSpinner();
            this._isDirty.next(false);
            return observableOf({
              modelFromServer,
              twigletFromServer,
              viewFromServer,
            });
          }))
      ));
  }

  /**
   * Clears the current twiglet
   *
   *
   * @memberOf TwigletService
   */
  clearCurrentTwiglet() {
    this._isDirty.next(false);
    this.modelService.forceClean();
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
      this.userStateService.startSpinner();
      this.eventsService.getEvent(id).subscribe(event => {
        this.userStateService.setCurrentEvent(id);
        this.replaceNodesAndLinks(event.nodes, event.links);
      });
    } else {
      this.userStateService.setCurrentEvent(null);
      this.showOriginal();
    }
  }

  /**
   * Loads and shows the previous event if one exists
   *
   *
   *
   * @memberOf TwigletService
   */
  previousEvent() {
    const previous = this.eventsService.stepBack();
    if (previous) {
      this.showEvent(previous.get(EVENT.ID));
    } else {
      this.toastr.warning('no events selected', null);
    }
  }

  /**
   * Loads and shows the next event if one exists
   *
   *
   *
   * @memberOf TwigletService
   */
  nextEvent() {
    const next = this.eventsService.stepForward();
    if (next) {
      this.showEvent(next.get(EVENT.ID));
    } else {
      this.toastr.warning('no events selected', null);
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
      this._originalTwiglet.get(TWIGLET.NODES).valueSeq().toJS(),
      this._originalTwiglet.get(TWIGLET.LINKS).valueSeq().toJS()
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
          this.userStateService.setCurrentEvent(event.id);
          this.replaceNodesAndLinks(event.nodes, event.links);
        }
      }, (error) => {
        this.toastr.warning(error, null);
        this.userStateService.setPlayingBack(false);
      }, () => {
        this.userStateService.setPlayingBack(false);
      });
  }

  /**
   * Stops the playback of events.
   *
   *
   * @memberOf TwigletService
   */
  stopPlayback() {
    this.userStateService.setPlayingBack(false);
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
    this._twiglet.next(this._twiglet.getValue().set(TWIGLET.NAME, name));
  }

  /**
   * Sets the description of the twiglet.
   *
   * @param {string} description
   *
   * @memberOf TwigletService
   */
  setDescription(description: string) {
    this._twiglet.next(this._twiglet.getValue().set(TWIGLET.DESCRIPTION, description));
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
    return this.http.delete(`${Config.apiUrl}/${Config.twigletsFolder}/${name}`, options).pipe(map((res: Response) => res.json()));
  }

  /**
   * Saves changes to the currently loaded twiglet.
   *
   * @param {string} commitMessage
   * @param {string} userId
   * @returns
   *
   * @memberOf TwigletService
   */
  saveChanges(commitMessage: string, userId?: string, _rev?: string): Observable<any> {
    const twiglet = this._twiglet.getValue();
    const twigletToSend: TwigletToSend = {
      _rev: _rev || twiglet.get(TWIGLET._REV),
      commitMessage: commitMessage,
      description: twiglet.get(TWIGLET.DESCRIPTION),
      doReplacement: _rev ? true : false,
      links: convertMapToArrayForUploading<Link>(twiglet.get(TWIGLET.LINKS)),
      name: twiglet.get(TWIGLET.NAME),
      nodes: convertMapToArrayForUploading<D3Node>(twiglet.get(TWIGLET.NODES))
        .map(this.sanitizeNodesAndGetTrueLocation.bind(this)) as D3Node[],
    };
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(this._twiglet.getValue().get(TWIGLET.URL), twigletToSend, options).pipe(
      map((res: Response) => res.json()),
      mergeMap((newTwiglet: Twiglet) => {
        this.setRev(newTwiglet._rev);
        if (this.isSiteWide) {
          this.changeLogService.refreshChangelog();
          this.viewService.refreshViews();
        }
        this._isDirty.next(false);
        this.toastr.success(`${newTwiglet.name} saved`, null);
        return observableOf(newTwiglet);
      }), catchError(failResponse => {
        if (failResponse.status === 409) {
          const updatedTwiglet = JSON.parse(failResponse._body).data;
          if (updatedTwiglet.latestCommit.user === userId) {
            return this.saveChanges(commitMessage, userId, updatedTwiglet._rev);
          } else {
            const modelRef = this.modalService.open(OverwriteDialogComponent);
            const component = <OverwriteDialogComponent>modelRef.componentInstance;
            component.commit = updatedTwiglet.latestCommit;
            return component.userResponse.asObservable().pipe(mergeMap(userResponse => {
              if (userResponse === true) {
                modelRef.close();
                return this.saveChanges(commitMessage, userId, updatedTwiglet._rev);
              } else if (userResponse === false) {
                modelRef.close();
                return observableOf(failResponse);
              }
            }));
          }
        }
        return observableThrowError(failResponse);
      }));
  }

  /**
   * Adds a node to the twiglet.
   *
   * @param {D3Node} newNode the new node to be added.
   *
   * @memberOf TwigletService
   */
  addNode(newNode: D3Node) {
    this.addNodes([newNode]);
  }

  /**
   * Adds an array of nodes to the twiglet.
   *
   * @param {D3Node[]} newNodes an array of nodes be to be added.
   *
   * @memberOf TwigletService
   */
  addNodes(newNodes: D3Node[]) {
    newNodes.reduce((allNodes, node) => {
      allNodes[node.id] = node;
      return allNodes;
    }, this.allNodes);
    this.updateNodesAndLinksOnTwiglet();
  }

  /**
   * Removes all of the nodes from the twiglet.
   *
   *
   * @memberOf TwigletService
   */
  clearNodes() {
    this.allNodes = {};
    this.updateNodesAndLinksOnTwiglet();
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
      Reflect.ownKeys(this.allNodes).map(key => this.allNodes[key as string]).reduce((object, node) => {
        if (node.type === oldType) {
          needToUpdate = true;
          const updateNode = merge(node, { type: newType });
          object[updateNode.id] = updateNode;
          return object;
        }
        object[node.id] = node;
        return object;
      }, this.allNodes);
      if (needToUpdate) {
        this.updateNodesAndLinksOnTwiglet();
      }
    }
  }

  /**
   * Removes a certain paramer for a node
   *
   * @param {id} string The id of the node to be updated
   * @param {key} string The parameter of the node to be updated
   * @param {value} string The value to apply to the parameter
   *
   * @memberOf TwigletService
   */
  updateNodeParam(id, key, value) {
    if (locationInformationToSave.includes(key)) {
      const nodeLocations = this._nodeLocations.getValue();
      nodeLocations[id][key] = value;
      this._nodeLocations.next(nodeLocations);
      this.updateNodesAndLinksOnTwiglet();
    } else {
      const updateNode = merge(this.allNodes[id], { [key]: value });
      this.allNodes = merge(this.allNodes, { [updateNode.id]: updateNode });
      this.updateNodesAndLinksOnTwiglet();
    }
  }

  /**
   * Updates a single node on the twiglet. Contains a state catcher so that D3 doesn't keep looping
   * on itself when it pushes x and y updates and think it needs to recalculate again and again and again.
   *
   * @param {D3Node} updatedNode The node to be updated, requires ID and any other changes being made.
   * @param {StateCatcher} [stateCatcher] alerts the caller of the state before it is pushed.
   *                                      Don't use it, unless you are working on D3 stuff. Seriously.
   *
   * @memberOf TwigletService
   */
  updateNode(updatedNode: D3Node) {
    this.updateNodes([updatedNode]);
    this.viewService.markAsDirty();
  }

  /**
   * Updates multiple nodes on the twiglet. Contains a state catcher so that D3 doesn't keep looping
   * on itself when it pushes x and y updates and think it needs to recalculate again and again and again.
   *
   * @param {D3Node[]} updatedNodes the array of nodes to be updated, requires ID and any other changes being made.
   * @param {StateCatcher} [stateCatcher] alerts the caller of the state before it is pushed.
   *                                      Don't use it, unless you are working on D3 stuff. Seriously.
   *
   * @memberOf TwigletService
   */
  updateNodes(updatedNodes: D3Node[]) {
    updatedNodes.reduce((allNodes, node) => {
      allNodes[node.id] = node;
      return allNodes;
    }, this.allNodes);
    this.updateNodesAndLinksOnTwiglet();
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
    this.allNodes = updatedNodes.reduce(arrayToIdMappedObject, {});
    this.allLinks = updatedLinks.reduce(arrayToIdMappedObject, {});
    this.updateNodesAndLinksOnTwiglet();
    this.userStateService.stopSpinner();
  }

  /**
   * Replaces all of the nodes and links.
   *
   * @param {D3Node[]} updatedNodes
   * @param {Link[]} updatedLinks
   *
   * @memberOf TwigletService
   */
  collapseNode(d3NodeId: string) {
    const linkSourceMap = getSourceMap(this.allNodes, this.allLinks);
    const nodeLocations = this._nodeLocations.getValue();
    const d3NodeLocation = nodeLocations[d3NodeId];
    const d3Node = this.allNodes[d3NodeId];
    d3NodeLocation.collapsedAutomatically = false;
    d3NodeLocation.collapsed = true;
    (linkSourceMap[d3NodeId] || []).forEach(link => {
      const targetLocation = nodeLocations[<string>link.target];
      const target = this.allNodes[<string>link.target];
      (linkSourceMap[target.id] || []).forEach(targetLink => {
        if (targetLink.sourceOriginal) {
          targetLink.sourceOriginal.push(target.id);
        } else {
          targetLink.sourceOriginal = [target.id];
        }
        targetLink.source = d3Node.id;
      });
      targetLocation.collapsedAutomatically = true;
      targetLocation.hidden = true;
    });
    this._nodeLocations.next(nodeLocations);
    this.pushCollapseOrExpand();
  }

  /**
   * Replaces all of the nodes and links.
   *
   * @param {D3Node[]} updatedNodes
   * @param {Link[]} updatedLinks
   *
   * @memberOf TwigletService
   */
  collapseNodeCascade(d3NodeId: string, suppliedNodeLocations = null) {
    const linkSourceMap = getSourceMap(this.allNodes, this.allLinks);
    const nodeLocations = suppliedNodeLocations ? suppliedNodeLocations : this._nodeLocations.getValue();
    const d3NodeLocation = nodeLocations[d3NodeId];
    const d3Node = this.allNodes[d3NodeId];
    d3NodeLocation.collapsed = true;
    (linkSourceMap[d3NodeId] || []).forEach(link => {
      const targetLocation = nodeLocations[<string>link.target];
      const target = this.allNodes[<string>link.target];
      // Check for undefined and others
      if (targetLocation.collapsedAutomatically !== false) {
        targetLocation.collapsedAutomatically = true;
      }
      targetLocation.hidden = true;
      this.collapseNodeCascade.bind(this)(target.id, nodeLocations);
    });
    if (!suppliedNodeLocations) {
      this._nodeLocations.next(nodeLocations);
      this.pushCollapseOrExpand();
    }
  }

  flowerNode(d3NodeId: string) {
    const linkSourceMap = getSourceMap(this.allNodes, this.allLinks);
    const nodeLocations = this._nodeLocations.getValue();
    const d3NodeLocation = nodeLocations[d3NodeId];
    const d3Node = this.allNodes[d3NodeId];
    delete d3NodeLocation.collapsedAutomatically;
    d3NodeLocation.collapsed = false;
    (linkSourceMap[d3Node.id] || []).forEach(link => {
      if (link.sourceOriginal && link.sourceOriginal.length) {
        const source = link.sourceOriginal.pop();
        const sourceLocation = nodeLocations[source];
        link.source = source;
        delete sourceLocation.collapsedAutomatically;
        sourceLocation.hidden = false;
      } else {
        const targetLocation = nodeLocations[<string>link.target];
        if (targetLocation.collapsedAutomatically) {
          delete targetLocation.collapsedAutomatically;
          targetLocation.hidden = false;
        }
      }
    });
    this._nodeLocations.next(nodeLocations);
    this.pushCollapseOrExpand();
  }

  flowerNodeCascade(d3NodeId: string, suppliedNodeLocations = null) {
    const linkSourceMap = getSourceMap(this.allNodes, this.allLinks);
    const nodeLocations = suppliedNodeLocations ? suppliedNodeLocations : this._nodeLocations.getValue();
    const d3NodeLocation = nodeLocations[d3NodeId];
    const d3Node = this.allNodes[d3NodeId];
    delete d3NodeLocation.collapsedAutomatically;
    d3NodeLocation.collapsed = false;
    (linkSourceMap[d3Node.id] || []).forEach(link => {
      const target = this.allNodes[<string>link.target];
      const targetLocation = nodeLocations[<string>link.target];
      if (targetLocation.collapsedAutomatically) {
        delete targetLocation.collapsedAutomatically;
        targetLocation.hidden = false;
      }
      this.flowerNodeCascade.bind(this)(target.id, nodeLocations);
    });
    if (!suppliedNodeLocations) {
      this._nodeLocations.next(nodeLocations);
      this.pushCollapseOrExpand();
    }
  }

  pushCollapseOrExpand() {
    const nodeLocations = this._nodeLocations.getValue();
    this.viewService.markAsDirty();
    const twiglet = this._twiglet.getValue();
    const { nodes, links } = this.getFilteredNodesAndLinks();
    const nodesMap = convertArrayToMapForImmutable(nodes);
    const linksMap = convertArrayToMapForImmutable(links);
    const filteredLocations = Reflect
      .ownKeys(nodeLocations)
      .filter((key) => nodesMap.get(key as string) !== undefined)
      .reduce((object, key) => {
        object[key] = nodeLocations[key as string];
        return object;
      }, {});
    const nodesMapWithLocations = nodesMap.mergeDeep(filteredLocations);
    this._twiglet.next(twiglet.set(TWIGLET.NODES, nodesMapWithLocations).set(TWIGLET.LINKS, linksMap));
  }

  /**
   * Called from D3 to update node locations.
   *
   * @param {D3Node[]} nodes
   *
   * @memberOf TwigletService
   */
  updateNodeCoordinates(nodes: D3Node[]) {
    const coordinates = [NODE.X, NODE.Y, NODE.FX, NODE.FY];
    this.ngZone.runOutsideAngular(() => {
      const newNodeLocations = clone(this._nodeLocations.getValue());
      nodes.forEach(node => {
        coordinates.forEach(key => {
          if (!newNodeLocations[node.id]) {
            newNodeLocations[node.id] = {};
          }
          newNodeLocations[node.id][key] = node[key];
        });
      });
      this._nodeLocations.next(newNodeLocations);
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
    removedNodes.reduce((allNodes, node) => {
      delete allNodes[node.id];
      return allNodes;
    }, this.allNodes);
    this.updateNodesAndLinksOnTwiglet();
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
    newLinks.reduce((allLinks, link) => {
      allLinks[link.id] = link;
      return allLinks;
    }, this.allLinks);
    this.updateNodesAndLinksOnTwiglet();
  }

  /**
   * Removes all of the links from the twiglet.
   *
   *
   * @memberOf TwigletService
   */
  clearLinks() {
    this.allLinks = {};
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
    updatedLinks.reduce((allLinks, link) => {
      allLinks[link.id] = link;
      return allLinks;
    }, this.allLinks);
    this.updateNodesAndLinksOnTwiglet();
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
    removedLinks.reduce((allLinks, link) => {
      delete allLinks[link.id];
      return allLinks;
    }, this.allLinks);
    this.updateNodesAndLinksOnTwiglet();
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
    if (this._nodeLocations.getValue()[d3Node.id]) {
      nodeLocation = this._nodeLocations.getValue()[d3Node.id];
    }
    const sanitizedNode = pick([
      'id',
      'name',
      'size',
      'type',
      '_color',
      '_size'
    ], merge(d3Node, nodeLocation)) as any as D3Node;
    sanitizedNode.attrs = (d3Node.attrs || []).map(cleanAttribute);
    return sanitizedNode;
  }

  private setRev(rev) {
    // Need to send in the locations in case we are still in editing mode and don't get and tick refreshes
    const twiglet = this._twiglet.getValue();
    const locations = this._nodeLocations.getValue();
    const nodes = <Map<string, any>>twiglet.get(TWIGLET.NODES);
    const nodesWithLocations = nodes.mergeDeep(locations);
    this._twiglet.next(twiglet.set(TWIGLET._REV, rev).set(TWIGLET.NODES, nodesWithLocations));
  }

  private setDepths(
    linkSourceMap: { [key: string]: string[] },
    linkTargetMap: { [key: string]: string[] }): number {
    let currentLayer = Reflect.ownKeys(this.allNodes)
      .filter(node => linkSourceMap[node as string] && !linkTargetMap[node as string])
      .map(nodeId => this.allNodes[nodeId as string]);
    let nextLayer = [];
    let layer = 0;
    while (currentLayer.length) {
      const node = currentLayer.shift();
      if (node && !node.depth) {
        node.depth = layer;
        (linkSourceMap[node.id] || []).forEach(linkId => {
          const targetId = <string>this.allLinks[linkId].target;
          const target = this.allNodes[targetId];
          nextLayer.push(target);
        });
      }
      if (currentLayer.length === 0 && nextLayer.length > 0) {
        layer += 1;
        currentLayer = nextLayer.map(n => n);
        nextLayer = [];
      }
    }
    let maxDepth = 0;
    Reflect.ownKeys(this.allNodes).map(key => this.allNodes[key as string]).forEach(node => {
      if (node.depth > maxDepth) {
        maxDepth = node.depth;
      }
    });
    return maxDepth;
  }

  private getFilteredNodesAndLinks(): { links: Link[], nodes: D3Node[] } {
    const nodeLocations = this._nodeLocations.getValue();
    const allNodesArray = Reflect.ownKeys(this.allNodes).map(key => this.allNodes[key as string]);
    const nodeTypes = [];
    allNodesArray.forEach(node => {
      node.depth = null;
      if (!nodeTypes.includes(node.type)) {
        nodeTypes.push(node.type);
      }
    });
    this._nodeTypes.next(fromJS(nodeTypes));
    const allLinksArray = Reflect.ownKeys(this.allLinks).map(key => this.allLinks[key as string]);
    const filterByObject = new FilterByObjectPipe();;
    const linkSourceMap = {};
    const linkTargetMap = {};

    allLinksArray.forEach(link => {
      if (link.source && link.target) {
        if (!linkSourceMap[(link.source as string)]) {
          linkSourceMap[(link.source as string)] = [link.id];
        } else {
          linkSourceMap[(link.source as string)].push(link.id);
        }

        if (!linkTargetMap[(link.target as string)]) {
          linkTargetMap[(link.target as string)] = [link.id];
        } else {
          linkTargetMap[(link.target as string)].push(link.id);
        }
      }
    });
    const maxDepth = this.setDepths(linkSourceMap, linkTargetMap);
    this.userStateService.setLevelFilterMax(maxDepth);

    let nodes = filterByObject
      .transform(allNodesArray, allLinksArray, this.viewData.getIn([VIEW.DATA, VIEW_DATA.FILTERS]))
      .filter((d3Node: D3Node) => {
        return !d3Node.hidden;
      })
      .filter((d3Node: D3Node) => {
        return !nodeLocations[d3Node.id] || nodeLocations[d3Node.id].hidden !== true;
      });

    if (this.viewData.getIn([VIEW.DATA, VIEW_DATA.LEVEL_FILTER]) !== '-1'
      && this.viewData.getIn([VIEW.DATA, VIEW_DATA.LEVEL_FILTER]) !== -1) {
      nodes = nodes.filter(node => node.depth !== null && node.depth <= this.viewData.getIn([VIEW.DATA, VIEW_DATA.LEVEL_FILTER]));
    }

    const filteredNodesObject = nodes.reduce(arrayToIdMappedObject, {});

    // Need to make this a hashset for node lookup.
    const links = allLinksArray.filter((link: Link) => {
      return !link.hidden
        && filteredNodesObject[link.source as string]
        && filteredNodesObject[link.target as string];
    });

    return { nodes, links };
  }

  private updateNodesAndLinksOnTwiglet() {
    const twiglet = this._twiglet.getValue();
    const { nodes, links } = this.getFilteredNodesAndLinks();
    const nodesMap = convertArrayToMapForImmutable(nodes);
    const linksMap = convertArrayToMapForImmutable(links);
    const locations = this._nodeLocations.getValue();
    const filteredLocations = Reflect
      .ownKeys(locations)
      .filter((key) => nodesMap.get(key as string) !== undefined)
      .reduce((object, key) => {
        object[key] = locations[key as string];
        return object;
      }, {});
    const nodesMapWithLocations = nodesMap.mergeDeep(filteredLocations);
    this._twiglet.next(twiglet.set(TWIGLET.NODES, nodesMapWithLocations).set(TWIGLET.LINKS, linksMap));
    if (this._twigletBackup &&
      (!equals(nodesMap.toJS(), this._twigletBackup.get(TWIGLET.NODES).toJS())
        || !equals(linksMap.toJS(), this._twigletBackup.get(TWIGLET.LINKS).toJS()))) {
      this._isDirty.next(true);
    } else {
      this._isDirty.next(false);
    }
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
 * @param {Map<string, any>} sourceMap
 * @returns {K[]}
 */
export function convertMapToArrayForUploading<K>(sourceMap: Map<string, any>): K[] {
  const mapAsJs = sourceMap.toJS();
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
 * @returns {Map<string, Map<string, any>}
 */
export function convertArrayToMapForImmutable<K>(array: any[]): Map<string, Map<string, any>> {
  return array.reduce((mutable, node) => {
    return mutable.set(node.id, fromJS(node));
  }, Map({}).asMutable()).asImmutable();
}

function arrayToIdMappedObject(object, o: D3Node | Link): { [key: string]: typeof o } {
  object[o.id] = o;
  return object;
}

function getSourceMap(allNodes: { [key: string]: D3Node }, allLinks: { [key: string]: Link }): { [key: string]: Link[] } {
  const linkSourceMap = {};
  Reflect.ownKeys(allLinks).map(key => allLinks[key as string]).forEach((link) => {
    // get a map of the links with source as the key
    if (linkSourceMap[(<string>link.source)]) {
      linkSourceMap[(<string>link.source)].push(link);
    } else {
      linkSourceMap[(<string>link.source)] = [link];
    }
  });
  return linkSourceMap;
}
