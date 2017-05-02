import { ChangeLogService } from './../changelog/changelog.service';
import { successfulMockBackend, mockToastr } from '../../testHelpers';
import { UserState } from './../../interfaces/userState/index';
import { List, Map, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { EventsService } from './events.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TwigletService } from './index';



fdescribe('EventService', () => {
  let eventsService: EventsService;
  let parentBs: BehaviorSubject<Map<String, any>>;
  let http;
  let fakeToastr;

  beforeEach(() => {
    parentBs = new BehaviorSubject<Map<string, any>>(Map({
      events_url: '/events'
    }));
    const parent = {
      observable: parentBs.asObservable(),
    };
    http = new Http(successfulMockBackend, new BaseRequestOptions());
    fakeToastr = mockToastr();
    eventsService = new EventsService(http, parent as any, fakeToastr);
  });

  describe('constructor:parent subscription', () => {
    beforeEach(() => {
      spyOn(eventsService, 'refreshEvents');
      eventsService['fullyLoadedEvents']['some id'] = {};
      parentBs.next(Map({
        events_url: 'anotherTwiglet/events',
      }));
    });

    it('updates the url when a new twiglet is loaded', () => {
      expect(eventsService['eventsUrl']).toEqual('anotherTwiglet/events');
    });

    it('clears the fullyLoadedEvents', () => {
      expect(eventsService['fullyLoadedEvents']['some id']).toBe(undefined);
    });

    it('calls refreshEvents', () => {
      expect(eventsService.refreshEvents).toHaveBeenCalled();
    });
  });

  describe('observable', () => {
    it('returns the observable', () => {
      eventsService.observable.subscribe(response => {
        expect(response).not.toBe(null);
      });
    });
  });

  describe('getEvent', () => {
    it('returns the event if it is already loaded', () => {
      const event = {
        description: 'some description',
        id: 'some id',
        links: [],
        name: 'some name',
        nodes: [],
      };
      eventsService['fullyLoadedEvents']['some id'] = event;
      eventsService.getEvent('some id').subscribe(e => {
        expect(e).toEqual(event);
      });
    });

    it('can get events from the server if it does not have them', () => {
      eventsService.getEvent('e83d0978-6ecc-4102-a782-5b2b58798288').subscribe(e => {
        expect(e.name).toEqual('event name 1');
      });
    });

    it('caches the events as they are pulled from the server', () => {
      eventsService.getEvent('e83d0978-6ecc-4102-a782-5b2b58798288').subscribe(e => {
        expect(eventsService['fullyLoadedEvents']['e83d0978-6ecc-4102-a782-5b2b58798288'].name).toEqual('event name 1');
      });
    });
  });

  describe('cacheEvents', () => {
    it('can cacheEvents', () => {
      const ids = ['e83d0978-6ecc-4102-a782-5b2b58798288', 'e83d0978-6ecc-4102-a782-5b2b58798289'];
      eventsService.cacheEvents(ids).subscribe(response => {
        ids.forEach(id => {
          expect(eventsService['fullyLoadedEvents'][id]).not.toBe(undefined);
        });
      });
    });
  });

  describe('refreshEvents', () => {
    it('can get new events from the server', () => {
      eventsService['_events'].next(List([]));
      eventsService.refreshEvents();
      eventsService.observable.subscribe(events => {
        expect(events.size).toEqual(4);
      });
    });

    it('does not try anything if there is no url yet', () => {
      spyOn(http, 'get');
      parentBs.next(Map({}));
      eventsService.refreshEvents();
      expect(http.get).not.toHaveBeenCalled();
    });
  });

  describe('updateEventSequence', () => {
    it('can set checked to true on an event', () => {
      eventsService.updateEventSequence(0, true);
      eventsService.observable.subscribe(events => {
        expect(events.getIn([0, 'checked'])).toBeTruthy();
      });
    });

    it('can set checked to false on an event', () => {
      eventsService.updateEventSequence(0, true);
      eventsService.updateEventSequence(0, false);
      eventsService.observable.subscribe(events => {
        expect(events.getIn([0, 'checked'])).toBeUndefined();
      });
    });
  });
});
