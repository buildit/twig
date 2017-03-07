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
  OnDestroy,
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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-right-sidebar',
  styleUrls: ['./twiglet-right-sidebar.component.scss'],
  templateUrl: './twiglet-right-sidebar.component.html',
})
export class TwigletRightSideBarComponent implements OnChanges, OnInit {

  @Input() twigletModel: Map<string, any>;
  @Input() userState;
  @Input() twiglet: Map<string, any>;
  currentNode = '';

  types = [];
  typesShown = [];

  constructor(private stateService: StateService,
              private elementRef: ElementRef,
              private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any,
              private cd: ChangeDetectorRef) {
    PageScrollConfig.defaultDuration = 250;
  }

  ngOnInit() {
    if (!this.userState.get('currentNode')) {
      this.userState = this.userState.set('currentNode', '');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentNode !== this.userState.get('currentNode')) {
      if (this.userState.get('currentNode')) {
        this.currentNode = this.userState.get('currentNode');
        this.cd.markForCheck();
        this.scrollInsideToActiveNode();
      } else {
        this.currentNode = '';
        this.userState.set('currentNode', '');
      }
    }
    const typeObject = {};
    this.twiglet.get('nodes').map(node => {
      if (typeObject[`${node.get('type')}`]) {
        typeObject[`${node.get('type')}`].nodesLength++;
      } else {
        typeObject[`${node.get('type')}`] = {
          nodesLength: 1,
          type: node.get('type'),
        };
      }
    });
    this.types = Object.keys(typeObject).map(key => typeObject[key]);
  }

  showNodes(type) {
    if (this.typesShown.indexOf(type) >= 0) {
      const index = this.typesShown.indexOf(type);
      this.typesShown.splice(index, 1);
    } else {
      this.typesShown.push(type);
    }
  }

  scrollInsideToActiveNode() {
    if (this.userState.get('currentNode').size > 0 && !this.userState.get('currentNode').startsWith('ngb-panel')) {
      if (this.typesShown.indexOf(this.twiglet.get('nodes').get(this.userState.get('currentNode')).get('type')) < 0) {
        this.typesShown.push(this.twiglet.get('nodes').get(this.userState.get('currentNode')).get('type'));
      }
      const pageScrollInstance: PageScrollInstance =
          PageScrollInstance.simpleInlineInstance(this.document, `#${this.userState.get('currentNode')}-header`,
          this.elementRef.nativeElement.querySelector('div.overflow-scroll'));
      this.pageScrollService.start(pageScrollInstance);
    }
  }

  getColorFor(d3Node: D3Node) {
    return this.twigletModel.get('entities').get(d3Node.type).get('color');
  }

  getColorForType(type) {
    return this.twigletModel.get('entities').get(type).get('color');
  }

  getNodeImage(d3Node: D3Node) {
    return this.twigletModel.get('entities').get(d3Node.type).get('image');
  }

  getTypeImage(type) {
    return this.twigletModel.get('entities').get(type).get('image');
  }

  beforeChange($event: NgbPanelChangeEvent) {
    if ($event.nextState) {
      this.stateService.userState.setCurrentNode($event.panelId);
    } else {
      this.stateService.userState.clearCurrentNode();
    }
  };
}