import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../index';
import { Link } from '../../interfaces/twiglet';

/**
 * Contains all of the information and modifiers for the twiglet links.
 *
 * @export
 * @class LinksService
 */
export class LinksService {

  /**
   * The actual item being observed. Private to preserve immutability.
   *
   * @private
   * @type {BehaviorSubject<OrderedMap<string, Map<string, Link>>>}
   * @memberOf LinksService
   */
  private _links: BehaviorSubject<OrderedMap<string, Map<string, Link>>> =
    new BehaviorSubject(OrderedMap<string, Map<string, Link>>(fromJS({})));

  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, Link>>>}
   * @memberOf LinksService
   */
  get observable(): Observable<OrderedMap<string, Map<string, Link>>> {
    return this._links.asObservable();
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
    const mutableLinks = this._links.getValue().asMutable();
    const newState = newLinks.reduce((mutable, link) => {
      return mutable.set(link.id, fromJS(link));
    }, mutableLinks).asImmutable();
    this._links.next(newState);
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
    const mutableLinks = this._links.getValue().asMutable();
    const newState = updatedLinks.reduce((mutable, link) => {
      const currentLink = mutableLinks.get(link.id).toJS();
      return mutable.set(link.id, fromJS(merge(currentLink, link)));
    }, mutableLinks).asImmutable();
    this._links.next(newState);
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
    const mutableLinks = this._links.getValue().asMutable();
    const newState = removedLinks.reduce((mutable, link) => {
      return mutable.delete(link.id);
    }, mutableLinks).asImmutable();
    this._links.next(newState);
  }
}

/**
 * Stub for testing, do not use in production.
 *
 * @export
 * @class LinksServiceStub
 * @extends {LinksService}
 */
export class LinksServiceStub extends LinksService {

  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return new BehaviorSubject(OrderedMap<string, Map<string, any>>(fromJS({
      firstNode: Map({
        association: 'firstLink',
        id: 'firstLink',
        source: 'firstNode',
        target: 'secondNode',
      }),
      secondNode: Map({
        association: 'secondLink',
        id: 'secondLink',
        source: 'firstNode',
        target: 'thirdNode',
      }),
    })));
  }


  addLink(newLink: Link) { }

  addLinks(newLinks: Link[]) { }

  updateLink(updatedLink: Link) { }

  updateLinks(updatedLinks: Link[]) { }

  removeLink(removedLink: Link) { }

  removeLinks(removedLink: Link[]) { }

  bulkReplaceLinks(newLinks: Link[]) { }
}
