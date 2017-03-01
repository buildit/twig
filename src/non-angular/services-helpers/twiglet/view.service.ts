import { TwigletService } from './index';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromJS, Map, OrderedMap, List } from 'immutable';

import { View } from '../../interfaces';
import { apiUrl, twigletsFolder } from '../../config';

export interface Parent {
  observable: Observable<Map<string, any>>;
}

export class ViewService {

      private viewsUrl;


    /**
     * The actual item being observed. Private to preserve immutability.
     *
     * @private
     * @type {BehaviorSubject<OrderedMap<string, Map<string, any>>>}
     * @memberOf ViewService
     */

    private _views: BehaviorSubject<List<Map<string, any>>> =
        new BehaviorSubject(List<Map<string, any>>([Map<string, any>({})]));

    // private _viewBackup: OrderedMap<string, Map<string, any>> = null;

    private _events: BehaviorSubject<string> =
        new BehaviorSubject('initial');

    constructor(private http: Http, parent: Parent) {
      parent.observable.subscribe(p => {
        if (p.get('viewsUrl') !== this.viewsUrl) {
          this.viewsUrl = p.get('viewsUrl');
          this.refreshViews();
        }
      });
    }

    get observable(): Observable<List<Map<string, any>>> {
        return this._views.asObservable();
    }

    refreshViews() {
        if (this.viewsUrl) {
            this.http.get(this.viewsUrl).map((res: Response) => res.json()).subscribe(response => {
                this._views.next(fromJS(response.views));
            });
        }
    }
}
