import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

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
  keys: Array<string>;
  form: FormArray;

  constructor(private stateService: StateService, public fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    const nodes = this.twiglet.get('nodes');
    const tempTypes = {};
    const tempKeys = {};
    nodes.forEach((node: Map<string, any>) => {
      const type = node.get('type');
      if (!tempTypes[type]) {
        tempTypes[type] = true;
      }
      const attributes = node.get('attrs');
      attributes.forEach((attribute: Map<string, any>) => {
        const key = attribute.get('key');
        if (!tempKeys[key]) {
          tempKeys[key] = true;
        }
      });
    });
    this.types = Reflect.ownKeys(tempTypes) as Array<string>;
    this.keys = Reflect.ownKeys(tempKeys) as Array<string>;
    this.cd.markForCheck();
  }

  values(attributeFormControl: FormControl) {
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
