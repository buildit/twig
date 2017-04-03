import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { List, Map } from 'immutable';

import { StateService } from './../../state.service';
import { UserState } from './../../../non-angular/interfaces/userState/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-filters',
  styleUrls: ['./twiglet-filters.component.scss'],
  templateUrl: './twiglet-filters.component.html',
})
export class TwigletFiltersComponent implements OnInit, OnChanges {

  @Input() userState: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  types: Array<string>;
  form: FormArray;

  constructor(private stateService: StateService, public fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    const nodes = this.twiglet.get('nodes');
    const tempTypes = {};
    const tempKeys = {};
    nodes.forEach((node: Map<string, any>) => {
      const type = node.get('type');
      if (!tempTypes[type]) {
        tempTypes[type] = true;
      }
    });
    this.types = Reflect.ownKeys(tempTypes) as Array<string>;
    this.cd.markForCheck();
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

  buildForm() {
    this.form = this.fb.array([this.createFilter()]);
    this.form.valueChanges.subscribe(changes => {
      this.stateService.userState.setFilter(this.form.value);
    });
  }

  createFilter() {
    return this.fb.group({
      attributes: this.fb.array([this.createAttribute()]),
      type: '',
    });
  }

  createAttribute() {
    return this.fb.group({
      key: '',
      value: '',
    });
  }

  addTarget(i) {
    (<FormGroup>this.form.controls[i]).addControl('_target', this.createFilter());
  }

  removeTarget(i) {
    (<FormGroup>this.form.controls[i]).removeControl('_target');
  }

  addFilter() {
    this.form.push(this.createFilter());
  }

  removeFilter(index) {
    this.form.removeAt(index);
  }

  updateFilters($event) {
    this.stateService.userState.setFilter($event.target.value);
  }
}

function getKeys(nodes: Map<string, any>) {
  const keys = {};
  nodes.forEach((node: Map<string, any>) => {
    const attributes = node.get('attrs');
    attributes.forEach((attribute: Map<string, any>) => {
      const key = attribute.get('key');
      if (!keys[key]) {
        keys[key] = true;
      }
    }, keys);
  });
  return Reflect.ownKeys(keys) as Array<string>;
}
