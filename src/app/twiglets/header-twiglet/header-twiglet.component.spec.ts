import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { List, Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, ReplaySubject } from 'rxjs/Rx';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { CopyPasteNodeComponent } from './../copy-paste-node/copy-paste-node.component';
import { CreateTwigletModalComponent } from './../create-twiglet-modal/create-twiglet-modal.component';
import { fullTwigletMap, modelsList, stateServiceStub, twigletsList } from '../../../non-angular/testHelpers';
import { HeaderTwigletComponent } from './header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { routerForTesting } from './../../app.router';
import { StateService } from './../../state.service';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';

describe('HeaderTwigletComponent', () => {
  let component: HeaderTwigletComponent;
  let fixture: ComponentFixture<HeaderTwigletComponent>;
  let stateServiceStubbed = stateServiceStub();
  let fakeModalObservable;
  let closeModal;
  let setCommitMessage;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    closeModal = jasmine.createSpy('closeModal');
    setCommitMessage = jasmine.createSpy('setCommitMessage');
    stateServiceStubbed = stateServiceStub();
    fakeModalObservable = new ReplaySubject();
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        TwigletDropdownComponent,
      ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        ToastsManager,
        ToastOptions,
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: routerForTesting }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderTwigletComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      mode: 'twiglet',
      user: 'user'
    });
    component.twiglet = fullTwigletMap();
    component.twiglets = twigletsList();
    component.models = modelsList();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('newTwiglet', () => {
    it('opens a new twiglet modal when new twiglet is clicked', () => {
      spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setupTwigletAndModelLists: () => {} } });
      component.createNewTwiglet();
      expect(component.modalService.open).toHaveBeenCalledWith(CreateTwigletModalComponent);
    });
  });

  describe('setRenderEveryTick', () => {
    it('sets Render on every tick to true if checked', () => {
      stateServiceStubbed.userState.setRenderOnEveryTick(false);
      component.setRenderEveryTick({ target: { checked: true } });
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('renderOnEveryTick')).toBeTruthy();
      });
    });

    it('sets Render on every tick to false if unchecked', () => {
      stateServiceStubbed.userState.setRenderOnEveryTick(true);
      component.setRenderEveryTick({ target: { checked: false } });
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('renderOnEveryTick')).toBeFalsy();
      });
    });
  });

  describe('setRunSimulation', () => {
    it('sets Run Simulation to true if checked', () => {
      stateServiceStubbed.userState.setRunSimulation(false);
      component.setRunSimulation({ target: { checked: true } });
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('runSimulation')).toBeTruthy();
      });
    });

    it('sets Run Simulation to false if unchecked', () => {
      stateServiceStubbed.userState.setRunSimulation(true);
      component.setRunSimulation({ target: { checked: false } });
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('runSimulation')).toBeFalsy();
      });
    });
  });

  describe('startEditing', () => {
    beforeEach(() => {
      spyOn(stateServiceStubbed.twiglet, 'createBackup');
      stateServiceStubbed.userState.setFormValid(false);
      stateServiceStubbed.userState.setEditing(false);
      component.startEditing();
    });

    it('creates a backup of the twiglet', () => {
      expect(stateServiceStubbed.twiglet.createBackup).toHaveBeenCalled();
    });

    it('sets formValid to true', () => {
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('formValid')).toBeTruthy();
      });
    });

    it('sets editing to true', () => {
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('isEditing')).toBeTruthy();
      });
    });
  });

  describe('saveTwiglet', () => {
    const bs = new BehaviorSubject({});

    beforeEach(() => {
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: {
          setCommitMessage,
          closeModal,
          observable: fakeModalObservable.asObservable()
        }
      });
    });

    it('opens the model', () => {
      component.saveTwiglet();
      expect(component.modalService.open).toHaveBeenCalledWith(CommitModalComponent);
    });

    describe('form results', () => {

      beforeEach(() => {
        component.startEditing();
        spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(bs.asObservable());
        spyOn(stateServiceStubbed.twiglet, 'createBackup');
        spyOn(stateServiceStubbed.userState, 'startSpinner');
        spyOn(stateServiceStubbed.userState, 'stopSpinner');
        component.saveTwiglet();
      });

      it('starts the spinner when the user responds to the form', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.startSpinner).toHaveBeenCalled();
      });

      it('saves the changes with the correct commit message', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.twiglet.saveChanges).toHaveBeenCalledWith('a commit message');
      });

      it('stops editing mode if the user is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get('isEditing')).toBeFalsy();
        });
      });

      it('continues editing mode if the user chooses to', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: true,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get('isEditing')).toBeTruthy();
        });
      });

      it('updates the backup if the user chooses to continue editing', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: true,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(stateServiceStubbed.twiglet.createBackup).toHaveBeenCalled();
        });
      });

      it('closes the modal', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(closeModal).toHaveBeenCalled();
      });

      it('stops the spinner when everything is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.stopSpinner).toHaveBeenCalled();
      });
    });
  });

  describe('saveTwigletModel', () => {
    beforeEach(() => {
      spyOn(component.modalService, 'open').and.returnValue({
        componentInstance: {
          setCommitMessage,
          closeModal,
          observable: fakeModalObservable.asObservable()
        }
      });
    });

    it('opens the model', () => {
      component.saveTwigletModel();
      expect(component.modalService.open).toHaveBeenCalledWith(CommitModalComponent);
    });

    describe('form results', () => {

      beforeEach(() => {
        component.startEditing();
        spyOn(stateServiceStubbed.twiglet.modelService, 'saveChanges').and.returnValue(Observable.of({}));
        spyOn(stateServiceStubbed.twiglet, 'loadTwiglet').and.returnValue(Observable.of({}));
        spyOn(stateServiceStubbed.twiglet, 'createBackup');
        spyOn(stateServiceStubbed.userState, 'startSpinner');
        spyOn(stateServiceStubbed.userState, 'stopSpinner');
        component.saveTwigletModel();
      });

      it('starts the spinner when the user responds to the form', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.startSpinner).toHaveBeenCalled();
      });

      it('saves the changes with the correct commit message', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.twiglet.modelService.saveChanges).toHaveBeenCalledWith('name1', 'a commit message');
      });

      it('stops editing mode if the user is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get('isEditing')).toBeFalsy();
        });
      });

      it('leaves model mode if the user is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get('editTwigletModel')).toBeFalsy();
        });
      });

      it('continues editing mode if the user chooses to', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: true,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(userState.get('isEditing')).toBeTruthy();
        });
      });

      it('updates the backup if the user chooses to continue editing', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: true,
        });
        stateServiceStubbed.userState.observable.first().subscribe((userState) => {
          expect(stateServiceStubbed.twiglet.createBackup).toHaveBeenCalled();
        });
      });

      it('closes the modal', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(closeModal).toHaveBeenCalled();
      });

      it('stops the spinner when everything is done', () => {
        fakeModalObservable.next({
          commit: 'a commit message',
          continueEdit: false,
        });
        expect(stateServiceStubbed.userState.stopSpinner).toHaveBeenCalled();
      });
    });
  });

  describe('discardChanges', () => {
    beforeEach(() => {
      component.startEditing();
      spyOn(stateServiceStubbed.twiglet, 'restoreBackup');
      component.discardChanges();
    });

    it('resores the backup', () => {
      expect(stateServiceStubbed.twiglet.restoreBackup).toHaveBeenCalled();
    });

    it('leaves editing mode', () => {
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('isEditing')).toBeFalsy();
      });
    });
  });

  describe('toggleTwigletEditing', () => {
    beforeEach(() => {
      stateServiceStubbed.userState.setTwigletModelEditing(true);
    });

    it('sets editTwigletModel to false if the model is not dirty', () => {
      component.dirtyTwigletModel = false;
      component.toggleTwigletEditing();
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('editTwigletModel')).toBeFalsy();
      });
    });

    it('does nothing if the model is dirty', () => {
      component.dirtyTwigletModel = true;
      component.toggleTwigletEditing();
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('editTwigletModel')).toBeTruthy();
      });
    });
  });

  describe('toggleTwigletModelEditing', () => {
    beforeEach(() => {
      stateServiceStubbed.userState.setTwigletModelEditing(false);
    });

    it('sets editTwigletModel to true if the twiglet is not dirty', () => {
      component.dirtyTwiglet = false;
      component.toggleTwigletModelEditing();
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('editTwigletModel')).toBeTruthy();
      });
    });

    it('does nothing if the twiglet is dirty', () => {
      component.dirtyTwiglet = true;
      component.toggleTwigletModelEditing();
      stateServiceStubbed.userState.observable.first().subscribe(userState => {
        expect(userState.get('editTwigletModel')).toBeFalsy();
      });
    });
  });

  describe('getTwigletTabClass', () => {
    it('starts with edit-tab', () => {
      component.userState = component.userState.set('editTwigletModel', true);
      expect(component.getTwigletTabClass()).toEqual('edit-tab ');
    });

    it('appends disabled if the model is dirty', () => {
      component.dirtyTwigletModel = true;
      component.userState = component.userState.set('editTwigletModel', true);
      expect(component.getTwigletTabClass()).toEqual('edit-tab disabled ');
    });

    it('appends active if the mode is not models', () => {
      component.userState = component.userState.set('editTwigletModel', false);
      expect(component.getTwigletTabClass()).toEqual('edit-tab active ');
    });
  });

  describe('getTwigletModelTabClass', () => {
    it('starts with edit-tab', () => {
      component.userState = component.userState.set('editTwigletModel', false);
      expect(component.getTwigletModelTabClass()).toEqual('edit-tab ');
    });

    it('appends disabled if the model is dirty', () => {
      component.dirtyTwiglet = true;
      expect(component.getTwigletModelTabClass()).toEqual('edit-tab disabled ');
    });

    it('appends active if the mode is not models', () => {
      component.userState = component.userState.set('editTwigletModel', true);
      expect(component.getTwigletModelTabClass()).toEqual('edit-tab active ');
    });
  });

  describe('handleError', () => {
    it('returns a function', () => {
      expect(component.handleError({})).toEqual(jasmine.any(Function));
    });

    describe('handling errors', () => {
      let commitModal = {
        errorMessage: null,
      };

      beforeEach(() => {
        commitModal = {
          errorMessage: null,
        };
        spyOn(stateServiceStubbed.userState, 'stopSpinner');
        spyOn(console, 'error');
        component.handleError(commitModal)('error');
      });

      it('stops the spinner', () => {
        expect(stateServiceStubbed.userState.stopSpinner).toHaveBeenCalled();
      });

      it('sets an error message on the modal', () => {
        expect(commitModal.errorMessage).not.toBeNull();
      });

      it('logs the error', () => {
        expect(console.error).toHaveBeenCalledWith('error');
      });
    });
  });
});
