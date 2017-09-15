import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { ModelDetailsComponent } from './../model-details/model-details.component';
import { ModelModeLeftBarComponent } from './model-mode-left-bar.component';

describe('ModelModeLeftBarComponent', () => {
  let component: ModelModeLeftBarComponent;
  let fixture: ComponentFixture<ModelModeLeftBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModelDetailsComponent,
        ModelModeLeftBarComponent
      ],
      imports: [ NgbAccordionModule ],
      providers: [ NgbAccordionConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelModeLeftBarComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.userState = Map({
      isEditing: false
    });
    component.model = Map({
      name: 'name',
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('does not display the accordion when no model is selected', () => {
    component.userState = Map({
      isEditing: false
    });
    component.model = Map({
      name: null,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ngb-accordion')).toBeNull();
  });

  it('displays the details panel when not editing', () => {
    component.userState = Map({
      isEditing: false
    });
    component.model = Map({
      name: 'name',
    });
    fixture.detectChanges();
    let headerTitles = [];
    const cardHeaders = <NodeListOf<HTMLAnchorElement>>fixture.nativeElement.querySelectorAll('.card-header a');
    headerTitles = Array.from(cardHeaders).map(el => el.innerText);
    expect(headerTitles).toContain('Details');
  });

  it('does not display the details panel when editing', () => {
    component.userState = Map({
      isEditing: true
    });
    component.model = Map({
      name: 'name',
    });
    fixture.detectChanges();
    let headerTitles = [];
    const cardHeaders = <NodeListOf<HTMLAnchorElement>>fixture.nativeElement.querySelectorAll('.card-header a');
    headerTitles = Array.from(cardHeaders).map(el => el.innerText);
    expect(headerTitles).not.toContain('Details');
  });
});
