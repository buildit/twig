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

  constructor(private stateService: StateService, private modalService: NgbModal, private toastr: ToastsManager) { }

  ngOnInit() {  }

  newView() {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
  }

  editView(view) {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.viewUrl = view.get('url');
    component.name = view.get('name');
    component.description = view.get('description');
  }


}
