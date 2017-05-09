import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { List, Map, fromJS } from 'immutable';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import { ModelEntity } from './../../../non-angular/interfaces/model/index';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { ObjectToArrayPipe } from './../../shared/pipes/object-to-array.pipe';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-twiglet-model-view',
  styleUrls: ['./twiglet-model-view.component.scss'],
  templateUrl: './twiglet-model-view.component.html',
})
export class TwigletModelViewComponent implements OnInit, OnDestroy, AfterViewChecked {
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

  constructor(public stateService: StateService,
    private cd: ChangeDetectorRef,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private dragulaService: DragulaService) {
    const formBuilt = false;
    stateService.twiglet.modelService.observable.first().subscribe(model => {
      const newModel = this.twigletModel.get('entities') && this.twigletModel.get('entities').size === 0
        && model.get('entities').size !== 0;
      this.twigletModel = model;
      this.entityNames = Object.keys(this.twigletModel.toJS().entities);
      this.buildForm();
      this.updateInTwiglet();
      this.cd.markForCheck();
    });
    stateService.twiglet.observable.first().subscribe((twiglet) => {
      this.twiglet = twiglet;
      this.updateInTwiglet();
      this.cd.markForCheck();
    });
    this.route.params.first().subscribe((params: Params) => {
      if (!this.twiglet || (this.twiglet && this.twiglet.get('name') !== params['name'])) {
        this.stateService.twiglet.loadTwiglet(params['name']).first().subscribe(response => {
          this.twiglet = fromJS(response.twigletFromServer);
          const sortedEntities = (<Map<string, any>>fromJS(response.modelFromServer.entities)).sortBy(entity => entity.get('type'));
          this.entityNames = Object.keys(response.modelFromServer.entities);
          this.twigletModel = Map({ entities: sortedEntities });
          this.stateService.twiglet.modelService.createBackup();
          this.stateService.userState.setEditing(true);
          this.stateService.userState.setTwigletModelEditing(true);
          this.stateService.userState.setFormValid(true);
          this.updateInTwiglet();
          this.buildForm();
          this.cd.markForCheck();
        });
      }
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
      blankEntity: this.fb.group({
        class: ['', Validators.required],
        color: '#000000',
        image: '',
        size: '',
        type: ['', [Validators.required, this.validateType.bind(this)]]
      }),
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
      const nodes = <List<Map<string, any>>>this.twiglet.get('nodes');
      this.inTwiglet = this.twigletModel.get('entities').reduce((array, entity) => {
        array.push({inTwiglet: nodes.some(node => node.get('type') === entity.get('type')), type: entity.get('type')});
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

  ngOnDestroy() { }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    this.form = this.fb.group({
      blankEntity: this.fb.group({
        class: ['', Validators.required],
        color: '#000000',
        image: '',
        size: '',
        type: ['', [Validators.required, this.validateType.bind(this)]]
      }),
      entities: this.fb.array(this.twigletModel.get('entities').reduce((array: any[], entity: Map<string, any>) => {
        array.push(this.createEntity(entity));
        return array;
      }, []))
    });
    this.form.valueChanges.subscribe(changes => {
      this.stateService.twiglet.modelService.updateEntities(changes.entities);
    });
  }

  checkBlankEntityAndMarkErrors() {
    const form = <FormGroup>this.form.controls['blankEntity'];
    this.entityFormErrors.forEach((field: string) => {
      const control = form.get(field);
      if (control && control.dirty && control.invalid) {
        this.stateService.userState.setFormValid(false);
        Reflect.ownKeys(control.errors).forEach(error => {
          this.validationErrors = this.validationErrors.setIn(['blankEntity', field], this.validationMessages[field][error]);
        });
      }
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
          if (!control.valid && this.userState.get('formValid')) {
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
    this.checkBlankEntityAndMarkErrors();
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
      size: entity.get('size') || '',
      type: [entity.get('type') || '', [Validators.required, this.validateType.bind(this)]],
    });
  }

  removeEntity(index: number, type: FormControl) {
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
    const newEntity = <FormGroup>this.form.controls['blankEntity'];
    newEntity.value.type = newEntity.value.type.trim();
    if (newEntity.valid && newEntity.value.type.length > 0) {
      const entities = <FormArray>this.form.get('entities');
      this.inTwiglet.push({ inTwiglet: false, type: newEntity.value.type });
      this.entityNames.push(newEntity.value.type);
      entities.push(this.createEntity(fromJS(newEntity.value)));
      newEntity.reset({ color: '#000000' });
      if (this.validationErrors.size === 0) {
        this.stateService.userState.setFormValid(true);
      }
    } else {
      this.checkBlankEntityAndMarkErrors();
    }
  }

  toggleAttributes(index) {
    if (this.expanded[index]) {
      this.expanded[index] = !this.expanded[index];
    } else {
      this.expanded[index] = true;
    }
  }
}

