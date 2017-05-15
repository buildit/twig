import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fromJS, Map } from 'immutable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs/Rx';

import { mockToastr } from '../../testHelpers';
import { ModelsService } from './index';
import { UserStateService } from '../userState';

describe('ModelsService', () => {

  let modelsService: ModelsService;
  const userStateBs = new BehaviorSubject<Map<string, any>>(Map({}));
  const userState = {
    observable: userStateBs.asObservable(),
    startSpinner() { },
    stopSpinner() { },
  };
  let userReplaySubject: ReplaySubject<boolean>;
  let router;
  let modalService;
  let http: Http;

  function mockModelsResponse() {
    return [
      {
        name: 'model2',
        url: 'http://localhost:3000/models/model2'
      },
      {
        name: 'model1',
        url: 'http://localhost:3000/models/model1'
      },
    ];
  }

  function mockModel1Response() {
    return {
      _rev: 'revision number for model 1',
      changelog_url: 'http://localhost:3000/models/model1/changelog',
      entities: {
        entity1: {
          type: 'type1'
        },
        entity2: {
          type: 'type2'
        }
      },
      name: 'model1',
      url: 'http://localhost:3000/models/model1'
    };
  }

  function mockModel2Response() {
    return {
      _rev: 'revision number for model 2',
      changelog_url: 'http://localhost:3000/models/model2/changelog',
      entities: {
        entity1: {
          type: 'type3'
        },
        entity2: {
          type: 'type4'
        }
      },
      name: 'model2',
      url: 'http://localhost:3000/models/model2'
    };
  }

  function changelog() {
    return [
      {
        message: 'View changed position deleted',
        timestamp: '2017-03-13T16:45:39.195',
        user: 'ben.hernandez@corp.riglet.io',
      },
      {
        message: 'View ?? created',
        timestamp: '2017-03-13T16:40:38.055',
        user: 'ben.hernandez@corp.riglet.io',
      },
    ];
  }

  const mockBackend = new MockBackend();
  mockBackend.connections.subscribe(connection => {
    if (connection.request.url.endsWith('/models/model1')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockModel1Response())
      })));
    } else if (connection.request.url.endsWith('/models/model2')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockModel1Response())
      })));
    } else if (connection.request.url.endsWith('/models')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockModelsResponse())
      })));
    } else if (connection.request.url.endsWith('/changelog')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(changelog())
      })));
    }
  });

  beforeEach(() => {
    http = new Http(mockBackend, new BaseRequestOptions());
    userReplaySubject = new ReplaySubject;
    modalService = {
      open() {
        return {
          componentInstance: {
            userResponse: userReplaySubject,
          },
          close() {}
        };
      },
    };
    router = {
      navigate: jasmine.createSpy('navigate'),
    };
    modelsService = new ModelsService(http, mockToastr() as any, router, <any>modalService, false, userState as any);
    modelsService.loadModel('model1');
    modelsService.updateListOfModels();
  });

  describe('constructor', () => {
    it('does not create the changelog service unless the model is site-wide', () => {
      expect(modelsService.changeLogService).toBe(undefined);
    });

    it('creates the changelog service if the model is sitewide.', () => {
      http = new Http(mockBackend, new BaseRequestOptions());
      modelsService = new ModelsService(http, mockToastr() as any, null, null, true, userState as any);
      expect(modelsService.changeLogService).not.toBe(undefined);
    });
  });

  describe('observables', () => {
    it('can get the model', () => {
      modelsService.observable.subscribe(response => {
        expect(response).not.toBe(null);
      });
    });

    it('can get the models', () => {
      modelsService.models.subscribe(response => {
        expect(response).not.toBe(null);
      });
    });
  });

  describe('updateListOfModels', () => {
    it('refreshes the list of models', () => {
      modelsService['_models'].next(null);
      modelsService.updateListOfModels();
      modelsService.models.subscribe(models => {
        expect(models.size).toEqual(2);
      });
    });

    it('alphabetizes the list of models', () => {
      modelsService['_models'].next(null);
      modelsService.updateListOfModels();
      modelsService.models.subscribe(models => {
        expect(models.getIn([0, 'name'])).toEqual('model1');
      });
    });
  });

  describe('setName', () => {
    it('can set the name of the model', () => {
      modelsService.loadModel('model1');
      modelsService.setName('a new name');
      modelsService.observable.subscribe(model => {
        expect(model.get('name')).toEqual('a new name');
      });
    });
  });

  describe('createBackup', () => {
    it('can create a backup', () => {
      modelsService['_modelBackup'] = null;
      modelsService.createBackup();
      expect(modelsService['_modelBackup']).not.toBe(null);
    });
  });

  describe('restoreBackup', () => {
    it('can restore a backup', () => {
      modelsService.createBackup();
      modelsService['_model'].next(null);
      modelsService.restoreBackup();
      modelsService.observable.subscribe(model => {
        expect(model).not.toBe(null);
      });
    });

    it('returns true when the backup is restored', () => {
      modelsService.createBackup();
      expect(modelsService.restoreBackup()).toBe(true);
    });

    it('returns false if there is no backup to restore.', () => {
      delete modelsService['_modelBackup'];
      expect(modelsService.restoreBackup()).toBe(false);
    });
  });

  describe('loadModel', () => {
    it('does not load the model if the name is _new', () => {
      userState.startSpinner = jasmine.createSpy('startSpinner');
      modelsService.loadModel('_new');
      expect(userState.startSpinner).not.toHaveBeenCalled();
    });

    it('starts the spinner', () => {
      userState.startSpinner = jasmine.createSpy('startSpinner');
      modelsService.loadModel('model1');
      expect(userState.startSpinner).toHaveBeenCalled();
    });

    describe('fully loading new model', () => {
      it('loads the rev', () => {
        modelsService.loadModel('model1');
        modelsService.observable.subscribe(model => {
          expect(model.get('_rev')).toEqual(mockModel1Response()._rev);
        });
      });

      it('loads the changelog url', () => {
        modelsService.loadModel('model1');
        modelsService.observable.subscribe(model => {
          expect(model.get('changelog_url')).toEqual(mockModel1Response().changelog_url);
        });
      });

      it('loads the name', () => {
        modelsService.loadModel('model1');
        modelsService.observable.subscribe(model => {
          expect(model.get('name')).toEqual(mockModel1Response().name);
        });
      });

      it('loads the url', () => {
        modelsService.loadModel('model1');
        modelsService.observable.subscribe(model => {
          expect(model.get('url')).toEqual(mockModel1Response().url);
        });
      });

      it('loads the entities', () => {
        modelsService.loadModel('model1');
        modelsService.observable.subscribe(model => {
          expect(model.get('entities').size).toEqual(2);
        });
      });

      it('stops the spinner', () => {
        userState.stopSpinner = jasmine.createSpy('startSpinner');
        modelsService.loadModel('model1');
        expect(userState.stopSpinner).toHaveBeenCalled();
      });

      it('automatically creates a backup', () => {
        spyOn(modelsService, 'createBackup');
        modelsService.loadModel('model1');
        expect(modelsService.createBackup).toHaveBeenCalled();
      });
    });
  });

  describe('clearModel', () => {
    beforeEach(() => {
      modelsService.loadModel('model1');
      modelsService.clearModel();
    });

    it('sets the name to null', () => {
      modelsService.observable.subscribe(model => {
        expect(model.get('name')).toBe(null);
      });
    });

    it('sets the _rev to null', () => {
      modelsService.observable.subscribe(model => {
        expect(model.get('_rev')).toBe(null);
      });
    });

    it('sets the entities to an empty map', () => {
      modelsService.observable.subscribe(model => {
        expect(model.get('entities').size).toEqual(0);
      });
    });
  });

  describe('getChangelog', () => {
    it('gets the changelog from the server', () => {
      modelsService.getChangelog(mockModel1Response().changelog_url).subscribe(response => {
        expect(response.length).toEqual(2);
      });
    });
  });

  describe('updateEntities', () => {
    let entities;
    beforeEach(() => {
      modelsService.loadModel('model1');
      entities = [
        {
          class: 'ampersand',
          color: '#CC0000',
          image: '&',
          size: '20',
          type: 'three',
        },
        {
          class: 'hashtag',
          color: '#00AA00',
          image: '#',
          size: '30',
          type: 'four',
        },
        {
          class: 'hashtag',
          color: '#00AA00',
          image: '#',
          size: '30',
          type: 'five',
        }
      ];
      modelsService.updateEntities(entities);
    });

    it('updates the entities', () => {
      modelsService.observable.subscribe(model => {
        expect(model.get('entities').size).toBe(3);
      });
    });

    it('does not leave any old entities (true replacement)', () => {
      modelsService.observable.subscribe(model => {
        expect(model.get('entities').every(e => e.type !== 'type1')).toBeTruthy();
      });
    });
  });

  describe('updateEntityAttributes', () => {
    beforeEach(() => {
      modelsService.loadModel('model1');
      const attributes = [
        {key: 'key1', value: 'value1', active: true},
        {key: 'key2', value: 'value2'},
      ];
      modelsService.updateEntityAttributes('type1', attributes);
    });

    it('can add attributes to an entity', () => {
      modelsService.observable.subscribe(model => {
        expect(model.getIn(['entities', 'type1', 'attributes']).size).toEqual(2);
      });
    });

    it('only affects the correct entity', () => {
      modelsService.observable.subscribe(model => {
        expect(model.getIn(['entities', 'type2', 'attributes']).size).toEqual(0);
      });
    });
  });

  describe('addEntity', () => {
    function thirdEntity() {
      return {
        class: 'letter',
        color: '#008800',
        image: 'A',
        size: '10',
        type: 'entity3',
      };
    }

    beforeEach(() => {
      modelsService.loadModel('model1');
      modelsService.addEntity(thirdEntity());
    });

    it('can add an entity to a model', () => {
      modelsService.observable.subscribe(model => {
        expect(model.toJS().entities.entity3).toEqual(thirdEntity());
      });
    });

    it('does not remove an other entities', () => {
      modelsService.observable.subscribe(model => {
        expect(model.get('entities').size).toEqual(3);
      });
    });
  });

  describe('updateEntityValue', () => {
    beforeEach(() => {
      modelsService.loadModel('model1');
      modelsService.updateEntityValue('entity1', 'image', 'A');
    });

    it('can change a specific value inside of an entity', () => {
      modelsService.observable.subscribe(model => {
        expect(model.toJS().entities.entity1.image).toEqual('A');
      });
    });

    it('does not update any other entities', () => {
      modelsService.observable.subscribe(model => {
        expect(model.toJS().entities.entity2.image).not.toEqual('A');
      });
    });
  });

  describe('removeEntity', () => {
    beforeEach(() => {
      modelsService.loadModel('model1');
      modelsService.removeEntity('entity1');
    });

    it('can remove an entity', () => {
      modelsService.observable.subscribe(model => {
        expect(model.toJS().entities.entity1).toBeFalsy();
      });
    });

    it('does not remove any other entities', () => {
      modelsService.observable.subscribe(model => {
        expect(model.get('entities').size).toEqual(1);
      });
    });
  });

  describe('saveChanges', () => {
    describe('success', () => {
      let put;
      beforeEach(() => {
        put = spyOn(http, 'put').and.callThrough();
        modelsService.loadModel('model1');
        modelsService.setName('other name');
        modelsService.saveChanges('some commit message').subscribe();
      });

      it('has the correct rev', () => {
        expect(put.calls.argsFor(0)[1]._rev).toEqual(mockModel1Response()._rev);
      });

      it('has the paramed commit message', () => {
        expect(put.calls.argsFor(0)[1].commitMessage).toEqual('some commit message');
      });

      it('has the correct name', () => {
        expect(put.calls.argsFor(0)[1].name).toEqual('other name');
      });


      describe('siteWide', () => {
        beforeEach(() => {
          modelsService = new ModelsService(http, mockToastr() as any, router, <any>modalService, true, userState as any);
          modelsService.loadModel('model1');
          modelsService.setName('other name');
          modelsService.saveChanges('some commit message').subscribe();
        });

        it('navigates to the model', () => {
          expect(router.navigate).toHaveBeenCalled();
        });
      });
    });

    describe('overwrite prompting', () => {
      let response;
      beforeEach(() => {
        response = null;
        modelsService.loadModel('model1');
        const errorBackend = new MockBackend();
        errorBackend.connections.subscribe(connection => {
          const errorResponse = {
            _body: JSON.stringify({ data: 'some twiglet' }),
            message: 'all the errors!',
            status: 409,
          };
          connection.mockError(errorResponse);
        });
        modelsService['http'] = new Http(errorBackend, new BaseRequestOptions());
        modelsService.saveChanges('should fail').subscribe(_response => response = _response);
      });

      it('calls save changes again if the users clicks yes', () => {
        spyOn(modelsService, 'saveChanges').and.returnValue(Observable.of('whatever'));
        userReplaySubject.next(true);
        expect(modelsService.saveChanges).toHaveBeenCalledTimes(1);
      });

      it('returns a response once overwritten', () => {
        spyOn(modelsService, 'saveChanges').and.returnValue(Observable.of('whatever'));
        userReplaySubject.next(true);
        expect(response).toEqual('whatever');
      });

      it('does nothing if the user clicks no', () => {
        spyOn(modelsService, 'saveChanges').and.returnValue(Observable.of('whatever'));
        userReplaySubject.next(false);
        expect(modelsService.saveChanges).not.toHaveBeenCalled();
      });

      it('returns a error if the user clicks no', () => {
        userReplaySubject.next(false);
        expect(response.status).toEqual(409);
      });
    });

    describe('other errors', () => {
      let error;
      beforeEach(() => {
        error = null;
        spyOn(http, 'put').and.callThrough();
        modelsService.loadModel('model1');
        const errorBackend = new MockBackend();
        errorBackend.connections.subscribe(connection => {
          const errorResponse = {
            message: 'all the errors!',
            status: 400,
          };
          connection.mockError(errorResponse);
        });
        modelsService['http'] = new Http(errorBackend, new BaseRequestOptions());
        modelsService.saveChanges('should fail')
            .subscribe(response => {
              expect('this should never be called').toEqual('ever');
            }, _error => error = _error);
      });

      it('gets the error back from the server', () => {
        expect(error.status).toEqual(400);
      });
    });
  });

  describe('addModel', () => {
    it('can add a model', () => {
      modelsService.addModel({}).subscribe(response => {
        expect(response).not.toBe(null);
      });
    });
  });

  describe('removeModel', () => {
    it('can remove a model', () => {
      modelsService.removeModel('model1').subscribe(response => {
        expect(response).not.toBe(null);
      });
    });
  });
});
