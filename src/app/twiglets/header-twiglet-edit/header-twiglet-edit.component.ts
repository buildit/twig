import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { CommitModalComponent } from '../../shared/commit-modal/commit-modal.component';
import { D3Node, ModelEntity, UserState } from '../../../non-angular/interfaces';
import { StateService } from '../../state.service';
import { Twiglet } from './../../../non-angular/interfaces/twiglet';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-twiglet-edit',
  styleUrls: ['./header-twiglet-edit.component.scss'],
  templateUrl: './header-twiglet-edit.component.html',
})
export class HeaderTwigletEditComponent implements OnInit {
  @Input() userState;
  @Input() twiglet;
  @Input() twigletModel;
  @Input() twiglets;

  constructor(public modalService: NgbModal, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

}
