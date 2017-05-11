import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-filter-target',
  styleUrls: ['./twiglet-filter-target.component.scss'],
  templateUrl: './twiglet-filter-target.component.html',
})
export class TwigletFilterTargetComponent implements OnInit {
  @Input() targetControl: FormGroup;
  @Input() twiglet: Map<string, any>;
  @Input() types: Array<string>;

  constructor() {
  }

  ngOnInit() {

  }

  keys(attributeFormControl: FormGroup) {
    if (attributeFormControl.value.type) {
      return getKeys(this.twiglet.get('nodes').filter((node: Map<string, any>) =>
        node.get('type') === attributeFormControl.value.type
      ));
    }
    return getKeys(this.twiglet.get('nodes'));
  }


  values(attributeFormControl: FormGroup) {
    const currentKey = attributeFormControl.value.key;
    if (!currentKey) {
      return [];
    }
    const valuesObject = {};
    this.twiglet.get('nodes').forEach(node => {
      const attributes = node.get('attrs') || [];
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

function getKeys(nodes: Map<string, any>) {
  const keys = {};
  nodes.forEach((node: Map<string, any>) => {
    const attributes = node.get('attrs') || [];
    attributes.forEach((attribute: Map<string, any>) => {
      const key = attribute.get('key');
      if (!keys[key]) {
        keys[key] = true;
      }
    }, keys);
  });
  return Reflect.ownKeys(keys) as Array<string>;
}
