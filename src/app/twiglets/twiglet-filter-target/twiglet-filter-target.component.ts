import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-filter-target',
  styleUrls: ['./twiglet-filter-target.component.scss'],
  templateUrl: './twiglet-filter-target.component.html',
})
export class TwigletFilterTargetComponent implements OnInit {
  @Input() targetControl: FormGroup;
  @Input() twiglet: Map<string, any>;
  @Input() keys: Array<string>;
  @Input() types: Array<string>;

  constructor() {
  }

  ngOnInit() {

  }

  values(attributeFormControl: FormGroup) {
    const currentKey = attributeFormControl.value.key;
    if (!currentKey) {
      return [];
    }
    const valuesObject = {};
    this.twiglet.get('nodes').forEach(node => {
      const attributes = node.get('attrs');
      attributes.forEach(attribute => {
        if (attribute.get('key') === currentKey) {
          const value = attribute.get('value');
          if (!valuesObject[value]) {
            valuesObject[value] = true;
          }
        }
      });
    });
    return Reflect.ownKeys(valuesObject);
  }
}
