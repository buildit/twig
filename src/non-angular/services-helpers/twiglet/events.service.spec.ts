import { ChangeLogService } from './../changelog/changelog.service';
import { successfulMockBackend, mockToastr } from '../../testHelpers';
import { UserState, Link, D3Node } from './../../interfaces';
import { OrderedMap, Map, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { EventsService } from './events.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TwigletService } from './index';

describe('eventsService', () => {
  let eventsService: EventsService;
  let parentBs: BehaviorSubject<Map<String, any>>;
  let nodeLocations: BehaviorSubject<Map<String, any>>;
  let http;
  let fakeToastr;
  let userStateBs;
  let userState;

  beforeEach(() => {
    userStateBs = new BehaviorSubject<Map<string, any>>(Map({
      playbackInterval: 0,
    }));
    userState = {
      loadUserState: jasmine.createSpy('loadUserState').and.returnValue(Observable.of('success')),
      observable: userStateBs.asObservable(),
      setPlayingBack: jasmine.createSpy('setPlayingBack'),
      startSpinner: jasmine.createSpy('startSpinner'),
      stopSpinner: jasmine.createSpy('stopSpinner'),
    };
    parentBs = new BehaviorSubject<Map<string, any>>(fromJS({
      events_url: '/events',
      links: {},
      nodes: {},
      sequences_url: '/sequences',
    }));
    nodeLocations = new BehaviorSubject<Map<string, any>>(Map({}));
    const parent = {
      observable: parentBs.asObservable(),
      nodeLocations,
    };

    http = new Http(successfulMockBackend, new BaseRequestOptions());
    fakeToastr = mockToastr();
    eventsService = new EventsService(http, parent as any, userState, fakeToastr);
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
    it('returns the events', () => {
      eventsService.events.subscribe(response => {
        expect(response).not.toBe(null);
      });
    });

    it('returns the sequences', () => {
      eventsService.sequences.subscribe(response => {
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
        expect(e.name).toEqual('event name e83d0978-6ecc-4102-a782-5b2b58798288');
      });
    });

    it('caches the events as they are pulled from the server', () => {
      eventsService.getEvent('e83d0978-6ecc-4102-a782-5b2b58798288').subscribe(e => {
        expect(eventsService['fullyLoadedEvents']['e83d0978-6ecc-4102-a782-5b2b58798288'].name)
          .toEqual('event name e83d0978-6ecc-4102-a782-5b2b58798288');
      });
    });
  });

  describe('cacheEvents', () => {
    it('can cacheEvents', () => {
      eventsService.updateEventSequence('e83d0978-6ecc-4102-a782-5b2b58798288', true);
      eventsService.updateEventSequence('e83d0978-6ecc-4102-a782-5b2b58798289', true);
      const ids = ['e83d0978-6ecc-4102-a782-5b2b58798288', 'e83d0978-6ecc-4102-a782-5b2b58798289'];
      eventsService.cacheEvents().subscribe(response => {
        ids.forEach(id => {
          expect(eventsService['fullyLoadedEvents'][id]).not.toBe(undefined);
        });
      });
    });

    it('starts the spinner', () => {
      eventsService.cacheEvents().subscribe(() => {});
      expect(userState.startSpinner).toHaveBeenCalled();
    });

    it('stops the spinner', () => {
      eventsService.updateEventSequence('e83d0978-6ecc-4102-a782-5b2b58798288', true);
      eventsService.cacheEvents().subscribe(() => {});
      expect(userState.stopSpinner).toHaveBeenCalled();
    });

    it('returns an empty observable', () => {
      eventsService.updateEventSequence('e83d0978-6ecc-4102-a782-5b2b58798288', true);
      eventsService.cacheEvents().subscribe((response) => {
        expect(response).toEqual({});
      });
    });
  });

  describe('refreshEvents', () => {
    it('can get new events from the server', () => {
      eventsService['_events'].next(fromJS({}));
      eventsService.refreshEvents();
      eventsService.events.subscribe(events => {
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

  describe('refreshSequences', () => {
    it('can get new events from the server', () => {
      eventsService['_sequences'].next(fromJS({}));
      eventsService.refreshSequences();
      eventsService.sequences.subscribe(events => {
        expect(events.size).toEqual(2);
      });
    });

    it('does not try anything if there is no url yet', () => {
      spyOn(http, 'get');
      parentBs.next(Map({}));
      eventsService.refreshSequences();
      expect(http.get).not.toHaveBeenCalled();
    });
  });



  describe('loadSequence', () => {
    it('deletes all of the events.checked', () => {
      let mutableEvents = eventsService['_events'].getValue().asMutable();
      mutableEvents = mutableEvents.map((event) => event.set('checked', true)) as OrderedMap<string, Map<string, any>>;
      eventsService['_events'].next(mutableEvents.asImmutable());
      eventsService.loadSequence('seq2');
      eventsService.events.subscribe(events => {
        expect(events.every(event => event.get('checked') === undefined)).toBeTruthy();
      });
    });

    it('checks the proper events', () => {
      let mutableEvents = eventsService['_events'].getValue().asMutable();
      mutableEvents = mutableEvents.map((event) => event.set('checked', true)) as OrderedMap<string, Map<string, any>>;
      eventsService['_events'].next(mutableEvents.asImmutable());
      eventsService.loadSequence('seq1');
      eventsService.events.subscribe(events => {
        expect(events.some(event => event.get('checked') === true)).toBeTruthy();
      });
    });
  });

  describe('getSequenceAsTimedEvents', () => {
    it('throws an error if there are no events checked', () => {
      eventsService.loadSequence('seq2');
      eventsService.getSequenceAsTimedEvents().subscribe(() => {
        expect('this should never be called').toEqual('was called');
      }, (error) => {
        expect(error).not.toBeUndefined();
      });
    });

    describe('events are checked', () => {
      const response = [];
      let start;
      let end;
      beforeEach((done) => {
        start = new Date().getTime();
        eventsService.loadSequence('seq1');
        eventsService.getSequenceAsTimedEvents().subscribe((r) => {
          response.push(r);
        }, (error) => {
          expect('this should never be called').toEqual('was called');
        }, () => {
          end = new Date().getTime();
          done();
        });
      });

      it('returns a set of events', () => {
        expect(response.length).toEqual(2);
      });

      it('should fire them off immediately if asked', () => {
        expect((end - start) / 1000).toBeCloseTo(0, 0);
      });

      it('should respect the delay time', (done) => {
        userStateBs.next(Map({
          playbackInterval: 1000,
        }));
        start = new Date().getTime();
        eventsService.loadSequence('seq1');
        eventsService.getSequenceAsTimedEvents().subscribe(() => {},
        error => {
          expect('this should never be called').toEqual('was called');
        }, () => {
          end = new Date().getTime();
          expect((end - start) / 1000).toBeCloseTo(1, 0);
          done();
        });
      });
    });

  });

  describe('updateEventSequence', () => {
    it('can set checked to true on an event', () => {
      eventsService.updateEventSequence('some id', true);
      eventsService.events.subscribe(events => {
        expect(events.getIn(['some id', 'checked'])).toBeTruthy();
      });
    });

    it('can set checked to false on an event', () => {
      eventsService.updateEventSequence('some id', true);
      eventsService.updateEventSequence('some id', false);
      eventsService.events.subscribe(events => {
        expect(events.getIn(['some id', 'checked'])).toBeUndefined();
      });
    });
  });

  describe('sanitizeNodesForEvents', () => {
    let node: D3Node;
    let resultantNode;
    describe('nodeLocations exist', () => {
      beforeEach(() => {
        node = {
          attrs: [],
          id: 'id1',
          location: 'some location',
          name: 'some name',
          type: 'some type',
          x: 50,
          y: 75,
        };
        nodeLocations.next(fromJS({
          id1: {
            x: 100,
            y: 200,
          }
        }));
        resultantNode = eventsService.sanitizeNodesForEvents(node);
      });

      it('takes the x from the node locations', () => {
        expect(resultantNode.x).toEqual(100);
      });

      it('takes the y from the node locations', () => {
        expect(resultantNode.y).toEqual(200);
      });
    });

    describe('nodeLocations do not exist for this node', () => {
      beforeEach(() => {
        node = {
          attrs: [],
          id: 'id1',
          location: 'some location',
          name: 'some name',
          type: 'some type',
          x: 50,
          y: 75,
        };
        resultantNode = eventsService.sanitizeNodesForEvents(node);
      });

      it('uses the existing node x location', () => {
        expect(resultantNode.x).toEqual(50);
      });

      it('uses the existing node y location', () => {
        expect(resultantNode.y).toEqual(75);
      });
    });

    describe('keeps other correct paramaters', () => {
      beforeEach(() => {
        node = {
          attrs: [ {
            key: 'key1',
            value: 'value1',
          }],
          id: 'id1',
          location: 'some location',
          name: 'some name',
          radius: 10,
          type: 'some type',
          x: 50,
          y: 75,
        };
        resultantNode = eventsService.sanitizeNodesForEvents(node);
      });

      it('keeps id', () => {
        expect(resultantNode.id).not.toBeUndefined();
      });

      it('keeps location', () => {
        expect(resultantNode.location).not.toBeUndefined();
      });

      it('keeps name', () => {
        expect(resultantNode.name).not.toBeUndefined();
      });

      it('keeps type', () => {
        expect(resultantNode.type).not.toBeUndefined();
      });

      it('keeps attributes', () => {
        expect(resultantNode.attrs).not.toBeUndefined();
      });

      it('sanitizes the attributes', () => {
        expect(resultantNode.attrs[0].dataType).toBeUndefined();
        expect(resultantNode.attrs[0].required).toBeUndefined();
      });

      it('does not keep any extra keys', () => {
        expect(Reflect.ownKeys(resultantNode).length).toEqual(7);
      });
    });

    describe('special cases', () => {
      it('puts an empty string in if the node does not have a location', () => {
        node = {
          attrs: [ {
            key: 'key1',
            value: 'value1',
          }],
          id: 'id1',
          name: 'some name',
          type: 'some type',
          x: 50,
          y: 75,
        };
        expect(eventsService.sanitizeNodesForEvents(node).location).toEqual('');
      });
    });
  });

  describe('santitizeLinksForEvents', () => {
    describe('keeps correct paramaters', () => {
      let link: Link;
      let resultantLink: Link;
      beforeEach(() => {
        link = {
          association: 'some name',
          attrs: [ {
            key: 'key1',
            value: 'value1',
          }],
          central: true,
          id: 'id1',
          source: 'some node id',
          target: 'some other node id',
        };
        resultantLink = eventsService.sanitizeLinksForEvents(link);
      });

      it('keeps association', () => {
        expect(resultantLink.association).not.toBeUndefined();
      });

      it('keeps attributes', () => {
        expect(resultantLink.attrs).not.toBeUndefined();
      });

      it('keeps id', () => {
        expect(resultantLink.id).not.toBeUndefined();
      });

      it('keeps source', () => {
        expect(resultantLink.source).not.toBeUndefined();
      });

      it('keeps target', () => {
        expect(resultantLink.target).not.toBeUndefined();
      });

      it('does not keep any extra keys', () => {
        expect(Reflect.ownKeys(resultantLink).length).toEqual(5);
      });
    });
  });

  describe('createEvent', () => {
    let post;
    let response;
    beforeEach(() => {
      post = spyOn(http, 'post').and.callThrough();
      eventsService.createEvent({ some: 'body' }).subscribe(_response => {
        response = _response;
      });
    });

    it('posts to the correct url', () => {
      expect(post.calls.argsFor(0)[0].endsWith('/events')).toEqual(true);
    });

    it('returns the response', () => {
      expect(response).not.toBe(null);
    });
  });

  describe('saveSequence', () => {
    beforeEach(() => {
      spyOn(http, 'post').and.callThrough();
      spyOn(http, 'put').and.callThrough();
      spyOn(eventsService, 'refreshSequences');
    });

    it('defaults to the post method', () => {
      eventsService.saveSequence({name: 'name1', description: 'desc1'});
      expect(http.post).toHaveBeenCalled();
    });

    it('can use the put method as needed', () => {
      eventsService.saveSequence({name: 'name1', description: 'desc1'}, 'put');
      expect(http.put).toHaveBeenCalled();
    });

    it('calls refreshSequences', () => {
      eventsService.saveSequence({name: 'name1', description: 'desc1'}).subscribe(() => {
        expect(eventsService.refreshSequences).toHaveBeenCalled();
      });
    });
  });
});
