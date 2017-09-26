import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import ATTRIBUTE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/attribute';
import NODE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/node';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-filter-target',
  styleUrls: ['./twiglet-filter-target.component.scss'],
  templateUrl: './twiglet-filter-target.component.html',
})
export class TwigletFilterTargetComponent {
  @Input() targetControl: FormGroup;
  @Input() twiglet: Map<string, any>;
  @Input() types: Array<string>;
  ATTRIBUTE = ATTRIBUTE_CONSTANTS;
  NODE = NODE_CONSTANTS;
  TWIGLET = TWIGLET_CONSTANTS;

  constructor() {
  }

  keys(attributeFormControl: FormGroup) {
    if (attributeFormControl.value.type) {
      return getKeys(this.twiglet.get(this.TWIGLET.NODES).filter((node: Map<string, any>) =>
        node.get(this.NODE.TYPE) === attributeFormControl.value.type
      ));
    }
    return getKeys(this.twiglet.get(this.TWIGLET.NODES));
  }

  values(attributeFormControl: FormGroup) {
    const currentKey = attributeFormControl.value.key;
    if (!currentKey) {
      return [];
    }
    const valuesObject = {};
    this.twiglet.get(this.TWIGLET.NODES).forEach(node => {
      const attributes = node.get(this.NODE.ATTRS) || [];
      attributes.forEach(attribute => {
        if (attribute.get(this.ATTRIBUTE.KEY) === currentKey) {
          const value = attribute.get(this.ATTRIBUTE.VALUE);
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
    const attributes = node.get(NODE_CONSTANTS.ATTRS) || [];
    attributes.forEach((attribute: Map<string, any>) => {
      const key = attribute.get(ATTRIBUTE_CONSTANTS.KEY);
      if (!keys[key]) {
        keys[key] = true;
      }
    }, keys);
  });
  return Reflect.ownKeys(keys) as Array<string>;
}
