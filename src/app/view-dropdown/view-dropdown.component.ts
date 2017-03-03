import { Router } from '@angular/router';
import { DeleteViewConfirmationComponent } from './../delete-confirmation/delete-view-confirmation.component';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';
import { Component, OnInit, Input } from '@angular/core';
import { Map, OrderedMap } from 'immutable';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { StateService } from '../state.service';
import { UserState } from '../../non-angular/interfaces';

@Component({
  selector: 'app-view-dropdown',
  styleUrls: ['./view-dropdown.component.scss'],
  templateUrl: './view-dropdown.component.html',
})
export class ViewDropdownComponent implements OnInit {
  @Input() views;
  @Input() twiglet;

  constructor(private stateService: StateService, private modalService: NgbModal, private router: Router ) { }

  ngOnInit() {  }

  loadView(name) {
    this.router.navigate(['/twiglet', this.twiglet.get('name'), 'view', name]);
  }

  newView() {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
  }

  editView(view) {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.setup(view.get('url'), view.get('name'), view.get('description'));
  }

  deleteView(view) {
    const modelRef = this.modalService.open(DeleteViewConfirmationComponent);
    const component = <DeleteViewConfirmationComponent>modelRef.componentInstance;
    component.setup(view);
  }


}
