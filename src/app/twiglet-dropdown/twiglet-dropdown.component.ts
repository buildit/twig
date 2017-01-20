import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from '../state.service';
import { TwigletModalComponent } from '../twiglet-modal/twiglet-modal.component';

@Component({
  selector: 'app-twiglet-dropdown',
  styleUrls: ['./twiglet-dropdown.component.scss'],
  templateUrl: './twiglet-dropdown.component.html',
})
export class TwigletDropdownComponent implements OnInit {
  twiglets: string[];

  constructor(private stateService: StateService, public modalService: NgbModal) { }

  ngOnInit() {
    this.stateService.getTwiglets().subscribe(response => {
      this.twiglets = response;
    });
  }

  loadTwiglet(id, name) {
    this.stateService.loadTwiglet(id, name);
  }

  openNewModal() {
    const modelRef = this.modalService.open(TwigletModalComponent);
  }

}
