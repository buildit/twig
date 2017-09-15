import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-mode-left-bar',
  styleUrls: ['./model-mode-left-bar.component.scss'],
  templateUrl: './model-mode-left-bar.component.html',
})
export class ModelModeLeftBarComponent {
  @Input() model;
  @Input() userState;
  MODEL = MODEL_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor() { }

}
