import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap } from 'immutable';
import { merge } from 'ramda';
import { StateCatcher } from '../index';
import { Link } from '../../interfaces/twiglet';

export class LinksService {

  private _links: BehaviorSubject<OrderedMap<string, Map<string, Link>>> =
    new BehaviorSubject(OrderedMap<string, Map<string, Link>>({}));

  get observable(): Observable<OrderedMap<string, Map<string, Link>>> {
    return this._links.asObservable();
  }

  addLink(newLink: Link, stateCatcher?: StateCatcher) {
    this.addLinks([newLink], stateCatcher);
  }

  addLinks(newLinks: Link[], stateCatcher?: StateCatcher) {
    const mutableLinks = this._links.getValue().asMutable();
    const newState = newLinks.reduce((mutable, link) => {
      return mutable.set(link.id, fromJS(link));
    }, mutableLinks).asImmutable();
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._links.next(newState);
  }

  updateLink(updatedLink: Link, stateCatcher?: StateCatcher) {
    this.updateLinks([updatedLink], stateCatcher);
  }

  updateLinks(updatedLinks: Link[], stateCatcher?: StateCatcher) {
    const mutableLinks = this._links.getValue().asMutable();
    const newState = updatedLinks.reduce((mutable, link) => {
      const currentLink = mutableLinks.get(link.id).toJS();
      return mutable.set(link.id, fromJS(merge(currentLink, link)));
    }, mutableLinks).asImmutable();
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._links.next(newState);
  }

  removeLink(removedLink: Link, stateCatcher?: StateCatcher) {
    this.removeLinks([removedLink], stateCatcher);
  }

  removeLinks(removedLinks: Link[], stateCatcher?: StateCatcher) {
    const mutableLinks = this._links.getValue().asMutable();
    const newState = removedLinks.reduce((mutable, link) => {
      return mutable.delete(link.id);
    }, mutableLinks).asImmutable();
    if (stateCatcher) {
      stateCatcher.data = newState;
    }
    this._links.next(newState);
  }
}

export class LinksServiceStub extends LinksService {

  get observable(): Observable<OrderedMap<string, Map<string, any>>> {
    return Observable.of(OrderedMap({
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
    }));
  }


  addLink(newLink: Link, stateCatcher?: StateCatcher) { }

  addLinks(newLinks: Link[], stateCatcher?: StateCatcher) { }

  updateLink(updatedLink: Link, stateCatcher?: StateCatcher) { }

  updateLinks(updatedLinks: Link[], stateCatcher?: StateCatcher) { }

  removeLink(removedLink: Link, stateCatcher?: StateCatcher) { }

  removeLinks(removedLink: Link[], stateCatcher?: StateCatcher) { }

  bulkReplaceLinks(newLinks: Link[], stateCatcher?: StateCatcher) { }
}
