import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from './../../state.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { stateServiceStub, viewsList } from '../../../non-angular/testHelpers';
import { ViewDropdownComponent } from './view-dropdown.component';
import { Map, fromJS } from 'immutable';

describe('ViewDropdownComponent', () => {
  let stateServiceStubbed = stateServiceStub();
  let component: ViewDropdownComponent;
  let fixture: ComponentFixture<ViewDropdownComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  }

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    }
    TestBed.configureTestingModule({
      declarations: [ ViewDropdownComponent ],
      imports: [ NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: mockRouter },
        NgbModal,
      ],
    })

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDropdownComponent);
    component = fixture.componentInstance;
    component.views = viewsList();
    component.twiglet = Map({});
    component.userState = fromJS({
      currentViewName: 'view1',
      user: 'some user',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a new view when create new view is clicked', () => {
    spyOn(component, 'newView');
    fixture.nativeElement.querySelector('ul > li > span').click();
    expect(component.newView).toHaveBeenCalled();
  });

  it('loads a view when that view name is clicked', () => {
    spyOn(component, 'loadView');
    fixture.nativeElement.querySelector('span.view-name').click();
    expect(component.loadView).toHaveBeenCalledWith('view1');
  });

  it('loading a view sets the view to the userState', () => {
    spyOn(stateServiceStubbed.userState, 'setCurrentView');
    component.loadView('view1');
    expect(stateServiceStubbed.userState.setCurrentView).toHaveBeenCalledWith('view1');
  });
});
