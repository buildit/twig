import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ModelService } from './index';
import { Model } from '../../interfaces';
import { TwigletService } from './index';

describe('ModelService', () => {
  let modelService: ModelService;
  let twigletService: TwigletService;
  const mockBackend = new MockBackend();
  beforeEach(() => {
    modelService = new ModelService(new Http(mockBackend, new BaseRequestOptions()), null, twigletService);
  });

  describe('Observables', () => {
    it('returns an observable with an empty model at initiation', () => {
      modelService.observable.subscribe(response => {
        expect(response.size).toEqual(3);
        expect(response.get('nodes').size).toEqual(0);
        expect(response.get('entities').size).toEqual(0);
      });
    });
  });

  describe('setModel', () => {
    const model: Model = {
      _rev: 'rev',
      entities: {
        one: {
          class: 'bang',
          color: '#000000',
          image: '!',
          size: 10,
        },
        two: {
          class: 'email',
          color: '#000000',
          image: '@',
          size: 10,
        },
      },
      nodes: {
        three: { attributes: {}, uniqueness: [], image: ''},
      },
    };
    it('can add a model', () => {
      modelService.setModel(model);
      modelService.observable.subscribe(response => {
        expect(response.size).toEqual(3);
        expect(response.get('entities').size).toEqual(2);
      });
    });
  });
});

