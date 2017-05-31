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
import { DOCUMENT } from '@angular/platform-browser';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { clone } from 'ramda';

import { D3Node, ModelEntity, UserState } from '../../../non-angular/interfaces';
import { FilterByObjectPipe } from './../../shared/pipes/filter-by-object.pipe';
import { StateService } from '../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-node-list',
  styleUrls: ['./twiglet-node-list.component.scss'],
  templateUrl: './twiglet-node-list.component.html',
})
export class TwigletNodeListComponent implements OnChanges, OnInit {

  @Input() twigletModel: Map<string, any> = Map({});
  @Input() userState = fromJS({});
  @Input() twiglet: Map<string, any> = Map({});
  nodesArray = [];


  constructor(public stateService: StateService,
              private elementRef: ElementRef,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (!this.userState.get('currentNode')) {
      this.userState = this.userState.set('currentNode', '');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // The twiglet was updated in some way.
    const twigletChanges = changes.twiglet && changes.twiglet.currentValue !== changes.twiglet.previousValue;
    // The filters were updated.
    const userPrevious = changes.userState && Map.isMap(changes.userState.previousValue) ? changes.userState.previousValue : undefined;
    const userCurrent = changes.userState ? changes.userState.currentValue : undefined;
    const filterChanges = userPrevious && userCurrent && !userCurrent.get('filters').equals(userPrevious.get('filters'));
    if (twigletChanges || filterChanges) {
      const nodesAsJsArray = [];
      const nodesObject = this.twiglet.get('nodes').reduce((object, node) => {
        nodesAsJsArray.push(node.toJS());
        const type = node.get('type');
        if (!object[type]) {
          object[type] = [];
        }
        return object;
      }, {});
      const filteredNodes = new FilterByObjectPipe().transform(nodesAsJsArray, this.twiglet.get('links'), this.userState.get('filters'));
      filteredNodes.forEach(node => {
        nodesObject[node.type].push(node);
      });
      this.nodesArray = Reflect.ownKeys(nodesObject).map(type =>
        [this.getTypeInfo(type), nodesObject[type]]
      ).sort((a, b) => a[0].type > b[0].type ? 1 : -1);
      this.cd.markForCheck();
    }
  }

  getTypeInfo(type) {
    const entity = this.twigletModel.getIn(['entities', type]);
    return {
      type,
      color: entity ? entity.get('color') : '#000000',
      icon: entity ? entity.get('class') : 'question-circle',
    };
  }
}
