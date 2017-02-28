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
  @Input() userState: Map<string, any>;
  @Input() twiglet;
  @Input() views;

  constructor(private stateService: StateService, private modalService: NgbModal, private toastr: ToastsManager) { }

  ngOnInit() {
    console.log(this.views.toJS());
  }

}
