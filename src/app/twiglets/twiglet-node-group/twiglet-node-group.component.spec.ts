import { NodeInfoComponent } from './../node-info/node-info.component';
import { ImmutableMapOfMapsPipe } from './../../shared/immutable-map-of-maps.pipe';
import { FilterByObjectPipe } from './../../shared/filter-by-object.pipe';
import { ObjectSortPipe } from './../../shared/object-sort.pipe';
import { NodeSearchPipe } from './../../shared/node-search.pipe';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
