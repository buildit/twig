import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { StateService } from './state.service';

@Injectable()
export class EditRouteGuard implements CanDeactivate<Component> {

  dirtyTwiglet;
  dirtyTwigletModel;

  constructor(private stateService: StateService) {
  }

  canDeactivate(
    component: Component,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) {
      return this.stateService.twiglet.dirty.first().flatMap(dirtyTwiglet => {
        return this.stateService.twiglet.modelService.dirty.first().flatMap(dirtyTwigletModel => {
          return this.stateService.model.dirty.first().flatMap(dirtyModel => {
            if (dirtyTwiglet || dirtyTwigletModel || dirtyModel) {
              if (window.confirm('Discard unsaved changes?')) {
                return this.proceedWithRoute();
              }
              return Observable.of(false);
            }
            return this.proceedWithRoute();
          });
        });
      });
  }

  proceedWithRoute() {
    this.stateService.model.restoreBackup();
    this.stateService.userState.setEditing(false);
    this.stateService.twiglet.clearCurrentTwiglet();
    return Observable.of(true);
  }
}
