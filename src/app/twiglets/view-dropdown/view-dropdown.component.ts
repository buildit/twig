import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';

@Component({
  selector: 'app-view-dropdown',
  styleUrls: ['./view-dropdown.component.scss'],
  templateUrl: './view-dropdown.component.html',
})
export class ViewDropdownComponent implements OnInit {
  @Input() views;
  @Input() twiglet;
  @Input() userState;

  constructor(private stateService: StateService, public modalService: NgbModal, private router: Router ) { }

  ngOnInit() {  }

  loadView(name) {
    this.stateService.userState.setCurrentView(name);
    this.router.navigate(['/twiglet', this.twiglet.get('name'), 'view', name]);
  }

  newView() {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.views = this.views;
  }

  editView(view) {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.setup(view.get('url'), view.get('name'), view.get('description'));
    component.views = this.views;
  }

  deleteView(view) {
    const modelRef = this.modalService.open(DeleteViewConfirmationComponent);
    const component = <DeleteViewConfirmationComponent>modelRef.componentInstance;
    component.setup(view, this.twiglet, this.userState);
  }


}
