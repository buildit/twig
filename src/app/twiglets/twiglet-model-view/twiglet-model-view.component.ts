import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { fromJS, List, Map } from 'immutable';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import { ModelEntity } from './../../../non-angular/interfaces/model/index';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { ObjectToArrayPipe } from './../../shared/pipes/object-to-array.pipe';
import { StateService } from '../../state.service';
import NODE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/node';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  selector: 'app-twiglet-model-view',
  styleUrls: ['./twiglet-model-view.component.scss'],
  templateUrl: './twiglet-model-view.component.html',
})
export class TwigletModelViewComponent implements OnInit, AfterViewChecked {
  userState: Map<string, any>;
  twigletModel: Map<string, any> = Map({});
  twiglet: Map<string, any>;
  inTwiglet = [];
  form: FormGroup;
  entityFormErrors = [ 'class', 'type' ];
  entityNames = [];
  attributeFormErrors = [ 'name', 'dataType' ];
  validationErrors = Map({});
  validationMessages = {
    class: {
      required: 'icon required'
    },
    dataType: {
      required: 'data type required',
    },
    name: {
      required: 'name required',
    },
    type: {
      required: 'type required',
      unique: 'type must be unique, please rename'
    },
  };
  expanded = { };
  NODE = NODE_CONSTANTS;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService,
    private cd: ChangeDetectorRef,
    public fb: FormBuilder,
    private dragulaService: DragulaService) {
    const formBuilt = false;
    stateService.twiglet.modelService.observable.subscribe(model => {
      this.twigletModel = model;
      this.entityNames = Reflect.ownKeys(this.twigletModel.toJS().entities);
      this.buildForm();
      this.updateInTwiglet();
      this.cd.markForCheck();
    });
    stateService.twiglet.observable.subscribe((twiglet) => {
      this.twiglet = twiglet;
      this.updateInTwiglet();
      this.cd.markForCheck();
    });
    stateService.userState.observable.first().subscribe(userState => {
      this.userState = userState;
    });
    dragulaService.drop.subscribe((value) => {
      const [type, index] = value[0].split('|');
      const reorderedAttributes = this.form.controls['entities']['controls'][index].controls.attributes.controls
        .reduce((array, attribute) => {
          array.push(attribute.value);
          return array;
      }, []);
      this.stateService.twiglet.modelService.updateEntityAttributes(type, reorderedAttributes);
    });
    this.form = this.fb.group({
      entities: this.fb.array([])
    });
  }

  validateType(c: FormControl) {
    return !this.entityNames.includes(c.value) ? null : {
      unique: {
        valid: false,
      }
    };
  }

  updateInTwiglet() {
    if (this.twiglet && this.twigletModel) {
      const nodes = <List<Map<string, any>>>this.twiglet.get(this.TWIGLET.NODES);
      this.inTwiglet = this.twigletModel.get('entities').reduce((array, entity) => {
        array.push({inTwiglet: nodes.some(node => node.get(this.NODE.TYPE) === entity.get('type')), type: entity.get('type')});
        return array;
      }, []);
    }
  }

  ngOnInit() {
    let formBuilt = false;
    this.stateService.userState.setFormValid(true);
    if (!formBuilt) {
      this.buildForm();
      formBuilt = true;
    } else {
      const reduction = this.twigletModel.get('entities').reduce((array, model) => {
        array.push(model.toJS());
        return array;
      }, []);
      (this.form.controls['entities'] as FormArray)
        .patchValue(reduction, { emitEvent: false });
    }
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    this.form = this.fb.group({
      entities: this.fb.array(this.twigletModel.get('entities').reduce((array: any[], entity: Map<string, any>) => {
        array.push(this.createEntity(entity));
        return array;
      }, []))
    });
    this.form.valueChanges.subscribe(changes => {
      this.entityNames = changes.entities.map(entity => entity.type);
      this.stateService.twiglet.modelService.updateEntities(changes.entities);
    });
  }

  checkEntitiesAndMarkErrors() {
    const entityForm = <FormGroup>this.form.controls['entities'];
    const entityFormArray = entityForm.controls as any as FormArray;
    Reflect.ownKeys(entityFormArray).forEach((key: string) => {
      if (key !== 'length') {
        this.entityFormErrors.forEach((field: string) => {
          const control = entityFormArray[key].get(field);
          if (control && control.dirty && !control.valid) {
            Reflect.ownKeys(control.errors).forEach(error => {
              this.validationErrors = this.validationErrors.setIn(['entities', key, field], this.validationMessages[field][error]);
            });
            this.stateService.userState.setFormValid(false);
          }
        });
        this.checkAttributesForErrors(entityFormArray[key], key);
      }
    });
  }

  checkAttributesForErrors(entity: FormControl, entityKey: string) {
    Reflect.ownKeys(entity['controls'].attributes.controls).forEach(attrKey => {
      if (attrKey !== 'length') {
        this.attributeFormErrors.forEach(field => {
          const control = entity['controls'].attributes.controls[attrKey].get(field);
          if (!control.valid && this.userState.get(this.USERSTATE.FORM_VALID)) {
            this.stateService.userState.setFormValid(false);
          }
          if (control && !control.valid && control.dirty) {
            Reflect.ownKeys(control.errors).forEach(error => {
              let message;
              message = this.validationMessages[field][error];
              this.validationErrors = this.validationErrors.setIn(['entities', entityKey, 'attributes', attrKey, field], message);
            });
          }
        });
      }
    });
  }

  onValueChanged() {
    if (!this.form) { return; }
    this.stateService.userState.setFormValid(true);
    // Reset all of the errors.
    this.validationErrors = Map({});
    this.checkEntitiesAndMarkErrors();
    this.cd.markForCheck();
  }

  addAttribute(index) {
    this.form.controls['entities']['controls'][index].controls.attributes.push(this.createAttribute());
  }

  createAttribute(attribute = Map<string, any>({ dataType: '', required: false })) {
    if (typeof attribute === 'object') {
      attribute = fromJS(attribute);
    }
    return this.fb.group({
      dataType: [attribute.get('dataType'), Validators.required],
      name: [attribute.get('name'), Validators.required],
      required: attribute.get('required'),
    });
  }

  removeAttribute(entityIndex, attributeIndex) {
    this.form.controls['entities']['controls'][entityIndex].controls.attributes.removeAt(attributeIndex);
  }

  createEntity(entity = Map<string, any>({})) {
    let attributeFormArray = this.fb.array([]);
    if (entity.get('attributes')) {
      attributeFormArray = this.fb.array(entity.get('attributes').reduce((array: any[], attribute: Map<string, any>) => {
        array.push(this.createAttribute(attribute));
        return array;
      }, []));
      ;
    }
    return this.fb.group({
      attributes: attributeFormArray,
      class: [entity.get('class') || '', Validators.required],
      color: entity.get('color') || '#000000',
      image: entity.get('image') || '',
      type: [entity.get('type') || '', [Validators.required, this.validateType.bind(this)]],
    });
  }

  removeEntity(index: number, type: FormControl) {
    this.stateService.twiglet.modelService.removeFromModelNames(index);
    const entities = <FormArray>this.form.get('entities');
    entities.removeAt(index);
    this.inTwiglet.splice(index, 1);
    const nameIndex = this.entityNames.indexOf(type.value);
    this.entityNames.splice(nameIndex, 1);
    if (this.validationErrors.size === 0) {
      this.stateService.userState.setFormValid(true);
    }
  }

  addEntity() {
    this.stateService.twiglet.modelService.prependModelNames();
    this.inTwiglet.unshift({ inTwiglet: false, type: '' });
    const entities = <FormArray>this.form.get('entities');
    entities.insert(0, this.createEntity(fromJS({})));
  }

  toggleAttributes(index) {
    if (this.expanded[index]) {
      this.expanded[index] = !this.expanded[index];
    } else {
      this.expanded[index] = true;
    }
  }
}

