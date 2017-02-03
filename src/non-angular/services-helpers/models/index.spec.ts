import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fromJS, Map } from 'immutable';

import { ModelsService } from './index';

describe('ModelsService', () => {

  let modelsService: ModelsService;
  function mockModelsResponse() {
    return [
      {
        _id: 'model1',
        url: 'http://localhost:3000/models/model1'
      },
      {
        _id: 'model2',
        url: 'http://localhost:3000/models/model2'
      },
    ];
  }

  function mockModel1Response() {
    return {
      _id: 'model1',
      _rev1: 'revision number for model 1',
      entities: {
        entity1: {
          type: 'type1'
        },
        entity2: {
          type: 'type2'
        }
      },
      url: 'http://localhost:3000/models/model1'
    };
  }

  function mockModel2Response() {
    return {
      _id: 'model2',
      _rev1: 'revision number for model 2',
      entities: {
        entity1: {
          type: 'type3'
        },
        entity2: {
          type: 'type4'
        }
      },
      url: 'http://localhost:3000/models/model2'
    };
  }

  const mockBackend = new MockBackend();
  mockBackend.connections.subscribe(connection => {
    if (connection.request.url.endsWith('/models/model1')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockModel1Response())
      })));
    }
    if (connection.request.url.endsWith('/models/model2')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockModel1Response())
      })));
    }
    if (connection.request.url.endsWith('/models')) {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockModelsResponse())
      })));
    }
  });

  beforeEach(() => {
    const http = new Http(mockBackend, new BaseRequestOptions());
    modelsService = new ModelsService(http, null, null);
    modelsService.loadModel('model1');
  });

  it('can add an entity to a model', () => {
    function thirdEntity() {
      return {
        class: 'letter',
        color: '#008800',
        image: 'A',
        size: '10',
        type: 'entity3',
      };
    }
    modelsService.addEntity(thirdEntity());
    modelsService.observable.subscribe(model => {
      expect(model.toJS().entities.entity3).toEqual(thirdEntity());
    });
  });

  it('can change a specific value inside of an entity', () => {
    modelsService.updateEntityValue('entity1', 'image', 'A');
    modelsService.observable.subscribe(model => {
      expect(model.toJS().entities.entity1.image).toEqual('A');
    });
  });

  it('can remove an entity', () => {
    modelsService.removeEntity('entity1');
    modelsService.observable.subscribe(model => {
      expect(model.toJS().entities.entity1).toBeFalsy();
    });
  });

  describe('backups', () => {
    it('returns true when the backup is restorable', () => {
      modelsService.createBackup();
      modelsService.removeEntity('entity1');
      expect(modelsService.restoreBackup()).toBeTruthy;
    });

    it('actually restores the backup', () => {
      modelsService.createBackup();
      modelsService.removeEntity('entity1');
      modelsService.restoreBackup();
      modelsService.observable.subscribe(model => {
        expect(model.toJS().entities.entity1).toBeTruthy();
      });
    });

    it('does not restore "null" if the backup does not exist', () => {
      modelsService.removeEntity('entity1');
      modelsService.restoreBackup();
      modelsService.observable.subscribe(model => {
        expect(model).toBeTruthy();
      });
    });
  });
});
