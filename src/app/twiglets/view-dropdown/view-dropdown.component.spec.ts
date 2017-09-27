import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
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
    component.twiglet = Map({
      name: 'a twiglet',
    });
    component.userState = fromJS({
      currentViewName: 'view1',
      user: 'some user',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loading a view', () => {
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

  describe('deleting a view', () => {
    let componentInstance = {
      setup: jasmine.createSpy('setup'),
    };

    beforeEach(() => {
      componentInstance = {
        setup: jasmine.createSpy('setup'),
      };
      spyOn(component['modalService'], 'open').and.returnValue({ componentInstance });
      fixture.nativeElement.querySelector('i.fa-trash').click();
    });

    it('opens the delete modal', () => {
      expect(component['modalService'].open).toHaveBeenCalledWith(DeleteViewConfirmationComponent);
    });

    it('sets up the delete modal', () => {
      expect(componentInstance.setup).toHaveBeenCalledWith(viewsList().get(0), component.twiglet, component.userState)
    });
  });

});
