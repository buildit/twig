import { Observable } from 'rxjs/Observable';
import { async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component } from '@angular/core';
import { EditRouteGuard } from './edit-route-guard';


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

  beforeEach(() => {
    component = new Component({});
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
    editRouteGuard = new EditRouteGuard(<any>stateService);
  });

  describe('canDeactivate', () => {
    it('confirms with the user if the twiglet is dirty', () => {
      twigletDirtyBs.next(true);
      spyOn(window, 'confirm').and.returnValue(true);
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(window.confirm).toHaveBeenCalled();
      });
    });

    it('confirms with the user if the twiglet model is dirty', () => {
      twigletModelDirtyBs.next(true);
      spyOn(window, 'confirm').and.returnValue(true);
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(window.confirm).toHaveBeenCalled();
      });
    });

    it('confirms with the user if the model is dirty', () => {
      modelDirtyBs.next(true);
      spyOn(window, 'confirm').and.returnValue(true);
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(window.confirm).toHaveBeenCalled();
      });
    });

    it('does not confirm with the user if nothing is dirty', () => {
      spyOn(window, 'confirm');
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(window.confirm).not.toHaveBeenCalled();
      });
    });

    it('proceeds with the route if everything is clean', () => {
      spyOn(editRouteGuard, 'proceedWithRoute').and.returnValue(Observable.of(true));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.proceedWithRoute).toHaveBeenCalled();
      });
    })

    it('procedes with the route if the user confirms', () => {
      modelDirtyBs.next(true);
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(editRouteGuard, 'proceedWithRoute').and.returnValue(Observable.of(true));
      editRouteGuard.canDeactivate(component, <any>{}, <any>{}, <any>{})
      .subscribe(() => {
        expect(editRouteGuard.proceedWithRoute).toHaveBeenCalled();
      });
    });

    it('returns a false observable if the user does not confirm', () => {
      modelDirtyBs.next(true);
      spyOn(window, 'confirm').and.returnValue(false);
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
    })
  })
});
