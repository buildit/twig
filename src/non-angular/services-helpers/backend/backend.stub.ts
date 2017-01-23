import { Http } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Map, List } from 'immutable';
import { BackendService } from './';

export class BackendServiceStub extends BackendService {

  constructor(http: Http) {
    super(http);
  }
  /**
   * Returns an observable. Because BehaviorSubject is used, the current values are pushed
   * on the first subscription
   *
   * @readonly
   * @type {Observable<OrderedMap<string, Map<string, any>>>}
   * @memberOf NodesService
   */
  get observable(): Observable<Map<string, List<any>>> {
    return Observable.of(Map(
      {
        models: List([
          {
            _id: 'bsc',
            url: 'modelurl'
          },
          {
            _id: 'bsc - clone',
            url: 'modelurl2'
          },
        ]),
      twiglets: List([
        {
          _id: 'twig-14885221-536e-4160-8706-bbad7e2b7c28',
          changelog_url: 'changelogurl',
          description: '',
          googlesheet: '',
          model_url: 'modelurl',
          name: 'Twiggy',
          orgModel: 'mynewmodel',
          twiglet: '',
          url: 'twigleturl',
          views_url: 'viewsurl'
        },
        {
          _id: 'twig-171e7777-7d84-45d3-bd33-007612ca0179',
          changelog_url: 'changelogurl2',
          description: '',
          googlesheet: '',
          model_url: 'modelurl2',
          name: 'Demo Twiglet',
          orgModel: 'bsc',
          twiglet: '',
          url: 'twigleturl2',
          views_url: 'viewsurl2'
        },
      ]),
    }));
  }

  updateListOfModels() {
  }

  updateListOfTwiglets() {
  }
}
