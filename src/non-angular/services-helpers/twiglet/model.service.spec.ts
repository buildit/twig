import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';

import { Model } from '../../interfaces';
import { ModelService } from './model.service';
import { successfulMockBackend } from './../../testHelpers/mockBackEnd';
import { TwigletService } from './index';

describe('ModelService', () => {
  let modelService: ModelService;
  const baseModel: Model = {
    _rev: 'rev',
    entities: {
      one: {
        class: 'bang',
        color: '#000000',
        image: '!',
        size: '10',
        type: 'one',
      },
      two: {
        class: 'email',
        color: '#000000',
        image: '@',
        size: '10',
        type: 'one',
      },
    },
    url: '/twiglets/name1/model'
  };
  let http;
  let router;
  let twiglet;
  beforeEach(() => {
    http = new Http(successfulMockBackend, new BaseRequestOptions());
    router = {
      navigate: jasmine.createSpy('navigate'),
    };
    twiglet = {
      updateNodeTypes: jasmine.createSpy('updateNodeTypes'),
    };
    modelService = new ModelService(http, router, twiglet);
  });

  describe('Observables', () => {
    it('returns an observable with an empty model at initiation', () => {
      modelService.observable.subscribe(response => {
        expect(response.size).toEqual(3);
        expect(response.get('entities').size).toEqual(0);
      });
    });
  });

  describe('setModel', () => {
    it('can add a model', () => {
      modelService.setModel(baseModel);
      modelService.observable.subscribe(response => {
        expect(response.size).toEqual(3);
        expect(response.get('entities').size).toEqual(2);
      });
    });
  });

  describe('createBackup', () => {
    it('can create a backup', () => {
      modelService['_modelBackup'] = null;
      modelService.createBackup();
      expect(modelService['_modelBackup']).not.toBe(null);
    });
  });

  describe('restoreBackup', () => {
    it('can restore a backup', () => {
      modelService.createBackup();
      modelService['_model'].next(null);
      modelService.restoreBackup();
      modelService.observable.subscribe(model => {
        expect(model).not.toBe(null);
      });
    });

    it('returns true when the backup is restored', () => {
      modelService.createBackup();
      expect(modelService.restoreBackup()).toBe(true);
    });

    it('returns false if there is no backup to restore.', () => {
      expect(modelService.restoreBackup()).toBe(false);
    });
  });

  describe('clearModel', () => {
    beforeEach(() => {
      const model: Model = {
        _rev: 'rev',
        entities: {
          one: {
            class: 'bang',
            color: '#000000',
            image: '!',
            size: '10',
            type: 'one',
          },
          two: {
            class: 'email',
            color: '#000000',
            image: '@',
            size: '10',
            type: 'one',
          },
        },
      };
      modelService.setModel(model);
      modelService.clearModel();
    });

    it('resets the rev', () => {
      modelService.observable.subscribe(model => {
        expect(model.get('_rev')).toBe(null);
      });
    });

    it('resets the entities', () => {
      modelService.observable.subscribe(model => {
        expect(model.get('entities').size).toBe(0);
      });
    });
  });

  describe('updateEntityAttributes', () => {
    beforeEach(() => {
      modelService.setModel(baseModel);
      modelService.createBackup();
      const attributes = [
        {key: 'key1', value: 'value1', active: true},
        {key: 'key2', value: 'value2'},
      ];
      modelService.updateEntityAttributes('one', attributes);
    });

    it('can add attributes to an entity', () => {
      modelService.observable.subscribe(model => {
        expect(model.getIn(['entities', 'one', 'attributes']).size).toEqual(2);
      });
    });

    it('only affects the correct entity', () => {
      modelService.observable.subscribe(model => {
        expect(model.getIn(['entities', 'two', 'attributes']).size).toEqual(0);
      });
    });
  });

  describe('updateEntities', () => {
    let entities;
    beforeEach(() => {
      modelService.setModel(baseModel);
      modelService.createBackup();
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
      ];
    });

    it('does nothing if the lengths are different', () => {
      entities.push({
        class: 'hashtag',
        color: '#00AA00',
        image: '#',
        size: '30',
        type: 'five',
      });
      modelService.updateEntities(entities);
      expect(twiglet.updateNodeTypes).not.toHaveBeenCalled();
    });

    it('sets the new entities', () => {
      modelService.updateEntities(entities);
      expect(modelService['_dirtyEntities'].getIn(['three', 'size'])).toEqual('20');
    });
  });

  describe('saveChanges', () => {
    let put: jasmine.Spy;
    let response;
    beforeEach(() => {
      put = spyOn(http, 'put').and.callThrough();
      modelService.setModel(baseModel);
      modelService.createBackup();
      modelService.saveChanges('name1')
      .subscribe(_response => {
        response = _response;
      });
    });

    it('hits the correct url', () => {
      expect(put.calls.argsFor(0)[0]).toEqual(baseModel.url);
    });

    it('returns the response', () => {
      expect(response).not.toBe(null);
    });

    it('calls navigate', () => {
      expect(router.navigate).toHaveBeenCalledWith(['twiglet', 'name1']);
    });
  });
});

