import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { clone, merge } from 'ramda';

import { ChangeLogService, ChangeLogServiceStub } from './changelog.service';
export { ChangeLogService, ChangeLogServiceStub } from './changelog.service';
import { ModelService, ModelServiceStub } from './model.service';
export { ModelService, ModelServiceStub } from './model.service';
import { UserStateService } from '../userState';
import { StateCatcher } from '../index';
import { D3Node, isD3Node, Link } from '../../interfaces/twiglet';
import { apiUrl, modelsFolder, twigletsFolder } from '../../config';

export class TwigletService {

  public changeLogService: ChangeLogService;
  public modelService: ModelService;

  private _twiglet: BehaviorSubject<OrderedMap<string, Map<string, any>>> =
    new BehaviorSubject(Map<string, any>({
      description: null,
      links: fromJS({}),
      name: null,
      nodes: fromJS({})
    }));

  constructor(private http: Http, public userState: UserStateService) {
    this.changeLogService = new ChangeLogService();
    this.modelService = new ModelService();
  }
  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return this._twiglet.asObservable();
  }

  loadTwiglet(id, name) {
    this.userState.setCurrentTwiglet(name, id);
    let nodes = [];
    let links = [];
    this.getTwiglet(id).flatMap(data => {
      this.userState.setCurrentTwigletDescription(data.description);
      this.userState.setCurrentTwigletRev(data._rev);
      nodes = data.nodes;
      links = data.links;
      return this.getTwigletModel(data.model_url);
    }).subscribe(response => {
      this.clearLinks();
      this.clearNodes();
      this.modelService.clearModel();
      this.modelService.addModel(response);
      this.addNodes(nodes);
      this.addLinks(links);
    });
  }

  getTwiglet(id) {
    return this.http.get(`${apiUrl}/${twigletsFolder}/${id}`).map((res: Response) => res.json());
  }

  addTwiglet(body) {
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(`${apiUrl}/${twigletsFolder}`, body, options).map((res: Response) => {
      const result = res.json();
      return result;
    });
  }

  getTwigletModel(model_url) {
    return this.http.get(model_url).map((res: Response) => res.json());
  }

  saveChanges(id, rev, name, description, commit, nodes, links) {
    const twigletToSend = {
      _id: id,
      _rev: rev,
      commitMessage: commit,
      description: description,
      links: links,
      name: name,
      nodes: nodes,
    };
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.put(`${apiUrl}/${twigletsFolder}/${id}`, twigletToSend, options).map((res: Response) => {
      const result = res.json();
      return result;
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
    const twiglet = this._twiglet.getValue();
    const mutableNodes = twiglet.get('nodes').asMutable();
    const newSetOfNodes = newNodes.reduce((mutable, node) => {
      return mutable.set(node.id, fromJS(node));
    }, mutableNodes).asImmutable();
    console.log('object or array?');
    console.log(newSetOfNodes);
    console.log(newNodes);
    this._twiglet.next(twiglet.set('nodes', newSetOfNodes));
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
  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) {
    this.updateNodes([updatedNode], stateCatcher);
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
  updateNodes(updatedNodes: D3Node[], stateCatcher?: StateCatcher) {
    let twiglet = this._twiglet.getValue();
    const mutableNodes = twiglet.get('nodes').asMutable();
    const newSetOfNodes  = updatedNodes.reduce((mutable, node) => {
      const currentNode = mutableNodes.get(node.id).toJS();
      return mutable.set(node.id, fromJS(merge(currentNode, node)));
    }, mutableNodes).asImmutable();
    twiglet = twiglet.set('nodes', newSetOfNodes);
    if (stateCatcher) {
      stateCatcher.data = twiglet;
    }
    this._twiglet.next(twiglet);
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
    const twiglet = this._twiglet.getValue();
    const mutableNodes = twiglet.get('nodes').asMutable();
    const newSetOfNodes = removedNodes.reduce((mutable, node) => {
      return mutable.delete(node.id);
    }, mutableNodes).asImmutable();
    this._twiglet.next(twiglet.set('nodes', newSetOfNodes));
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
  removeLink(removedLink: Link) {
    this.removeLinks([removedLink]);
  }

  /**
   * Removes multiple links from the twiglet.
   *
   * @param {Link[]} removedLinks only needs { id }
   *
   * @memberOf LinksService
   */
  removeLinks(removedLinks: Link[]) {
    const twiglet = this._twiglet.getValue();
    const mutableLinks = twiglet.get('links').asMutable();
    const newSetOfLinks = removedLinks.reduce((mutable, link) => {
      return mutable.delete(link.id);
    }, mutableLinks).asImmutable();
    this._twiglet.next(twiglet.set('links', newSetOfLinks));
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

export class TwigletServiceStub extends TwigletService {
  public changeLogService: ChangeLogService;
  public modelService: ModelService;

  constructor (http, userState) {
    super(http, userState);
    this.changeLogService = new ChangeLogServiceStub();
    this.modelService = new ModelServiceStub();
  }

  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return new BehaviorSubject(OrderedMap<string, Map<string, any>>(fromJS({
      description: 'a description',
      links: {
          firstLink: Map({
          association: 'firstLink',
          id: 'firstLink',
          source: 'firstNode',
          target: 'secondNode',
        }),
        secondLink: Map({
          association: 'secondLink',
          id: 'secondLink',
          source: 'firstNode',
          target: 'thirdNode',
        }),
      },
      name: 'twiglet name',
      nodes: {
        firstNode: Map({
          attrs: [{ key: 'keyOne', value: 'valueOne' }, { key: 'keyTwo', value: 'valueTwo' }],
          id: 'firstNode',
          name: 'firstNodeName',
          type: 'ent1',
          x: 100,
          y: 100,
        }),
        secondNode: Map({
          attrs: [],
          id: 'secondNode',
          name: 'secondNodeName',
          type: 'ent2',
          x: 200,
          y: 300,
        }),
        thirdNode: Map({
          attrs: [],
          id: 'thirdNode',
          name: 'thirdNodeName',
          type: 'ent3',
        })
      }
    }))).asObservable();
  }

  addNode(newNode: D3Node) { }

  addNodes(newNodes: D3Node[]) { }

  updateNode(updatedNode: D3Node, stateCatcher?: StateCatcher) { }

  updateNodes(updatedNodes: D3Node[], stateCatcher?: StateCatcher) { }

  removeNode(removedNode: D3Node, stateCatcher?: StateCatcher) { }

  removeNodes(removedNodes: D3Node[]) { }

  bulkReplaceNodes(newNodes: D3Node[]) { }

  addLink(newLink: Link) { }

  addLinks(newLinks: Link[]) { }

  updateLink(updatedLink: Link) { }

  updateLinks(updatedLinks: Link[]) { }

  removeLink(removedLink: Link) { }

  removeLinks(removedLink: Link[]) { }

  bulkReplaceLinks(newLinks: Link[]) { }


}
