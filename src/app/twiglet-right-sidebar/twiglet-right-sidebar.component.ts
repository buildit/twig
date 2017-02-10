import { Map } from 'immutable';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/platform-browser';
import { PageScrollConfig, PageScrollService, PageScrollInstance} from 'ng2-page-scroll';
import { clone } from 'ramda';

import { StateService } from '../state.service';
import { D3Node, ModelEntity, UserState } from '../../non-angular/interfaces';
import { getColorFor, getNodeImage } from '../twiglet-graph/nodeAttributesToDOMAttributes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-right-sidebar',
  styleUrls: ['./twiglet-right-sidebar.component.scss'],
  templateUrl: './twiglet-right-sidebar.component.html',
})
export class TwigletRightSideBarComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() twigletModel: Map<string, any>;
  @Input() userState: Map<string, any> =  Map({
    currentNode: '',
  });
  @Input() twiglet: Map<string, any>;

  constructor(private stateService: StateService,
              private elementRef: ElementRef,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: Document,
              private cd: ChangeDetectorRef) {
    PageScrollConfig.defaultDuration = 250;
  }

  ngOnInit() {
    if (!this.userState.get('currentNode')) {
      this.userState = this.userState.set('currentNode', '');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.userState.get('currentNode')) {
      this.userState = this.userState.set('currentNode', '');
    }
  }

  ngAfterViewChecked() {
    this.scrollInsideToActiveNode();
  }

  scrollInsideToActiveNode() {
    if (this.userState.get('currentNode').length > 0) {
      const pageScrollInstance: PageScrollInstance =
          PageScrollInstance.simpleInlineInstance(this.document, `#${this.userState.get('currentNode')}-header`,
          this.elementRef.nativeElement.querySelector('div.overflow-scroll'));
      this.pageScrollService.start(pageScrollInstance);
    }
  }

  getColorFor(d3Node: D3Node) {
    return this.twigletModel.get('entities').get(d3Node.type).get('color');
  }

  getNodeImage(d3Node: D3Node) {
    return this.twigletModel.get('entities').get(d3Node.type).get('image');
  }

  beforeChange($event: NgbPanelChangeEvent) {
    if ($event.nextState) {
      this.stateService.userState.setCurrentNode($event.panelId);
    } else {
      this.stateService.userState.clearCurrentNode();
    }
  };
}
