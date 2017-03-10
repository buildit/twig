import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Map } from 'immutable';
import { UserState } from './../../interfaces/userState/index';
import { UserStateService } from './index';
import { router } from '../../testHelpers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerComponent } from './../../../app/shared/loading-spinner/loading-spinner.component';

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
    userStateService = new UserStateService(new Http(mockBackend, new BaseRequestOptions()), router() as any, null);
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

  describe('filtering', () => {
    describe('types', () => {
      describe('addTypeFilter', () => {
        it('can add a filter and default active to true', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.chapter).toBeTruthy();
          });
        });

        it('does not affect any other filters', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.setTypeFilterIsActive('chapter', false);
          userStateService.addTypeFilter('organization');
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.chapter).toEqual(false);
          });
        });
      });

      describe('setTypeFilterIsActive', () => {
        it('can set to false', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.setTypeFilterIsActive('chapter', false);
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.chapter).toBeFalsy();
          });
        });

        it('can set to true', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.setTypeFilterIsActive('chapter', false);
          userStateService.setTypeFilterIsActive('chapter', true);
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.chapter).toBeTruthy();
          });
        });
      });

      describe('toggleTypeFilterActive', () => {
        it('can toggle from true to false', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.toggleTypeFilterActive('chapter');
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.chapter).toBeFalsy();
          });
        });

        it('can toggle from false to true', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.setTypeFilterIsActive('chapter', false);
          userStateService.toggleTypeFilterActive('chapter');
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.chapter).toBeTruthy();
          });
        });
      });

      describe('removeTypeFilter', () => {
        it('can remove a filter', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.addTypeFilter('organization');
          userStateService.removeTypeFilter('chapter');
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.chapter).toBeUndefined();
          });
        });

        it('does not remove any other filters', () => {
          userStateService.addTypeFilter('chapter');
          userStateService.addTypeFilter('organization');
          userStateService.removeTypeFilter('chapter');
          userStateService.observable.subscribe(response => {
            const typeFilters = response.get('filters').get('types').toJS();
            expect(typeFilters.organization).toBeTruthy();
          });
        });
      });
    });

    describe('attributes', () => {
      describe('addAttributeFilter', () => {
        it('can add an attribute', () => {
          userStateService.addAttributeFilter('Director', 'test');
          userStateService.observable.subscribe(response => {
            const attributeFilters = response.get('filters').get('attributes').toJS();
            expect(attributeFilters[0]).toEqual({
              active: true,
              key: 'Director',
              value: 'test',
            });
          });
        });

        it('does not add repeat attributes', () => {
          userStateService.addAttributeFilter('Director', 'test');
          userStateService.addAttributeFilter('Director', 'test');
          userStateService.observable.subscribe(response => {
            const attributeFilters = response.get('filters').get('attributes').toJS();
            expect(attributeFilters.length).toEqual(1);
          });
        });

        it('adds it if the key is different but the value is the same', () => {
          userStateService.addAttributeFilter('Director', 'test');
          userStateService.addAttributeFilter('Director2', 'test');
          userStateService.observable.subscribe(response => {
            const attributeFilters = response.get('filters').get('attributes').toJS();
            expect(attributeFilters.length).toEqual(2);
          });
        });

        it('adds it if the key is the same but the value is different', () => {
          userStateService.addAttributeFilter('Director', 'test');
          userStateService.addAttributeFilter('Director', 'test2');
          userStateService.observable.subscribe(response => {
            const attributeFilters = response.get('filters').get('attributes').toJS();
            expect(attributeFilters.length).toEqual(2);
          });
        });

        it('sets the attribute "active" to true if someone tries to add it again', () => {
          userStateService.addAttributeFilter('Director', 'test');
          userStateService.setAttributeFilterIsActive('Director', 'test', false);
          userStateService.addAttributeFilter('Director', 'test');
          userStateService.observable.subscribe(response => {
            const attributeFilters = response.get('filters').get('attributes').toJS();
            expect(attributeFilters[0].active).toEqual(true);
          });
        });
      });
    });

    describe('removeAttributeFilter', () => {
      it('can remove an attribute', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.removeAttributeFilter('Director', 'test');
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters.length).toEqual(0);
        });
      });

      it('only removes the indicated attribute', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.addAttributeFilter('Director', 'test2');
        userStateService.removeAttributeFilter('Director', 'test');
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters[0]).toEqual({
            active: true,
            key: 'Director',
            value: 'test2',
          });
        });
      });

      it('does not remove an attribute if the keys match but the values do not', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.removeAttributeFilter('Director', 'test2');
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters.length).toEqual(1);
        });
      });

      it('does not remove an attribute if the keys are different but the values match', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.removeAttributeFilter('Director2', 'test');
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters.length).toEqual(1);
        });
      });
    });

    describe('setAttributeFilterIsActive', () => {
      it('can deactivate a filter', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.setAttributeFilterIsActive('Director', 'test', false);
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters[0].active).toEqual(false);
        });
      });

      it('can deactivate a filter', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.setAttributeFilterIsActive('Director', 'test', false);
        userStateService.setAttributeFilterIsActive('Director', 'test', true);
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters[0].active).toEqual(true);
        });
      });
    });

    describe('toggleAttributeFilterActive', () => {
      it('can toggle from true to false', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.toggleAttributeFilterActive('Director', 'test');
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters[0].active).toEqual(false);
        });
      });

      it('can toggle from false to true', () => {
        userStateService.addAttributeFilter('Director', 'test');
        userStateService.setAttributeFilterIsActive('Director', 'test', false);
        userStateService.toggleAttributeFilterActive('Director', 'test');
        userStateService.observable.subscribe(response => {
          const attributeFilters = response.get('filters').get('attributes').toJS();
          expect(attributeFilters[0].active).toEqual(true);
        });
      });
    });
  });
});
