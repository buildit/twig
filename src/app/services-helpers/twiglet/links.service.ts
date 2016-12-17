import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { merge } from 'ramda';
import { Link } from '../../interfaces/twiglet';

export class LinksService {

  private _links: BehaviorSubject<List<Link>> = new BehaviorSubject(List([]));

  get observable(): Observable<List<Link>> {
    return this._links.asObservable();
  }

  addLink(newlink: Link) {
    this._links.next(this._links.getValue().push(newlink));
  }

  updateLink(updatedlink: Link) {
    let links = this._links.getValue();
    let index = links.findIndex((link: Link) => link.id === updatedlink.id);
    let link = links.get(index);
    this._links.next(links.set(index, merge(link, updatedlink)));
  }

  removeLink(linkToRemove: Link) {
    let links = this._links.getValue();
    let index = links.findIndex((link: Link) => link.id === linkToRemove.id);
    this._links.next(links.delete(index));
  }
}
