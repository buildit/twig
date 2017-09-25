import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from './../../state.service';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';
import VIEW_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-dropdown',
  styleUrls: ['./view-dropdown.component.scss'],
  templateUrl: './view-dropdown.component.html',
})
export class ViewDropdownComponent implements OnInit {
  @Input() userState: Map<string, any>;
  @Input() twiglet;
  @Input() views;
  @Input() viewData;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW = VIEW_CONSTANTS;

  constructor(private stateService: StateService, public modalService: NgbModal, private router: Router ) { }

  ngOnInit() {
  }

  loadView(name) {
    this.stateService.userState.setCurrentView(name);
    this.router.navigate(['/twiglet', this.twiglet.get(this.TWIGLET.NAME), 'view', name]);
  }

}
