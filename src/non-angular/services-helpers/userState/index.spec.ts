import { UserStateService } from './index';

describe('UserStateService', () => {
  let userStateService: UserStateService;
  beforeEach(() => {
    userStateService = new UserStateService();
  });

  describe('Observables', () => {
    it('returns an observable with the default values on subscription', () => {
      userStateService.observable.subscribe(response => {
        expect(response.size).toEqual(9);
        expect(response.get('currentNode')).toBeFalsy();
        expect(response.get('isEditing')).toBeFalsy();
      });
    });
  });

  describe('currentNode', () => {
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

  describe('currentTwigletName', () => {
    it('can set the current twiglet', () => {
      userStateService.setCurrentTwiglet('twiglet name');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentTwigletName')).toEqual('twiglet name');
      });
    });

    it('can clear the current twiglet', () => {
      userStateService.setCurrentTwiglet('twiglet name');

      userStateService.clearCurrentTwiglet();
      userStateService.observable.subscribe(response => {
        expect(response.get('currentTwigletName')).toBeFalsy();
      });
    });
  });

  describe('currentViewName', () => {
    it('can set the current View', () => {
      userStateService.setCurrentView('View name');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentViewName')).toEqual('View name');
      });
    });

    it('can clear the current View', () => {
      userStateService.setCurrentView('View name');

      userStateService.clearCurrentView();
      userStateService.observable.subscribe(response => {
        expect(response.get('currentViewName')).toBeFalsy();
      });
    });
  });

  describe('isEditing', () => {
    it('can set the editing mode to a boolean', () => {
      userStateService.setEditing(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('isEditing')).toEqual(true);
      });
    });
  });

  describe('nodeTypeToBeAdded', () => {
    it('can set the current node type to be added', () => {
      userStateService.setNodeTypeToBeAdded('a type');
      userStateService.observable.subscribe(response => {
        expect(response.get('nodeTypeToBeAdded')).toEqual('a type');
      });
    });

    it('can clear the node type so nothing is added', () => {
      userStateService.clearNodeTypeToBeAdded();
      userStateService.observable.subscribe(response => {
        expect(response.get('nodeTypeToBeAdded')).toBeFalsy();
      });
    });
  });

  describe('showNodeLabels', () => {
    it('can set the node labels to a boolean', () => {
      userStateService.setShowNodeLabels(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('showNodeLabels')).toEqual(true);
      });
    });
  });

  describe('textToFilterOn', () => {
    it('can set the search text', () => {
      userStateService.setTextToFilterOn('search term');
      userStateService.observable.subscribe(response => {
        expect(response.get('textToFilterOn')).toEqual('search term');
      });
    });
  });

  describe('sortNodesBy', () => {
    it('can set the key that nodes are being sorted on', () => {
      userStateService.setSortNodesBy('a string');
      userStateService.observable.subscribe(response => {
        expect(response.get('sortNodesBy')).toEqual('a string');
      });
    });
  });

  describe('sortNodesAscending', () => {
    it('can toggle the sorting nodes by ascending', () => {
      let expected = false;
      userStateService.toggleSortNodesAscending();
      userStateService.observable.subscribe(response => {
        expect(response.get('sortNodesAscending')).toEqual(expected);
      });
      expected = true;
      userStateService.toggleSortNodesAscending();
    });
  });
});
