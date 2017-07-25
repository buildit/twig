import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from './../../state.service';

@Component({
  selector: 'app-views-save-modal',
  styleUrls: ['./views-save-modal.component.scss'],
  templateUrl: './views-save-modal.component.html',
})
export class ViewsSaveModalComponent implements OnInit, OnDestroy {
  // This modal is used to either create a new view or update an existing view. It defaults to blank name, description, etc
  // but receives initial input if a view is getting updated.
  viewUrl: string;
  originalName = '';
  name = '';
  description = '';
  formErrors = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'A name is required.',
      slash: '/, ? characters are not allowed.',
      unique: 'Name already taken.'
    },
  };
  twigletName;
  routeSubscription;
  views;
  viewNames;

  constructor(private stateService: StateService, public activeModal: NgbActiveModal,
    public router: Router, public route: ActivatedRoute) {
    this.routeSubscription = this.route.firstChild.params.subscribe(params => {
      this.twigletName = params.name;
    });
  }

  setup(viewUrl?, name?, description?) {
    this.viewUrl = viewUrl;
    this.originalName = name;
    this.name = name;
    this.description = description;
  }

  ngOnInit() {
    this.viewNames = this.views.toJS().map(view => view.name);
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  afterSave() {
    this.stateService.userState.stopSpinner();
    this.activeModal.close();
    this.stateService.userState.setCurrentView(this.name);
    this.router.navigate(['twiglet', this.twigletName, 'view', this.name]);
  }

  validateUniqueName(name) {
    if (this.viewNames.includes(name)) {
      return false;
    }
    return true;
  }

  processForm() {
    const isUnique = this.validateUniqueName(this.name);
    if (this.name.includes('/') || this.name.includes('?')) {
      this.formErrors['name'] = this.validationMessages.name['slash'] + ' ';
    }
    if (!isUnique) {
      this.formErrors['name'] = this.validationMessages.name['unique'] + ' ';
    }
    if (this.name.length && !this.name.includes('/') && !this.name.includes('?') && isUnique) {
      if (this.viewUrl) {
        this.stateService.userState.startSpinner();
        this.stateService.twiglet.viewService.saveView(this.viewUrl, this.name, this.description)
        .subscribe(response => {
          this.afterSave();
        });
      } else {
        this.stateService.userState.startSpinner();
        this.stateService.twiglet.viewService.createView(this.name, this.description)
        .subscribe(response => {
          this.afterSave();
        });
      }
    }
    if (!this.name.length) {
      this.formErrors['name'] = this.validationMessages.name['required'] + ' ';
    }
  }

}
