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
  @Input() icon: string;
  @Input() checkedString: string;
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
