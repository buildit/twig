import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject, BehaviorSubject } from 'rxjs/Rx';

import { CommitModalComponent } from './shared/commit-modal/commit-modal.component';
import { DiscardChangesModalComponent } from './shared/discard-changes-modal/discard-changes-modal.component';
import { EditRouteGuard } from './edit-route-guard';
import { StateService } from './state.service';

describe('EditRouteGuard', () => {
  let component = new Component({});
  let twigletDirtyBs = new BehaviorSubject<boolean>(false);
  let twigletModelDirtyBs = new BehaviorSubject<boolean>(false);
  let modelDirtyBs = new BehaviorSubject<boolean>(false);
  let stateService = {
    model: {
      dirty: modelDirtyBs,
      restoreBackup: jasmine.createSpy('restoreBackup'),
    },
    twiglet: {
      clearCurrentTwiglet: jasmine.createSpy('clearCurrentTwiglet'),
      dirty: twigletDirtyBs,
      modelService: {
        dirty: twigletModelDirtyBs,
      }
    },
    userState: {
      setEditing: jasmine.createSpy('setEditing'),
    },
  };
  let editRouteGuard: EditRouteGuard;
  let fakeModalObservable;

  beforeEach(async() => {
    twigletDirtyBs = new BehaviorSubject<boolean>(false);
    twigletModelDirtyBs = new BehaviorSubject<boolean>(false);
    modelDirtyBs = new BehaviorSubject<boolean>(false);
    stateService = {
      model: {
        dirty: modelDirtyBs,
        restoreBackup: jasmine.createSpy('restoreBackup'),
      },
      twiglet: {
        clearCurrentTwiglet: jasmine.createSpy('clearCurrentTwiglet'),
        dirty: twigletDirtyBs,
        modelService: {
          dirty: twigletModelDirtyBs,
        }
      },
      userState: {
        setEditing: jasmine.createSpy('setEditing'),
      },
    };
    fakeModalObservable = new ReplaySubject();
    TestBed.configureTestingModule({
      imports: [ NgbModule.forRoot() ],
      providers: [
        EditRouteGuard,
        NgbModal,
        { provide: StateService, useValue: stateService },
      ]
    });
  });

  beforeEach(() => {
    component = new Component({});
    editRouteGuard = TestBed.get(EditRouteGuard);
  })

  describe('canDeactivate', () => {
    it('brings up the discard changes modal if the twiglet is dirty', () => {
      twigletDirtyBs.next(true);
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).toHaveBeenCalledWith(DiscardChangesModalComponent);
      });
    });

    it('brings up the discard changes modal if the twiglet model is dirty', () => {
      twigletModelDirtyBs.next(true);
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).toHaveBeenCalledWith(DiscardChangesModalComponent);
      });
    });

    it('brings up the discard changes modal if the model is dirty', () => {
      modelDirtyBs.next(true);
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

    it('opens the commit modal component if the user confirms', () => {
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      modelDirtyBs.next(true);
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable(true) } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.modalService.open).toHaveBeenCalledWith(CommitModalComponent);
      });
    });

    it('calls the handle dirty twiglet function if the twiglet is dirty', () => {
      twigletDirtyBs.next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable(true) } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      spyOn(editRouteGuard, 'handleDirtyTwiglet');
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.handleDirtyTwiglet).toHaveBeenCalled();
      });
    });

    it('calls the handle dirty twiglet model function if the twiglet model is dirty', () => {
      twigletModelDirtyBs.next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable(true) } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      spyOn(editRouteGuard, 'handleDirtyTwigletModel');
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.handleDirtyTwigletModel).toHaveBeenCalled();
      });
    });

    it('calls the handle dirty model function if the the model is dirty', () => {
      modelDirtyBs.next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable(true) } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() }
      });
      spyOn(editRouteGuard, 'handleDirtyModel');
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.handleDirtyModel).toHaveBeenCalled();
      });
    });

    it('proceeds with the route if the user enters a commit message', () => {
      modelDirtyBs.next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable(true) } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable({commit: 'commit', continueEdit: true}) }
      });
      spyOn(editRouteGuard, 'proceedWithRoute');
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.proceedWithRoute).toHaveBeenCalled();
      });
    });

    it('returns a false observable if the user does not confirm', () => {
      modelDirtyBs.next(true);
      spyOn(editRouteGuard.modalService, 'open').and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable() } });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe((result) => {
        expect(result).toBeFalsy();
      });
    });

    it('returns a false observable if the user does not enter a commit message', () => {
      modelDirtyBs.next(true);
      const openSpy = spyOn(editRouteGuard.modalService, 'open');
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable(true) } });
      openSpy.and.returnValue({
        componentInstance: { observable: fakeModalObservable.asObservable({commit: '', continueEdit: true}) }
      });
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe((result) => {
        expect(result).toBeFalsy();
      });
    });
  });

  describe('proceedWithRoute', () => {
    it('restores the model backup', () => {
      editRouteGuard.proceedWithRoute()
      .subscribe(() => {
        expect(stateService.model.restoreBackup).toHaveBeenCalled();
      });
    });

    it('leaves edit mode', () => {
      editRouteGuard.proceedWithRoute()
      .subscribe(() => {
        expect(stateService.userState.setEditing).toHaveBeenCalledWith(false);
      });
    });

    it('clears the current twiglet', () => {
      editRouteGuard.proceedWithRoute()
      .subscribe(() => {
        expect(stateService.twiglet.clearCurrentTwiglet).toHaveBeenCalled();
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
