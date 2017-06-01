import { DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { stateServiceStub, viewsList } from '../../../non-angular/testHelpers';
import { ViewDropdownComponent } from './view-dropdown.component';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';

describe('ViewDropdownComponent', () => {
  let component: ViewDropdownComponent;
  let fixture: ComponentFixture<ViewDropdownComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDropdownComponent, SortImmutablePipe ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
        { provide: StateService, useValue: stateServiceStubbed },
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
    component.userState = Map({
      user: 'some user',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of the views', () => {
    expect(fixture.nativeElement.querySelectorAll('li.view-list-item').length).toEqual(2);
  });

  it('opens a new view modal when new view is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {} });
    fixture.nativeElement.querySelector('.dropdown-item').click();
    expect(component.modalService.open).toHaveBeenCalledWith(ViewsSaveModalComponent);
  });

  it('loads a view when that view name is clicked', () => {
    spyOn(component, 'loadView');
    fixture.nativeElement.querySelector('.clickable.col-6').click();
    expect(component.loadView).toHaveBeenCalledWith('view1');
  });

  it('loading a view sets the view to the userState', () => {
    spyOn(stateServiceStubbed.userState, 'setCurrentView');
    component.loadView('view1');
    expect(stateServiceStubbed.userState.setCurrentView).toHaveBeenCalledWith('view1');
  });

  it('opens the save view modal when the overwrite icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setup: () => {} } });
    fixture.nativeElement.querySelector('.fa-floppy-o').click();
    expect(component.modalService.open).toHaveBeenCalledWith(ViewsSaveModalComponent);
  });

  it('opens the delete view modal when the delete icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setup: () => {} } });
    fixture.nativeElement.querySelector('.fa-trash').click();
    expect(component.modalService.open).toHaveBeenCalledWith(DeleteViewConfirmationComponent);
  });
});
