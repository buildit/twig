import { UserStateService } from './index';

describe('UserStateService', () => {
  let userStateService: UserStateService;
  beforeEach(() => {
    userStateService = new UserStateService();
  });

  describe('Observables', () => {
    it('returns an observable with the default values on subscription', () => {
      userStateService.observable.subscribe(response => {
        expect(response.size).toEqual(2);
        expect(response.get('currentNode')).toBeFalsy();
        expect(response.get('isEditing')).toBeFalsy();
      });
    });
  });

  describe('Current Node', () => {
    it('can set the current node', () => {
      userStateService.setCurrentNode('node id');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentNode')).toEqual('node id');
      });
    });

    it('can clear the current node', () => {
      // setup
      userStateService.setCurrentNode('node id');

      userStateService.clearCurrentNode();
      userStateService.observable.subscribe(response => {
        expect(response.get('currentNode')).toBeFalsy();
      });
    });
  });

  describe('Edit Mode', () => {
    it('can set the editing mode to true', () => {
      userStateService.setEditing(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('isEditing')).toEqual(true);
      });
    });

    it('can set the editing mode to false', () => {
      // setup
      userStateService.setEditing(true);

      userStateService.setEditing(false);
      userStateService.observable.subscribe(response => {
        expect(response.get('isEditing')).toEqual(false);
      });
    });

    it('can toggle the editing mode', () => {
      let callCount = 0;
      const expectedValues = [false, true, false];
      userStateService.observable.subscribe(response => {
        expect(response.get('isEditing')).toEqual(expectedValues[callCount++]);
      });
      userStateService.toggleEditing();
      userStateService.toggleEditing();
    });
  });
});
