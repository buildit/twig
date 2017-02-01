import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Map } from 'immutable';
import { UserState } from './../../interfaces/userState/index';
import { UserStateService } from './index';

describe('UserStateService', () => {
  const mockUserResponse = {
    user: {
      email: 'user@email.com',
      name: 'user@email.com'
    }
  };
  const mockBackend = new MockBackend();
  let userStateService: UserStateService;
  beforeEach(() => {
    userStateService = new UserStateService(new Http(mockBackend, new BaseRequestOptions()));
  });

  describe('Observables', () => {
    it('returns an observable with the default values on subscription', () => {
      userStateService.observable.subscribe(response => {
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

    it('can set the copied node id to the current node id', () => {
      userStateService.setCurrentNode('node id');
      userStateService.setCopiedNodeId();
      userStateService.observable.subscribe(response => {
        expect(response.get('copiedNodeId')).toEqual('node id');
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


  describe('currentTwiglet', () => {
    it('can set the current twiglet name', () => {
      userStateService.setCurrentTwigletName('twiglet name');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentTwigletName')).toEqual('twiglet name');
      });
    });

    it('can set the current twiglet id', () => {
      userStateService.setCurrentTwigletId('twiglet id');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentTwigletId')).toEqual('twiglet id');
      });
    });

    it('can set the current twiglet description', () => {
      userStateService.setCurrentTwigletDescription('twiglet description');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentTwigletDescription')).toEqual('twiglet description');
      });
    });

    it('can set the current twiglet _rev', () => {
      userStateService.setCurrentTwigletRev('twiglet _rev');
      userStateService.observable.subscribe(response => {
        expect(response.get('currentTwigletRev')).toEqual('twiglet _rev');
      });
    });

    it('can clear the current twiglet', () => {
      userStateService.setCurrentTwigletName('twiglet name');
      userStateService.setCurrentTwigletId('id');
      userStateService.setCurrentTwigletDescription('twiglet description');
      userStateService.setCurrentTwigletRev('twiglet _rev');
      userStateService.clearCurrentTwigletName();
      userStateService.observable.subscribe(response => {
        expect(response.get('currentTwigletName')).toBeFalsy();
        expect(response.get('currentTwigletId')).toBeFalsy();
        expect(response.get('currentTwigletDescription')).toBeFalsy();
        expect(response.get('currentTwigletRev')).toBeFalsy();
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

  describe('showLinkLabels', () => {
    it('can set the link labels to a boolean', () => {
      userStateService.setShowLinkLabels(true);
      userStateService.observable.subscribe(response => {
        expect(response.get('showLinkLabels')).toEqual(true);
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

  describe('logIn', () => {
    it('can set the current user', () => {
      userStateService.setCurrentUser('user@email.com');
      userStateService.observable.subscribe(response => {
        expect(response.get('user')).toEqual('user@email.com');
      });
    });

    it('can log the user in', () => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockUserResponse)
        })));
        expect(connection.request.method).toEqual(RequestMethod.Post);
      });
      userStateService.logIn({ email: 'user@email.com', password: 'password'})
      .subscribe(response => {
        expect(response).toEqual(mockUserResponse);
      });
    });
  });
});
