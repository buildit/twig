import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/platform-browser';
import { PageScrollConfig, PageScrollService, PageScrollInstance} from 'ng2-page-scroll';
import { clone } from 'ramda';

import { StateService } from '../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';
import { D3Node, ModelEntity, UserState } from '../../non-angular/interfaces';
import { getColorFor, getNodeImage } from '../twiglet-graph/nodeAttributesToDOMAttributes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-right-side-bar',
  styleUrls: ['./right-side-bar.component.css'],
  templateUrl: './right-side-bar.component.html',
})
export class RightSideBarComponent {

  private model: { [key: string]: ModelEntity };
  private userState: UserState = {
    currentNode: '',
  };

  constructor(private stateService: StateService,
              private self: ElementRef,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: Document,
              private cd: ChangeDetectorRef) {
    PageScrollConfig.defaultDuration = 0;
    stateService.twiglet.model.observable.subscribe(response => {
      this.model = response.toJS();
      this.cd.markForCheck();
    });
    stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      // For the accordion, it doesn't like null.
      if (!this.userState.currentNode) {
        this.userState.currentNode = '';
      }
      this.cd.markForCheck();
      this.scrollInsideToActiveNode();
    });
  }

  scrollInsideToActiveNode() {
    if (this.userState.currentNode.length > 0) {
      const pageScrollInstance: PageScrollInstance =
          PageScrollInstance.simpleInlineInstance(this.document, `#${this.userState.currentNode}-header`,
          this.self.nativeElement);
      this.pageScrollService.start(pageScrollInstance);
    }
  }

  getColorFor(d3Node: D3Node) {
    return getColorFor.bind(this)(d3Node);
  }

  getNodeImage(d3Node: D3Node) {
    return getNodeImage.bind(this)(d3Node);
  }

  public beforeChange($event: NgbPanelChangeEvent) {
    if ($event.nextState) {
      this.stateService.userState.setCurrentNode($event.panelId);
    } else {
      this.stateService.userState.clearCurrentNode();
    }
  };
}
