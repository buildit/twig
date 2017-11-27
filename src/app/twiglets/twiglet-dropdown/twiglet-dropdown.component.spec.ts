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
import { router, modelsList, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { RenameTwigletModalComponent } from './../rename-twiglet-modal/rename-twiglet-modal.component';
import { StateService } from '../../state.service';
import { TwigletDropdownComponent } from './twiglet-dropdown.component';
import TWIGLET from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';

describe('TwigletDropdownComponent', () => {
  let component: TwigletDropdownComponent;
  let fixture: ComponentFixture<TwigletDropdownComponent>;
  let stateServiceStubbed = stateServiceStub();
  let mockRouter = router();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    mockRouter = router();
    TestBed.configureTestingModule({
      declarations: [ TwigletDropdownComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: mockRouter },
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

  it('navigates to the new location when a twiglet is loaded', () => {
    fixture.nativeElement.querySelector('.twigname').click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/twiglet', 'name1']);
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
    fixture.nativeElement.querySelector('.fa-pencil').click();
    expect(component.modalService.open).toHaveBeenCalledWith(RenameTwigletModalComponent);
  });

  it('opens the delete twiglet modal when the delete icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { twiglet: Map({}), resourceName: 'name1' }
    });
    fixture.nativeElement.querySelector('.fa-trash').click();
    expect(component.modalService.open).toHaveBeenCalledWith(DeleteTwigletConfirmationComponent);
  });

  describe('render', () => {
    describe('authenticated/unauthenticated user', () => {
      describe('authenticated', () => {
        it('allows cloning', () => {
          expect(fixture.nativeElement.querySelector('.fa-files-o')).toBeTruthy();
        });

        it('allows renaming', () => {
          expect(fixture.nativeElement.querySelector('.fa-pencil')).toBeTruthy();
        });

        it('allows cloning', () => {
          expect(fixture.nativeElement.querySelector('.fa-trash')).toBeTruthy();
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          component.userState = component.userState.set(USERSTATE.USER, null);
          fixture.detectChanges();
        })
        it('disallows cloning', () => {
          expect(fixture.nativeElement.querySelector('.fa-files-o')).toBeFalsy();
        });

        it('disallows renaming', () => {
          expect(fixture.nativeElement.querySelector('.fa-pencil')).toBeFalsy();
        });

        it('disallows cloning', () => {
          expect(fixture.nativeElement.querySelector('.fa-trash')).toBeFalsy();
        });
      });
    });
  });
});
