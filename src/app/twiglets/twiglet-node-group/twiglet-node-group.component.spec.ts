import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';

import { FilterByObjectPipe } from './../../shared/pipes/filter-by-object.pipe';
import { fullTwigletMap, fullTwigletModelMap, stateServiceStub } from '../../../non-angular/testHelpers';
import { ImmutableMapOfMapsPipe } from './../../shared/pipes/immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../../shared/pipes/node-search.pipe';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { StateService } from '../../state.service';
import { TwigletNodeGroupComponent } from './twiglet-node-group.component';

describe('TwigletNodeGroupComponent', () => {
  let component: TwigletNodeGroupComponent;
  let fixture: ComponentFixture<TwigletNodeGroupComponent>;
  const stateService = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TwigletNodeGroupComponent,
        NodeSearchPipe,
        ObjectSortPipe,
        FilterByObjectPipe,
        ImmutableMapOfMapsPipe,
        NodeInfoComponent
      ],
      imports: [ NgbAccordionModule],
      providers: [{ provide: StateService, useValue: stateService }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletNodeGroupComponent);
    component = fixture.componentInstance;
    component.type = [{
      color: '#d62728',
      icon: 'hand-lizard-o',
      type: 'squad',
    }, [{ id: 'node-id-1'}, { id: 'node-id-other'}]];
    component.twiglet = fullTwigletMap();
    component.userState = fromJS({
        currentNode: '',
        filters: {
          attributes: [],
          types: {}
        },
        mode: 'twiglet',
        sortNodesAscending: 'true',
        sortNodesBy: 'type',
        textToFilterOn: '',
      });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the right count for nodes', () => {
    expect(component.viewNodeCount).toEqual(2);
  });

  it('displays the right count for nodes when there are no nodes', () => {
    component.type = [{
      color: '#d62728',
      icon: 'hand-lizard-o',
      type: 'squad',
    }, []];
    component['cd'].markForCheck();
    fixture.detectChanges();
    expect(component.viewNodeCount).toEqual(0);
  });

  describe('ngOnChanges', () => {
    let changes;
    beforeEach(() => {
      changes = {
        userState: {
          currentValue: fromJS({
            currentNode: 'node-id-1',
          }),
          previousValue: fromJS({
            currentNode: 'node-id-2',
          }),
        }
      };
      component.type = [{}, [{ id: 'node-id-1'}, { id: 'node-id-other'}]];
      component.needToScroll = false;
      component.currentNode = 'some other node';
      component.currentNodeCard = 'node-card-some other node';
    });

    it('updates the current node (and nodeCard) as needed', () => {
      component.ngOnChanges(changes);
      expect(component.currentNode).toEqual('node-id-1');
      expect(component.currentNodeCard).toEqual('node-card-node-id-1');
    });

    it('does no updating if the current node is not set', () => {
      changes.userState.currentValue = fromJS({});
      component.ngOnChanges(changes);
      expect(component.currentNode).toEqual('some other node');
    });

    it('opens the group if the currentNode is one of the nodes', () => {
      component.ngOnChanges(changes);
      expect(component.isOpen).toEqual(true);
    });

    it('does not open the group if the current node is not one of the nodes', () => {
      changes.userState.currentValue = fromJS({
        currentNode: 'not in this list',
      });
      component.ngOnChanges(changes);
      expect(component.isOpen).toEqual(false);
    });

    it('sets need to scroll to true if there is no previous user state', () => {
      delete changes.userState.previousValue;
      component.ngOnChanges(changes);
      expect(component.needToScroll).toEqual(true);
    });

    it('sets need to scroll if the the previousValue is not a map', () => {
      changes.previousValue = 'CD_INIT';
      component.ngOnChanges(changes);
      expect(component.needToScroll).toEqual(true);
    });

    it('sets need to scroll if the previousValue has a different currentNode', () => {
      component.ngOnChanges(changes);
      expect(component.needToScroll).toEqual(true);
    });

    it ('does not set need to scroll if the currentNode has not changed', () => {
      changes.userState.previousValue = fromJS({
        currentNode: 'node-id-1',
      });
      component.ngOnChanges(changes);
      expect(component.needToScroll).toEqual(false);
    });

  });

  describe('ngAfterViewChecked', () => {
    let scrollIntoView;
    beforeEach(() => {
      scrollIntoView = jasmine.createSpy('scrollIntoView');
      component.elementRef = {
        nativeElement: {
          querySelector () {
            return {
              scrollIntoView
            };
          }
        }
      };
    });

    describe('can scroll to the correct node', () => {
      it ('sets needToScroll to false so it does not keep trying to scroll on every view check', () => {
        component.needToScroll = true;
        component.ngAfterViewChecked();
        expect(component.needToScroll).toEqual(false);
      });

      it('calls scrollIntoView to scroll to the correct card', () => {
        component.needToScroll = true;
        component.ngAfterViewChecked();
        expect(scrollIntoView).toHaveBeenCalled();
      });

    });

    it('does not scroll if this is already the selected node', () => {
      component.needToScroll = false;
      component.ngAfterViewChecked();
      expect(scrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('toggleOpenness', () => {
    it ('switches open to close', () => {
      component.isOpen = false;
      component.toggleOpen();
      expect(component.isOpen).toEqual(true);
    });

    it ('switches closes to open', () => {
      component.isOpen = true;
      component.toggleOpen();
      expect(component.isOpen).toEqual(false);
    });
  });

  describe('highlight', () => {
    it('can alert the user state which node the user has moused over', () => {
      spyOn(stateService.userState, 'setHighLightedNode');
      component.highlight('blah');
      expect(stateService.userState.setHighLightedNode).toHaveBeenCalledWith('blah');
    });
  });

  describe('unhighlight', () => {
    it('can alert the user state when the user is not over any cards', () => {
      spyOn(stateService.userState, 'setHighLightedNode');
      component.unhighlight();
      expect(stateService.userState.setHighLightedNode).toHaveBeenCalledWith(null);
    });
  });

  describe('beforeChanges (panel changes)', () => {
    it('sets the current node if the user clicks on a different panel', () => {
      component.currentNode = 'something Else';
      const $event = {
        nextState: true,
        panelId: 'new id'
      };
      spyOn(stateService.userState, 'setCurrentNode');
      component.beforeChange($event as any);
      expect(stateService.userState.setCurrentNode).toHaveBeenCalledWith('new id');
    });

    it('does not change the userstate if the node is the same', () => {
      component.currentNode = 'same id';
      const $event = {
        nextState: true,
        panelId: 'same id'
      };
      spyOn(stateService.userState, 'setCurrentNode');
      component.beforeChange($event as any);
      expect(stateService.userState.setCurrentNode).not.toHaveBeenCalled();
    });

    it('does not change the userState if this is not a user action', () => {
      component.currentNode = 'different id';
      const $event = {
        nextState: false,
        panelId: 'something else'
      };
      spyOn(stateService.userState, 'setCurrentNode');
      component.beforeChange($event as any);
      expect(stateService.userState.setCurrentNode).not.toHaveBeenCalled();
    });
  });
});
