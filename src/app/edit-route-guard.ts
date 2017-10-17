import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { CommitModalComponent } from './shared/commit-modal/commit-modal.component';
import { DiscardChangesModalComponent } from './shared/discard-changes-modal/discard-changes-modal.component';
import { StateService } from './state.service';
import { handleError } from '../non-angular/services-helpers/httpHelpers';

@Injectable()
export class EditRouteGuard implements CanDeactivate<Component> {

  dirtyTwiglet;
  dirtyTwigletModel;

  constructor(private stateService: StateService, public modalService: NgbModal, public toastr: ToastsManager) {
  }

  canDeactivate(
    component: Component,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> {
      return this.stateService.twiglet.dirty.first().flatMap(dirtyTwiglet => {
        return this.stateService.twiglet.modelService.dirty.first().flatMap(dirtyTwigletModel => {
          return this.stateService.model.dirty.first().flatMap(dirtyModel => {
            if (dirtyTwiglet || dirtyTwigletModel || dirtyModel) {
              const modelRef = this.modalService.open(DiscardChangesModalComponent);
              const discardModal = modelRef.componentInstance as DiscardChangesModalComponent;
              return discardModal.observable.first().flatMap(result => {
                if (result.saveChanges) {
                  const modalRef = this.modalService.open(CommitModalComponent);
                  const commitModal = modalRef.componentInstance as CommitModalComponent;
                  if (dirtyTwiglet) {
                    return this.stateService.userState.observable.first().flatMap(user => {
                      const userId = user.toJS().user.user.id;
                      return this.handleDirtyTwiglet(commitModal, userId);
                    });
                  } else if (dirtyModel) {
                    return this.handleDirtyModel(commitModal);
                  } else if (dirtyTwigletModel) {
                    return this.handleDirtyTwigletModel(commitModal);
                  }
                }
                return Observable.of(false);
              });
            }
            return this.proceedWithRoute();
          });
        });
      });
  }

  handleDirtyTwiglet(commitModal: CommitModalComponent, userId): Observable<boolean> {
    let commitMessage = false;
    return commitModal.observable.first().flatMap(formResult => {
      if (formResult.commit) {
        commitMessage = true;
        this.stateService.userState.startSpinner();
        return this.stateService.twiglet.saveChanges(formResult.commit, userId);
      }
      return Observable.of({});
    })
    .flatMap(() => {
      if (commitMessage) {
        this.stateService.userState.stopSpinner();
        commitModal.dismissModal();
        return this.proceedWithRoute();
      }
      return Observable.of(false);
    });
  }

  handleDirtyTwigletModel(commitModal: CommitModalComponent): Observable<boolean> {
    let commitMessage = false;
    return commitModal.observable.first().flatMap(formResult => {
      if (formResult.commit) {
        commitMessage = true;
        this.stateService.userState.startSpinner();
        return this.stateService.twiglet.modelService.saveChanges();
      }
      return Observable.of({});
    })
    .flatMap(() => {
      if (commitMessage) {
        this.stateService.userState.stopSpinner();
        commitModal.dismissModal();
        return this.proceedWithRoute();
      }
      return Observable.of(false);
    });
  }

  handleDirtyModel(commitModal: CommitModalComponent): Observable<boolean> {
    let commitMessage = false;
    return commitModal.observable.first().flatMap(formResult => {
      if (formResult.commit) {
        commitMessage = true;
        this.stateService.userState.startSpinner();
        return this.stateService.model.saveChanges(formResult.commit);
      }
      return Observable.of({});
    })
    .flatMap(() => {
      if (commitMessage) {
        this.stateService.userState.stopSpinner();
        commitModal.dismissModal();
        return this.proceedWithRoute();
      }
      return Observable.of(false);
    })
    .catch(handleError.bind(this));
  }

  proceedWithRoute(): Observable<boolean> {
    this.stateService.model.restoreBackup();
    this.stateService.userState.setEditing(false);
    return Observable.of(true);
  }
}
