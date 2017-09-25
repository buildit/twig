import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { StateService } from '../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toggle-button',
  styleUrls: ['./toggle-button.component.scss'],
  templateUrl: './toggle-button.component.html',
})
export class ToggleButtonComponent implements OnInit {
  /**
   * What part of the state service the button should be basing it's toggle state on.
   * Uses a "/" to denote the service/param to check. For example, twiglet.model/entities.nodes
   * would subscribe to the stateService.twiglet.model and check the entities.nodes for truthiness.
   *
   * @type {string}
   * @memberOf ToggleButtonComponent
   */
  @Input() checkedBool: boolean;
  /**
   * The action to take when the button is toggled. It will automatically pass in it's own "checked"
   * state (a bool) to the function it gets. Action strings may take the form of something like
   * "userState.setShowNodeLabels"
   *
   * @type {string}
   * @memberOf ToggleButtonComponent
   */
  @Input() actionString: string;
  /**
   * The value being toggled.
   *
   * @type {string}
   * @memberOf ToggleButtonComponent
   */
  @Input() label: string;
  action: (bool: boolean) => void;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const actionSubFunction = this.actionString.split('.').reduce((obj, property: string) => {
      const returner = obj[property];

      if (typeof returner === 'function') {
        return returner.bind(obj);
      }
      return returner;
    }, this.stateService as any);
    this.action = (bool: boolean) => {
      if (this.label === 'linkType') {
        if (bool === true) {
          actionSubFunction('line');
        } else {
          actionSubFunction('path');
        }
      } else {
        actionSubFunction(bool);
      }
    };
  }
}
