import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { AboutTwigletModalComponent } from './../about-twiglet-modal/about-twiglet-modal.component';
import { CreateTwigletModalComponent } from './../create-twiglet-modal/create-twiglet-modal.component';
import { DeleteTwigletConfirmationComponent } from './../../shared/delete-confirmation/delete-twiglet-confirmation.component';
import { EditTwigletDetailsComponent } from './../edit-twiglet-details/edit-twiglet-details.component';
import { modelsList, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { StateService } from '../../state.service';
import { TwigletDropdownComponent } from './twiglet-dropdown.component';

describe('TwigletDropdownComponent', () => {
  let component: TwigletDropdownComponent;
  let fixture: ComponentFixture<TwigletDropdownComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletDropdownComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        ToastsManager,
        ToastOptions,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletDropdownComponent);
    component = fixture.componentInstance;
    component.twiglets = twigletsList();
    component.models = modelsList();
    component.userState = Map({
      user: 'not null',
    });
    component.twiglet = Map({
      name: 'name1'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of the twiglets', () => {
    expect(fixture.nativeElement.querySelectorAll('li.twiglet-list-item').length).toEqual(2);
  });

  it('opens a new twiglet modal when new twiglet is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setupTwigletAndModelLists: () => {} } });
    fixture.nativeElement.querySelector('.dropdown-item').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CreateTwigletModalComponent);
  });

  it('loads a twiglet when that twiglet name is clicked', () => {
    spyOn(component, 'loadTwiglet');
    fixture.nativeElement.querySelector('.clickable.col-6').click();
    expect(component.loadTwiglet).toHaveBeenCalledWith('name1');
  });

  it('opens the about twiglet modal when the about icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { twigletName: 'name1', description: 'description', currentTwiglet: 'name1' }
    });
    fixture.nativeElement.querySelector('.fa-info-circle').click();
    expect(component.modalService.open).toHaveBeenCalledWith(AboutTwigletModalComponent, { size: 'lg' });
  });

  it('opens the create twiglet modal when the clone icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { setupTwigletAndModelLists: () => {}, clone: Map({}) }
    });
    fixture.nativeElement.querySelector('.fa-files-o').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CreateTwigletModalComponent);
  });

  it('opens the rename twiglet modal when the rename icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { setupTwigletLists: () => {}, twigletName: 'name1', currentTwiglet: 'name1' }
    });
    fixture.nativeElement.querySelector('.fa-strikethrough').click();
    expect(component.modalService.open).toHaveBeenCalledWith(EditTwigletDetailsComponent);
  });

  it('opens the delete twiglet modal when the delete icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { twiglet: Map({}), resourceName: 'name1' }
    });
    fixture.nativeElement.querySelector('.fa-trash').click();
    expect(component.modalService.open).toHaveBeenCalledWith(DeleteTwigletConfirmationComponent);
  });
});
