import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from './../../state.service';

@Component({
  selector: 'app-views-save-modal',
  styleUrls: ['./views-save-modal.component.scss'],
  templateUrl: './views-save-modal.component.html',
})
export class ViewsSaveModalComponent implements OnInit {
  viewUrl: string;
  originalName = '';
  name = '';
  description = '';

  constructor(private stateService: StateService, private activeModal: NgbActiveModal) {
  }

  setup(viewUrl?, name?, description?) {
    this.viewUrl = viewUrl;
    this.originalName = name;
    this.name = name;
    this.description = description;
  }

  ngOnInit() {
  }

  action() {
    if (this.viewUrl) {
      this.stateService.twiglet.viewService.saveView(this.viewUrl, this.name, this.description)
      .subscribe(response => {
        this.activeModal.close();
      });
    } else {
      this.stateService.twiglet.viewService.createView(this.name, this.description)
      .subscribe(response => {
        this.activeModal.close();
      });
    }
  }

}
