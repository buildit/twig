import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-font-awesome-toggle-button',
  styleUrls: ['./font-awesome-toggle-button.component.scss'],
  templateUrl: './font-awesome-toggle-button.component.html',
})
export class FontAwesomeToggleButtonComponent implements OnInit {
  /**
   * The font-awesome icon to use, this would be part after fa-{whatever}
   *
   * @type {string}
   * @memberOf FontAwesomeToggleButtonComponent
   */
  @Input() icon: string;
  /**
   * What part of the state service the button should be basing it's toggle state on.
   * Uses a "/" to denote the service/param to check. For example, twiglet.model/entities.nodes
   * would subscribe to the stateService.twiglet.model and check the entities.nodes for truthiness.
   *
   * @type {string}
   * @memberOf FontAwesomeToggleButtonComponent
   */
  @Input() checkedString: string;
  /**
   * The action to take when the button is toggled. It will automatically pass in it's own "checked"
   * state (a bool) to the function it gets. Action strings may take the form of something like
   * "userState.setShowNodeLabels"
   *
   * @type {string}
   * @memberOf FontAwesomeToggleButtonComponent
   */
  @Input() actionString: string;
  private checked: { data?: any } = {};
  private action: (bool: boolean) => void;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const accessor = this.checkedString.split('/');
    const service: { observable: Observable<Map<string, any>>} = accessor[0].split('.').reduce(
      (o: { [key: string]: any}, property: string) => {
        return o[property];
      }, this.stateService);
    service.observable.subscribe(response => {
      const checked = accessor[1].split('.').reduce(
        (value: Map<string, any>, property: string) => {
          return value.get(property);
        }, response);
      this.checked = { data: checked };
      this.cd.markForCheck();
    });

    const actionSubFunction = this.actionString.split('.').reduce((obj, property: string) => {
      const returner = obj[property];
      if (typeof returner === 'function') {
        return returner.bind(obj);
      }
      return returner;
    }, this.stateService);
    this.action = (bool: boolean) => {
      actionSubFunction(bool);
    };
  }
}
