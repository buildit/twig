import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as validUrl from 'valid-url';

import { D3Node } from '../../../non-angular/interfaces';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-node-info',
  styleUrls: ['./node-info.component.scss'],
  templateUrl: './node-info.component.html',
})
export class NodeInfoComponent {
  @Input() node: D3Node;

  constructor(private stateService: StateService) {}

  addAttributeFilter(attribute) {
    // this.stateService.userState.addAttributeFilter(attribute.key, attribute.value);
  }

  addTypeFilter(type) {
    // this.stateService.userState.addTypeFilter(type);
  }

  validUrl(url) {
    return validUrl.isUri(url);
  }
}
