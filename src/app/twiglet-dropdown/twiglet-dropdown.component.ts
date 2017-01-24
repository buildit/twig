import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { StateService } from '../state.service';
import { TwigletModalComponent } from '../twiglet-modal/twiglet-modal.component';

@Component({
  selector: 'app-twiglet-dropdown',
  styleUrls: ['./twiglet-dropdown.component.scss'],
  templateUrl: './twiglet-dropdown.component.html',
})
export class TwigletDropdownComponent {
  twiglets: string[];

  constructor(private stateService: StateService, private modalService: NgbModal,   private router: Router) {
    this.stateService.backendService.observable.subscribe(response => {
      this.twiglets = response.get('twiglets').toJS();
    });
  }

  loadTwiglet(id: string) {
    this.router.navigate(['/twiglet', id]);
  }

  openNewModal() {
    const modelRef = this.modalService.open(TwigletModalComponent);
  }

}
