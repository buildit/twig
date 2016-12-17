import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { NextResponse, StateCatcher } from '../index';
import { Link } from '../../interfaces/twiglet';

export interface LinksActionResponse extends NextResponse {
  action: string;
  data: OrderedMap<string, Map<string, Link>>;
  payload: Link[];
}

class LinksActionReponseGenerator implements LinksActionResponse {
  action: string;
  data: OrderedMap<string, Map<string, Link>>;
  payload: Link[];
  constructor(action: string, data: OrderedMap<string, Map<string, Link>>, payload: Link[]) {
    this.action = action;
    this.data = data;
    this.payload = payload;
  }
}

export class LinksService {

  private _links: BehaviorSubject<LinksActionResponse> =
    new BehaviorSubject({
      action: null,
      data: OrderedMap<string, Map<string, any>>({}),
      payload: null,
    });

  get observable(): Observable<LinksActionResponse> {
    return this._links.asObservable();
  }

  addLink(newLink: Link, stateCatcher?: StateCatcher) {
    this.addLinks([newLink], stateCatcher);
  }

  addLinks(newLinks: Link[], stateCatcher?: StateCatcher) {
    const mutableLinks = this._links.getValue().data.asMutable();
    const newState = newLinks.reduce((mutable, link) => {
      return mutable.set(link.id, fromJS(link));
    }, mutableLinks).asImmutable();
    const next = new LinksActionReponseGenerator('addLink', newState, newLinks);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._links.next(next);
  }

  updateLink(updatedLink: Link, stateCatcher?: StateCatcher) {
    this.updateLinks([updatedLink], stateCatcher);
  }

  updateLinks(updatedLinks: Link[], stateCatcher?: StateCatcher) {
    const mutableLinks = this._links.getValue().data.asMutable();
    const newState = updatedLinks.reduce((mutable, link) => {
      const currentLink = mutableLinks.get(link.id).toJS();
      return mutable.set(link.id, fromJS(merge(currentLink, link)));
    }, mutableLinks).asImmutable();
    const next = new LinksActionReponseGenerator('updateLink', newState, updatedLinks);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._links.next(next);
  }

  removeLink(removedLink: Link, stateCatcher?: StateCatcher) {
    this.removeLinks([removedLink], stateCatcher);
  }

  removeLinks(removedLinks: Link[], stateCatcher?: StateCatcher) {
    const mutableLinks = this._links.getValue().data.asMutable();
    const newState = removedLinks.reduce((mutable, link) => {
      return mutable.delete(link.id);
    }, mutableLinks).asImmutable();
    const next = new LinksActionReponseGenerator('removeLink', newState, removedLinks);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._links.next(next);
  }

  bulkReplaceLinks(newLinks: Link[], stateCatcher?: StateCatcher) {
    const newState = fromJS(newLinks.reduce((object: Object, link: Link) => {
      object[link.id] = link;
      return object;
    }, {}));
    const next = new LinksActionReponseGenerator('bulkReplaceLinks', newState, newLinks);
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._links.next(next);
  }
}

export class LinksServiceStub extends LinksService {

  get observable(): Observable<NextResponse> {
    return new BehaviorSubject({
      action: null,
      data: OrderedMap<string, Map<string, any>>({}),
      payload: null,
    });
  }

  addLink(newLink: Link, stateCatcher?: StateCatcher) { }

  addLinks(newLinks: Link[], stateCatcher?: StateCatcher) { }

  updateLink(updatedLink: Link, stateCatcher?: StateCatcher) { }

  updateLinks(updatedLinks: Link[], stateCatcher?: StateCatcher) { }

  removeLink(removedLink: Link, stateCatcher?: StateCatcher) { }

  removeLinks(removedLink: Link[], stateCatcher?: StateCatcher) { }

  bulkReplaceLinks(newLinks: Link[], stateCatcher?: StateCatcher) { }
}
