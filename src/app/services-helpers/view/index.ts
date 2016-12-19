import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map } from 'immutable';

import { D3Node } from '../../interfaces';

export class ViewService {
  private _view: BehaviorSubject<Map<string, any>> =
    new BehaviorSubject(Map({
      currentNode: null,
      isEditing: false,
    }));

  get observable(): Observable<Map<string, any>> {
    return this._view.asObservable();
  }

  setCurrentNode(node: string) {
    this._view.next(this._view.getValue().set('currentNode', node));
  }

  clearCurrentNode() {
    this._view.next(this._view.getValue().set('currentNode', null));
  }

  setEditing(bool: boolean) {
    this._view.next(this._view.getValue().set('isEditing', bool));
  }

  toggleEditing() {
    this.setEditing(!this._view.getValue().get('isEditing'));
  }
}

export interface ViewServiceResponse {
  currentNode: string;
  isEditing: boolean;
}


/**
 * Convienience function to set an object in the calling class from our response.
 *
 * @export
 * @param {Map<string, any>} response
 */
export function viewServiceResponseToObject (response: Map<string, any>) {
  this.view = response.toJS();
}
