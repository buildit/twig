import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

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

  private model = { entities: {} };

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
    stateService.twiglet.modelService.observable.subscribe(response => {
      this.model = response.toJS();
      this.cd.markForCheck();
    });
  }

  ngOnInit() {

  }

}
