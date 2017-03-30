import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';

import { FilterByObjectPipe } from './../../shared/filter-by-object.pipe';
import { ImmutableMapOfMapsPipe } from './../../shared/immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../../shared/node-search.pipe';
import { ObjectSortPipe } from './../../shared/object-sort.pipe';
import { StateService } from '../../state.service';
import { fullTwigletMap, fullTwigletModelMap, stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletNodeGroupComponent } from './twiglet-node-group.component';

describe('TwigletNodeGroupComponent', () => {
  let component: TwigletNodeGroupComponent;
  let fixture: ComponentFixture<TwigletNodeGroupComponent>;

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
      providers: [{ provide: StateService, useValue: stateServiceStub() }],
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
    }, []];
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
    expect(component.viewNodeCount).toEqual(0);
  });
});
