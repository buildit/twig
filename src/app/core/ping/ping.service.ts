import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Config } from './../../../non-angular/config';

@Injectable()
export class PingService {

  constructor(private http: Http) {
  }

  getPing() {
    const url = `${Config.apiUrl}/ping`;
    return this.http.get(url).map((res: Response) => res.json());
  }

}
