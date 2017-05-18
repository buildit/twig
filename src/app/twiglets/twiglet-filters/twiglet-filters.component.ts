import { Subscription } from 'rxjs/Subscription';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { List, Map } from 'immutable';
import { ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { equals } from 'ramda';

import { StateService } from './../../state.service';
import { UserState } from './../../../non-angular/interfaces/userState/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-filters',
  styleUrls: ['./twiglet-filters.component.scss'],
  templateUrl: './twiglet-filters.component.html',
})
export class TwigletFiltersComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userState: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  types: Array<string>;
  form: FormArray;
  formSubscription: Subscription;
  selfUpdated = false;
  currentTwiglet;
  originalTwiglet;
  routeSubscription;

  constructor(private stateService: StateService, public fb: FormBuilder, private cd: ChangeDetectorRef,
  private route: ActivatedRoute) {
    this.route = route;
    this.routeSubscription = this.route.firstChild.params.subscribe((value) => {
      this.currentTwiglet = value.name;
      if (this.currentTwiglet !== this.originalTwiglet) {
        this.originalTwiglet = this.currentTwiglet;
        this.buildForm();
      }
    });
  }

  ngOnInit() {
    this.buildForm();
    this.originalTwiglet = this.currentTwiglet;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState) {
      this.updateForm(changes.userState.currentValue.get('filters').toJS());
    }
    const nodes = this.twiglet.get('nodes');
    const tempTypes = {};
    const tempKeys = {};
    nodes.forEach((node: Map<string, any>) => {
      const type = node.get('type');
      if (!tempTypes[type]) {
        tempTypes[type] = true;
      }
    });
    this.types = Reflect.ownKeys(tempTypes).sort() as Array<string>;
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

  buildForm() {
    this.form = this.fb.array([this.createFilter()]);
    this.formSubscription = this.form.valueChanges.subscribe(changes => {
      this.selfUpdated = true;
      this.stateService.userState.setFilter(this.form.value);
    });
  }

  updateForm(filters) {
    if (Array.isArray(filters)) {
      if (this.selfUpdated) {
        this.selfUpdated = false;
      } else {
        this.formSubscription.unsubscribe();
        this.form = this.fb.array(filters.map(this.createFilter.bind(this)));
        this.formSubscription = this.form.valueChanges.subscribe(changes => {
          this.selfUpdated = true;
          this.stateService.userState.setFilter(this.form.value);
        });
        this.cd.markForCheck();
      }
    }
  }

  createFilter(filter?) {
    if (filter) {
      const group = this.fb.group({
        attributes: this.fb.array(filter.attributes.map(this.createAttribute.bind(this))),
        type: filter.type,
      });
      if (filter._target) {
        group.addControl('_target', this.createFilter.bind(this)(filter._target));
      }
      return group;
    }
    return this.fb.group({
      attributes: this.fb.array([this.createAttribute()]),
      type: '',
    });
  }

  createAttribute(attribute?) {
    if (attribute) {
      return this.fb.group({
        key: attribute.key,
        value: attribute.value,
      });
    }
    return this.fb.group({
      key: '',
      value: '',
    });
  }

  addTarget(i) {
    (<FormGroup>this.form.controls[i]).addControl('_target', this.createFilter());
    this.stateService.userState.setFilter(this.form.value);
  }

  removeTarget(i) {
    (<FormGroup>this.form.controls[i]).removeControl('_target');
    this.stateService.userState.setFilter(this.form.value);
  }

  addFilter() {
    this.form.push(this.createFilter());
    this.stateService.userState.setFilter(this.form.value);
  }

  removeFilter(index) {
    this.form.removeAt(index);
    this.stateService.userState.setFilter(this.form.value);
  }

  updateFilters($event) {
    this.stateService.userState.setFilter($event.target.value);
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
