import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as validUrl from 'valid-url';

import { D3Node } from '../../../non-angular/interfaces';
import { StateService } from './../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
})
export class NodeInfoComponent {
  @Input() node: D3Node;

  constructor(public stateService: StateService) {}

  addAttributeFilter(attribute) {
    this.stateService.twiglet.viewService.setFilter([{
      attributes: [{
        key: attribute.key,
        value: ''
      }],
      type: ''
    }]);
  }

  addTypeFilter(type) {
    this.stateService.twiglet.viewService.setFilter([{
      attributes: [{
        key: '',
        value: ''
      }],
      type
    }]);
  }

  validUrl(url) {
    return validUrl.isUri(url);
  }
}
