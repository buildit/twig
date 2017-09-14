import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Map } from 'immutable';

import { D3Node, ModelEntity, UserState } from '../../../non-angular/interfaces';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-twiglet-edit',
  styleUrls: ['./header-twiglet-edit.component.scss'],
  templateUrl: './header-twiglet-edit.component.html',
})
export class HeaderTwigletEditComponent {
  @Input() userState: Map<string, any>;
  @Input() twiglet;
  @Input() twigletModel;
  @Input() twiglets;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public modalService: NgbModal, private cd: ChangeDetectorRef) {
  }

}
