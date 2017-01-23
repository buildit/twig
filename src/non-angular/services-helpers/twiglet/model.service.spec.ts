import { ModelService } from './index';
import { Model } from '../../interfaces';

describe('ModelService', () => {
  let modelService: ModelService;
  beforeEach(() => {
    modelService = new ModelService();
  });

  describe('Observables', () => {
    it('returns an observable with an empty model at initiation', () => {
      modelService.observable.subscribe(response => {
        expect(response.size).toEqual(2);
        expect(response.get('nodes').size).toEqual(0);
        expect(response.get('entities').size).toEqual(0);
      });
    });
  });

  describe('addModel', () => {
    const model: Model = {
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
      modelService.addModel(model);
      modelService.observable.subscribe(response => {
        expect(response.size).toEqual(2);
        expect(response.get('entities').size).toEqual(2);
      });
    });
  });

});

