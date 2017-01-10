import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-slider-with-label',
  styleUrls: ['./slider-with-label.component.scss'],
  templateUrl: './slider-with-label.component.html',
})
export class SliderWithLabelComponent implements OnInit {

  @Input() label: string;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() disabled: boolean;
  @Input() valueString: string;
  @Input() actionString: string;
  value: { data: number };
  action: (number: number) => void;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const accessor = this.valueString.split('/');
    const service: { observable: Observable<Map<string, any>>} = accessor[0].split('.').reduce(
      (o: { [key: string]: any}, property: string) => {
        return o[property];
      }, this.stateService);
    service.observable.subscribe(response => {
      const value = accessor[1].split('.').reduce(
        (localValue: Map<string, any>, property: string) => {
          return localValue.get(property);
        }, response);
      this.value = { data: value };
      this.cd.markForCheck();
    });

    const actionSubFunction = this.actionString.split('.').reduce((obj, property: string) => {
      const returner = obj[property];
      if (typeof returner === 'function') {
        return returner.bind(obj);
      }
      return returner;
    }, this.stateService);
    this.action = (number: number) => {
      actionSubFunction(number);
    };
  }

}
