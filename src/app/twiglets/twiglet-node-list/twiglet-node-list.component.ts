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
import { DOCUMENT } from '@angular/platform-browser';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { clone } from 'ramda';

import { D3Node, ModelEntity, UserState } from '../../../non-angular/interfaces';
import { StateService } from '../../state.service';
import NODE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/node';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-node-list',
  styleUrls: ['./twiglet-node-list.component.scss'],
  templateUrl: './twiglet-node-list.component.html',
})
export class TwigletNodeListComponent implements OnChanges, OnInit {
  @Input() twigletModel: Map<string, any> = Map({});
  @Input() userState: Map<string, any> = fromJS({});
  @Input() twiglet: Map<string, any> = Map({});
  USERSTATE = USERSTATE_CONSTANTS;
  nodesArray = [];
  nodeTypes: string[];
  NODE = NODE_CONSTANTS;
  TWIGLET = TWIGLET_CONSTANTS;

  constructor(public stateService: StateService,
              public elementRef: ElementRef,
              private cd: ChangeDetectorRef) {
    this.stateService.twiglet.nodeTypes.subscribe(nodeTypes => {
      this.nodeTypes = nodeTypes.toArray();
    });
  }

  ngOnInit() {
    if (!this.userState.get(this.USERSTATE.CURRENT_NODE)) {
      this.userState = this.userState.set(this.USERSTATE.CURRENT_NODE, '');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // The twiglet was updated in some way.
    const twigletChanges = changes.twiglet && changes.twiglet.currentValue !== changes.twiglet.previousValue;
    // The filters were updated.
    if (twigletChanges) {
      const nodesAsJsArray = [];
      const nodesObject = this.twiglet.get(this.TWIGLET.NODES).reduce((object, node) => {
        nodesAsJsArray.push(node.toJS());
        const type = node.get(this.NODE.TYPE);
        if (!object[type]) {
          object[type] = [];
        }
        return object;
      }, {});
      nodesAsJsArray.forEach(node => {
        nodesObject[node.type].push(node);
      });
      this.nodesArray = this.nodeTypes.map(type =>
        [this.getTypeInfo(type), nodesObject[type] || []]
      ).sort((a, b) => a[0].type > b[0].type ? 1 : -1);
      this.cd.markForCheck();
    }
  }

  getTypeInfo(type) {
    const entity = this.twigletModel.getIn(['entities', type]);
    return {
      color: entity ? entity.get('color') : '#000000',
      icon: entity ? entity.get('class') : 'question-circle',
      type,
    };
  }
}
