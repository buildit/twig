import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs';
import { clone } from 'ramda';

import { StateService } from '../state.service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';
import { D3Node, ModelEntity, UserState } from '../../non-angular/interfaces';
import { getColorFor, getNodeImage } from '../twiglet-graph/nodeAttributesToDOMAttributes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-edit',
  styleUrls: ['./header-edit.component.scss'],
  templateUrl: './header-edit.component.html',
})
export class HeaderEditComponent implements OnInit {
  userState: UserState;
  subscription: Subscription;
  nodes: {};
  newNodes: {};
  nodesArray: D3Node[] = [];

  private model = { entities: {} };

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    this.stateService.twiglet.modelService.observable.subscribe(response => {
      this.model = response.toJS();
      this.cd.markForCheck();
    });
    this.stateService.userState.observable.subscribe(response => {
      userStateServiceResponseToObject.bind(this)(response);
      this.cd.markForCheck();
    });
  }

  ngOnInit() {

  }

  discardChanges() {
    // let newArray = [];
    // for (let node in this.nodes) {
    //   newArray.push(this.nodes[node]);
    // }
    // console.log(this.nodesArray);
    // this.nodesArray = newArray;
    // console.log(this.nodesArray);
    // this.stateService.twiglet.addNodes(this.nodesArray);
    this.stateService.twiglet.loadTwiglet(this.userState.currentTwigletId, this.userState.currentTwigletName);
    this.stateService.userState.setEditing(false);
    console.log(this.nodes);
  }

  startEditing() {
    let currentNodes = {};
    this.subscription = this.stateService.twiglet.observable.subscribe(response => {
      currentNodes = response.toJS().nodes;
    });
    this.nodes = clone(currentNodes);
  }

  saveTwiglet() {
    this.subscription = this.stateService.twiglet.observable.subscribe(response => {
      this.newNodes = response.toJS().nodes;
    });
    if (this.newNodes !== this.nodes) {
      console.log('something is different...');
    }
  }

}
