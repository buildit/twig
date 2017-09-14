import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { List, Map } from 'immutable';
import { ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { equals, range } from 'ramda';
import { Subscription } from 'rxjs/Subscription';

import { StateService } from './../../state.service';
import { UserState } from './../../../non-angular/interfaces/userState/index';
import ATTRIBUTE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/attribute';
import NODE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/node';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-filters',
  styleUrls: ['./twiglet-filters.component.scss'],
  templateUrl: './twiglet-filters.component.html',
})
export class TwigletFiltersComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userState: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  types: List<string>;
  typesSubscription: Subscription;
  form: FormArray;
  levelSelectForm: FormGroup;
  formSubscription: Subscription;
  levelSelectFormSubscription: Subscription;
  selfUpdated = false;
  currentTwiglet;
  originalTwiglet;
  routeSubscription;
  ATTRIBUTE = ATTRIBUTE_CONSTANTS;
  NODE = NODE_CONSTANTS;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

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
    this.typesSubscription = this.stateService.twiglet.nodeTypes.subscribe(types => {
      this.types = <List<string>>types.sort();
    });
  }

  ngOnInit() {
    this.buildForm();
    if (this.userState.get(this.USERSTATE.FILTERS)) {
      this.updateForm(this.userState.get(this.USERSTATE.FILTERS).toJS());
    }
    this.originalTwiglet = this.currentTwiglet;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState) {
      this.updateForm(changes.userState.currentValue.get(this.USERSTATE.FILTERS).toJS());
    }
    const nodes = this.twiglet.get(this.TWIGLET.NODES);
    this.cd.markForCheck();
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
          if (!valuesObject[value] && value !== '') {
            valuesObject[value] = true;
          }
        }
      });
    });
    return Reflect.ownKeys(valuesObject);
  }

  buildForm() {
    this.form = this.fb.array([this.createFilter()]);
    this.formSubscription = this.form.valueChanges.subscribe(this.processFormChanges.bind(this));
    this.levelSelectForm = this.fb.group({
      level: '',
    });
    this.levelSelectFormSubscription = this.levelSelectForm.valueChanges.subscribe(changes => {
      this.stateService.userState.setLevelFilter(this.levelSelectForm.value.level);
    });
  }

  processFormChanges() {
    this.selfUpdated = true;
    this.stateService.userState.setFilter(this.form.value);
  }

  getLevels() {
    return range(0, this.userState.get(this.USERSTATE.LEVEL_FILTER_MAX) + 1);
  }

  updateForm(filters) {
    if (Array.isArray(filters)) {
      if (this.selfUpdated) {
        this.selfUpdated = false;
      } else {
        this.formSubscription.unsubscribe();
        this.form = this.fb.array(filters.map(this.createFilter.bind(this)));
        this.formSubscription = this.form.valueChanges.subscribe(this.processFormChanges.bind(this));
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
