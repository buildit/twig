import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { List, Map } from 'immutable';

import { AboutTwigletModalComponent } from './../about-twiglet-modal/about-twiglet-modal.component';
import { ChangelogListComponent } from './../../shared/changelog-list/changelog-list.component';
import { StateService } from '../../state.service';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-details',
  styleUrls: ['./twiglet-details.component.scss'],
  templateUrl: './twiglet-details.component.html'
})
export class TwigletDetailsComponent {
  @Input() twiglet: Map<string, any>;
  @Input() userState;
  twigletChangelog: List<Map<string, any>> = List([]);
  TWIGLET = TWIGLET_CONSTANTS;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef, public modalService: NgbModal) {
    stateService.twiglet.changeLogService.observable.subscribe(changelog => {
      this.twigletChangelog = changelog;
      this.cd.markForCheck();
    });
  }

  openAbout(twigletName, twigletDescription) {
    const modelRef = this.modalService.open(AboutTwigletModalComponent, { size: 'lg' });
    const component = <AboutTwigletModalComponent>modelRef.componentInstance;
    component.twigletName = twigletName;
    component.description = twigletDescription;
    component.currentTwiglet = this.twiglet.get(this.TWIGLET.NAME);
    component.userState = this.userState;
  }

  openChangelog(twigletName) {
    const modelRef = this.modalService.open(ChangelogListComponent, { size: 'lg' });
    const component = <ChangelogListComponent>modelRef.componentInstance;
    component.changelog = this.twigletChangelog;
  }

}
