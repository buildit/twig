import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject, BehaviorSubject } from 'rxjs/Rx';

import { CommitModalComponent } from './shared/commit-modal/commit-modal.component';
import { DiscardChangesModalComponent } from './shared/discard-changes-modal/discard-changes-modal.component';
import { EditRouteGuard } from './edit-route-guard';
import { StateService } from './state.service';
import { stateServiceStub } from '../non-angular/testHelpers';

describe('EditRouteGuard', () => {
  let component = new Component({});
  let editRouteGuard: EditRouteGuard;
  let fakeModalObservable = new ReplaySubject();
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async() => {
    stateServiceStubbed = stateServiceStub();
    stateServiceStubbed.userState.setCurrentUser({ id: 'user@user' });
    fakeModalObservable = new ReplaySubject();
    TestBed.configureTestingModule({
      imports: [ NgbModule.forRoot() ],
      providers: [
        EditRouteGuard,
        NgbModal,
        { provide: StateService, useValue: stateServiceStubbed },
      ]
    });
  });

  beforeEach(() => {
    component = new Component({});
    editRouteGuard = TestBed.get(EditRouteGuard);
  })

  describe('canDeactivate', () => {
    it('brings up the discard changes modal if the twiglet is dirty', () => {
      stateServiceStubbed.twiglet['_isDirty'].next(true);
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).toHaveBeenCalledWith(DiscardChangesModalComponent);
      });
    });

    it('brings up the discard changes modal if the twiglet model is dirty', () => {
      stateServiceStubbed.twiglet.modelService['_isDirty'].next(true);
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).toHaveBeenCalledWith(DiscardChangesModalComponent);
      });
    });

    it('brings up the discard changes modal if the model is dirty', () => {
      stateServiceStubbed.model['_isDirty'].next(true);
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).toHaveBeenCalledWith(DiscardChangesModalComponent);
      });
    });

    it('does not bring up the discard changes modal if nothing is dirty', () => {
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).not.toHaveBeenCalled();
      });
    });

    it('proceeds with the route if everything is clean', () => {
      spyOn(editRouteGuard, 'proceedWithRoute').and.returnValue(Observable.of(true));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.proceedWithRoute).toHaveBeenCalled();
      });
    })

    it('opens the commit modal component if the user confirms', (done) => {
      stateServiceStubbed.twiglet.modelService['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).toHaveBeenCalledWith(CommitModalComponent);
        done();
      });
      fakeModalObservable.next({ saveChanges: true });
    });

    it('calls the handle dirty twiglet function if the twiglet is dirty', (done) => {
      stateServiceStubbed.twiglet['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      spyOn(editRouteGuard, 'handleDirtyTwiglet').and.returnValue(Observable.of({}));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.handleDirtyTwiglet).toHaveBeenCalled();
        done();
      });
      fakeModalObservable.next({ saveChanges: true });
    });

    it('calls the handle dirty twiglet model function if the twiglet model is dirty', (done) => {
      stateServiceStubbed.twiglet.modelService['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      spyOn(editRouteGuard, 'handleDirtyTwigletModel').and.returnValue(Observable.of({}));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.handleDirtyTwigletModel).toHaveBeenCalled();
        done();
      });
      fakeModalObservable.next({ saveChanges: true });
    });

    it('calls the handle dirty model function if the the model is dirty', (done) => {
      stateServiceStubbed.model['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      spyOn(editRouteGuard, 'handleDirtyModel').and.returnValue(Observable.of({}));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.handleDirtyModel).toHaveBeenCalled();
        done();
      });
      fakeModalObservable.next({ saveChanges: true });
    });

    it('proceeds with the route if the user enters a commit message when the model is dirty', (done) => {
      stateServiceStubbed.model['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: {
          dismissModal: () => {},
          observable: fakeModalObservable.asObservable() }
      });
      spyOn(stateServiceStubbed.model, 'saveChanges').and.returnValue(Observable.of({}));
      spyOn(editRouteGuard, 'proceedWithRoute').and.returnValue(Observable.of({}));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.proceedWithRoute).toHaveBeenCalled();
        done();
      });
      fakeModalObservable.next({ saveChanges: true, commit: 'commit', continueEdit: false });
    });

    it('returns a false observable if the user does not confirm', (done) => {
      stateServiceStubbed.model['_isDirty'].next(true);
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe((result) => {
        expect(result).toBeFalsy();
        done();
      });
      fakeModalObservable.next({ saveChanges: false });
    });

    it('returns a false observable if the user does not enter a commit message with a dirty model', (done) => {
      stateServiceStubbed.model['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe((result) => {
        expect(result).toBeFalsy();
        done();
      });
      fakeModalObservable.next({ saveChanges: true, commit: '', continueEdit: false });
    });

    it('proceeds with the route if the user enters a commit message when the twiglet is dirty', (done) => {
      stateServiceStubbed.twiglet['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: {
          dismissModal: () => {},
          observable: fakeModalObservable.asObservable() }
      });
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.of({}));
      spyOn(editRouteGuard, 'proceedWithRoute').and.returnValue(Observable.of({}));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.proceedWithRoute).toHaveBeenCalled();
        done();
      });
      fakeModalObservable.next({ saveChanges: true, commit: 'commit', continueEdit: false });
    });

    it('proceeds with the route if the user enters a commit message when the twiglet model is dirty', (done) => {
      stateServiceStubbed.twiglet.modelService['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: {
          dismissModal: () => {},
          observable: fakeModalObservable.asObservable() }
      });
      spyOn(stateServiceStubbed.twiglet.modelService, 'saveChanges').and.returnValue(Observable.of({}));
      spyOn(editRouteGuard, 'proceedWithRoute').and.returnValue(Observable.of({}));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.proceedWithRoute).toHaveBeenCalled();
        done();
      });
      fakeModalObservable.next({ saveChanges: true, commit: 'commit', continueEdit: false });
    });

    it('returns a false observable if the user does not enter a commit message with a dirty twiglet', (done) => {
      stateServiceStubbed.twiglet['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe((result) => {
        expect(result).toBeFalsy();
        done();
      });
      fakeModalObservable.next({ saveChanges: true, commit: '', continueEdit: false });
    });

    it('returns a false observable if the user does not enter a commit message with a dirty twiglet model', (done) => {
      stateServiceStubbed.twiglet.modelService['_isDirty'].next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe((result) => {
        expect(result).toBeFalsy();
        done();
      });
      fakeModalObservable.next({ saveChanges: true, commit: '', continueEdit: false });
    });
  });

  describe('proceedWithRoute', () => {
    it('restores the model backup', () => {
      spyOn(stateServiceStubbed.model, 'restoreBackup');
      editRouteGuard.proceedWithRoute()
      .subscribe(() => {
        expect(stateServiceStubbed.model.restoreBackup).toHaveBeenCalled();
      });
    });

    it('leaves edit mode', () => {
      spyOn(stateServiceStubbed.userState, 'setEditing');
      editRouteGuard.proceedWithRoute()
      .subscribe(() => {
        expect(stateServiceStubbed.userState.setEditing).toHaveBeenCalledWith(false);
      });
    });

    it('clears the current twiglet', () => {
      spyOn(stateServiceStubbed.twiglet, 'clearCurrentTwiglet');
      editRouteGuard.proceedWithRoute()
      .subscribe(() => {
        expect(stateServiceStubbed.twiglet.clearCurrentTwiglet).toHaveBeenCalled();
      });
    });

    it('responds with true', () => {
      editRouteGuard.proceedWithRoute()
      .subscribe(result => {
        expect(result).toBeTruthy();
      });
    });
  });
});
