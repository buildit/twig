import { DebugElement, NgModule, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { stateServiceStub, viewsList } from '../../../non-angular/testHelpers';
import { ViewListComponent } from './view-list.component';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';

describe('ViewListComponent', () => {
  let component: ViewListComponent;
  let fixture: ComponentFixture<ViewListComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortImmutablePipe, ViewListComponent ],
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
    fixture = TestBed.createComponent(ViewListComponent);
    component = fixture.componentInstance;
    component.views = viewsList();
    component.twiglet = Map({});
    component.userState = Map({
      currentViewName: 'view1',
      user: 'some user',
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('displays a list of the views', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.list-group-item').length).toEqual(2);
  });

  it('opens a new view modal when new view is clicked', () => {
    fixture.detectChanges();
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {} });
    fixture.nativeElement.querySelector('.fa-plus').click();
    expect(component.modalService.open).toHaveBeenCalledWith(ViewsSaveModalComponent);
  });

  it('loads a view when that view name is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'loadView');
    fixture.nativeElement.querySelector('span.view-name').click();
    expect(component.loadView).toHaveBeenCalledWith('view1');
  });

  it('loading a view sets the view to the userState', () => {
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'setCurrentView');
    component.loadView('view1');
    expect(stateServiceStubbed.userState.setCurrentView).toHaveBeenCalledWith('view1');
  });

  it('opens the save view modal when the overwrite icon is clicked', () => {
    fixture.detectChanges();
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setup: () => {} } });
    fixture.nativeElement.querySelector('.fa-floppy-o').click();
    expect(component.modalService.open).toHaveBeenCalledWith(ViewsSaveModalComponent);
  });

  it('opens the delete view modal when the delete icon is clicked', () => {
    fixture.detectChanges();
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setup: () => {} } });
    fixture.nativeElement.querySelector('.fa-trash').click();
    expect(component.modalService.open).toHaveBeenCalledWith(DeleteViewConfirmationComponent);
  });

  describe('render', () => {
    describe('active view is displayed', () => {
      it('puts a checkbox if that view is currently being displayed', () => {
        fixture.detectChanges();
        const lis = <NodeListOf<HTMLLIElement>>fixture.nativeElement.querySelectorAll('li.view-list-item');
        expect(lis[0].querySelector('i.fa-check-circle')).toBeTruthy();
      });

      it('does not put a check next to views that are not being displayed', () => {
        fixture.detectChanges();
        const lis = <NodeListOf<HTMLLIElement>>fixture.nativeElement.querySelectorAll('li.view-list-item');
        expect(lis[1].querySelector('i.fa-check-circle')).toBeFalsy();
      });
    });

    describe('only logged in users can make changes', () => {
      it('shows the edit icon if the user is logged in', () => {
        fixture.detectChanges();
        const lis = <NodeListOf<HTMLLIElement>>fixture.nativeElement.querySelectorAll('li.view-list-item');
        expect(lis[0].querySelector('.fa-floppy-o')).toBeTruthy();
      });

      it('does not display the edit icon if the user is not logged in', () => {
        component.userState = component.userState.set('user', null);
        fixture.detectChanges();
        const lis = <NodeListOf<HTMLLIElement>>fixture.nativeElement.querySelectorAll('li.view-list-item');
        expect(lis[0].querySelector('.fa-floppy-o')).toBeFalsy();
      });
    });
  });
});
