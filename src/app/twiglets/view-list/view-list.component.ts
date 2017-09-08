import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';

import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
import { StateService } from '../../state.service';
import { UserState } from '../../../non-angular/interfaces';
import { ViewsSaveModalComponent } from './../views-save-modal/views-save-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-list',
  styleUrls: ['./view-list.component.scss'],
  templateUrl: './view-list.component.html',
})
export class ViewListComponent {
  @Input() views;
  @Input() twiglet;
  @Input() userState: Map<string, any>;

  constructor(private stateService: StateService, public modalService: NgbModal, private router: Router ) { }

  loadView(name) {
    this.stateService.userState.setCurrentView(name);
    this.router.navigate(['/twiglet', this.twiglet.get('name'), 'view', name]);
  }

  newView() {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.views = this.views;
    component.twigletName = this.twiglet.get('name');
  }

  editView(view) {
    const modelRef = this.modalService.open(ViewsSaveModalComponent);
    const component = <ViewsSaveModalComponent>modelRef.componentInstance;
    component.setup(view.get('url'), view.get('name'), view.get('description'));
    component.views = this.views;
    component.twigletName = this.twiglet.get('name');
  }

  deleteView(view) {
    const modelRef = this.modalService.open(DeleteViewConfirmationComponent);
    const component = <DeleteViewConfirmationComponent>modelRef.componentInstance;
    component.setup(view, this.twiglet, this.userState);
  }

}
