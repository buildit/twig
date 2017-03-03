import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from './../state.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-views-save-modal',
  styleUrls: ['./views-save-modal.component.scss'],
  templateUrl: './views-save-modal.component.html',
})
export class ViewsSaveModalComponent implements OnInit {
  viewUrl: string;
  name = '';
  description = '';

  constructor(private stateService: StateService, private activeModal: NgbActiveModal) {
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
