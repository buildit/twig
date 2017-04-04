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
    },
  };
  twigletName;
  routeSubscription;

  constructor(private stateService: StateService, private activeModal: NgbActiveModal,
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
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  action() {
    if (this.name.length) {
      if (this.viewUrl) {
        this.stateService.twiglet.viewService.saveView(this.viewUrl, this.name, this.description)
        .subscribe(response => {
          this.activeModal.close();
          this.router.navigate(['twiglet', this.twigletName, 'view', this.name]);
        });
      } else {
        this.stateService.twiglet.viewService.createView(this.name, this.description)
        .subscribe(response => {
          this.activeModal.close();
          this.router.navigate(['twiglet', this.twigletName, 'view', this.name]);
        });
      }
    } else {
      this.formErrors['name'] = this.validationMessages.name['required'] + ' ';
    }
  }

}
