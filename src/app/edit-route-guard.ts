import { of as observableOf, Observable } from 'rxjs';

import { catchError, first, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Component, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommitModalComponent } from './shared/commit-modal/commit-modal.component';
import { DiscardChangesModalComponent } from './shared/discard-changes-modal/discard-changes-modal.component';
import { StateService } from './state.service';
import { handleError } from '../non-angular/services-helpers/httpHelpers';

@Injectable()
export class EditRouteGuard implements CanDeactivate<Component> {
  dirtyTwiglet;
  dirtyTwigletModel;

  constructor(
    private stateService: StateService,
    public modalService: NgbModal,
    public toastr: ToastrService
  ) { }

  canDeactivate(
    component: Component,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> {
    return this.stateService.twiglet.dirty.pipe(
      first(),
      mergeMap(dirtyTwiglet => {
        return this.stateService.twiglet.modelService.dirty.pipe(
          first(),
          mergeMap(dirtyTwigletModel => {
            return this.stateService.model.dirty.pipe(
              first(),
              mergeMap(dirtyModel => {
                if (dirtyTwiglet || dirtyTwigletModel || dirtyModel) {
                  const modelRef = this.modalService.open(
                    DiscardChangesModalComponent
                  );
                  const discardModal = modelRef.componentInstance as DiscardChangesModalComponent;
                  return discardModal.observable.pipe(
                    first(),
                    mergeMap(result => {
                      if (result.saveChanges) {
                        const modalRef = this.modalService.open(
                          CommitModalComponent
                        );
                        const commitModal = modalRef.componentInstance as CommitModalComponent;
                        if (dirtyTwiglet) {
                          return this.stateService.userState.observable.pipe(
                            first(),
                            mergeMap(user => {
                              const userId = user.toJS().user.user.id;
                              return this.handleDirtyTwiglet(
                                commitModal,
                                userId
                              );
                            })
                          );
                        } else if (dirtyModel) {
                          return this.handleDirtyModel(commitModal);
                        } else if (dirtyTwigletModel) {
                          return this.handleDirtyTwigletModel(commitModal);
                        }
                      }
                      return observableOf(false);
                    })
                  );
                }
                return this.proceedWithRoute();
              })
            );
          })
        );
      })
    );
  }

  handleDirtyTwiglet(
    commitModal: CommitModalComponent,
    userId
  ): Observable<boolean> {
    let commitMessage = false;
    return commitModal.observable.pipe(
      first(),
      mergeMap(formResult => {
        if (formResult.commit) {
          commitMessage = true;
          this.stateService.userState.startSpinner();
          return this.stateService.twiglet.saveChanges(
            formResult.commit,
            userId
          );
        }
        return observableOf({});
      }),
      mergeMap(() => {
        if (commitMessage) {
          this.stateService.userState.stopSpinner();
          commitModal.dismissModal();
          return this.proceedWithRoute();
        }
        return observableOf(false);
      })
    );
  }

  handleDirtyTwigletModel(
    commitModal: CommitModalComponent
  ): Observable<boolean> {
    let commitMessage = false;
    return commitModal.observable.pipe(
      first(),
      mergeMap(formResult => {
        if (formResult.commit) {
          commitMessage = true;
          this.stateService.userState.startSpinner();
          return this.stateService.twiglet.modelService.saveChanges();
        }
        return observableOf({});
      }),
      mergeMap(() => {
        if (commitMessage) {
          this.stateService.userState.stopSpinner();
          commitModal.dismissModal();
          return this.proceedWithRoute();
        }
        return observableOf(false);
      })
    );
  }

  // @TODO This should be a boolean, but due to a TypeScript compile error any must be enabled
  // this.canDeactivate must be cleaned up in order to fix this typing issue
  handleDirtyModel(
    commitModal: CommitModalComponent
  ): Observable<boolean | any> {
    let commitMessage = false;
    return commitModal.observable.pipe(
      first(),
      mergeMap(formResult => {
        if (formResult.commit) {
          commitMessage = true;
          this.stateService.userState.startSpinner();
          return this.stateService.model.saveChanges(formResult.commit);
        }
        return observableOf({});
      }),
      mergeMap(() => {
        if (commitMessage) {
          this.stateService.userState.stopSpinner();
          commitModal.dismissModal();
          return this.proceedWithRoute();
        }
        return observableOf(false);
      }),
      catchError(handleError.bind(this))
    );
  }

  proceedWithRoute(): Observable<boolean> {
    this.stateService.model.restoreBackup();
    this.stateService.userState.setEditing(false);
    return observableOf(true);
  }
}
