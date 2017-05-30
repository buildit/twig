import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { CommitModalComponent } from './../commit-modal/commit-modal.component';
import { EditModeButtonComponent } from './edit-mode-button.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('EditModeButtonComponent', () => {
  let component: EditModeButtonComponent;
  let fixture: ComponentFixture<EditModeButtonComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModeButtonComponent ],
      imports: [ NgbTooltipModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router,
          useValue: {
            events: Observable.of('/'),
            navigate: jasmine.createSpy('navigate'),
          }
        },
     ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModeButtonComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      isEditing: true,
      mode: 'twiglet',
    });
    component.twiglet = Map({
      name: 'whatever',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display when editing', () => {
    beforeEach(() => {
      stateServiceStubbed.userState.setEditing(true);
      fixture.detectChanges();
    });

    it('should display the save button', () => {
      expect(fixture.nativeElement.querySelector('.fa-check')).toBeTruthy();
    });

    it('should display the discard button', () => {
      expect(fixture.nativeElement.querySelector('.fa-times')).toBeTruthy();
    });
  });

  describe('display when not editing', () => {
    beforeEach(() => {
      component.userState = Map({
        isEditing: false,
        mode: 'twiglet',
      });
      component['cd'].markForCheck();
      fixture.detectChanges();
    });

    it('should not display save button if user is not editing', () => {
      expect(fixture.nativeElement.querySelector('.fa-check')).toBeNull();
    });

    it('should not display discard button if user is not editing', () => {
      expect(fixture.nativeElement.querySelector('.fa-times')).toBeNull();
    });
  });

  it('start editing creates a backup', () => {
    spyOn(stateServiceStubbed.twiglet, 'createBackup');
    component.startEditing();
    expect(stateServiceStubbed.twiglet.createBackup).toHaveBeenCalled();
  });

  it('should load the current twiglet when discard changes is clicked', () => {
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'restoreBackup');
    fixture.nativeElement.querySelector('.fa-times').click();
    expect(stateServiceStubbed.twiglet.restoreBackup).toHaveBeenCalled();
  });

  it('save button is disabled when form is invalid', () => {
    component.userState = Map({
      formValid: false,
      isEditing: true,
    });
    component['cd'].markForCheck();
    fixture.detectChanges();
    spyOn(component, 'saveChanges');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveChanges).not.toHaveBeenCalled();
  });

  it('save button is not disabled when form is valid', () => {
    component.userState = Map({
      formValid: true,
      isEditing: true,
    });
    component['cd'].markForCheck();
    fixture.detectChanges();
    spyOn(component, 'saveChanges');
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.saveChanges).toHaveBeenCalled();
  });

  it('save twiglet opens the commit modal', () => {
    component.userState = Map({
      formValid: true,
      isEditing: true,
    });
    component['cd'].markForCheck();
    fixture.detectChanges();
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {} });
    fixture.nativeElement.querySelector('.fa-check').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CommitModalComponent);
  });

  it('editing a twiglet model navigates to the twiglet model form', () => {
    component.editTwigletModel();
    expect(component.router.navigate).toHaveBeenCalledWith(['/twiglet', 'whatever', 'model']);
  });

  describe('saving twiglet model', () => {
    beforeEach(() => {
      component.userState = Map({
        editTwigletModel: true,
        formValid: true,
        isEditing: true,
      });
      component['cd'].markForCheck();
      fixture.detectChanges();
    });

    it('submits changes to a twiglet model when save is clicked', () => {
      stateServiceStubbed.twiglet.loadTwiglet('name1').subscribe(response => {
        spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
        component.saveTwigletModel();
        expect(stateServiceStubbed.twiglet.saveChanges).toHaveBeenCalled();
      });
    });

    it('updates the list of twiglets when the twiglet model is saved', () => {
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.of({}));
      spyOn(stateServiceStubbed.twiglet, 'updateListOfTwiglets');
      component.saveTwigletModel();
      expect(stateServiceStubbed.twiglet.updateListOfTwiglets).toHaveBeenCalled();
    });

    it('has an error message if there is an error saving the twiglet model', () => {
      spyOn(console, 'error');
      spyOn(stateServiceStubbed.twiglet.modelService, 'saveChanges').and.returnValue(Observable.throw({statusText: 'whatever'}));
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
      component.saveTwigletModel();
      expect(component.errorMessage).toEqual('Something went wrong saving your changes.');
    });

    it('has an error message if there is an error saving the twiglet after saving its model', () => {
      spyOn(console, 'error');
      spyOn(stateServiceStubbed.twiglet.modelService, 'saveChanges').and.returnValue({ subscribe: () => {} });
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.throw({statusText: 'whatever'}));
      component.saveTwigletModel();
      expect(component.errorMessage).toEqual('Something went wrong saving your changes.');
    });
  });
});
