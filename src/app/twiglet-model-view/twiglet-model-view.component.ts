import { DragulaService } from 'ng2-dragula';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Validators } from '../../non-angular/utils/formValidators';
import { Subscription } from 'rxjs/Subscription';
import { Map, fromJS } from 'immutable';

import { StateService } from '../state.service';
import { ModelEntity } from './../../non-angular/interfaces/model/index';
import { ObjectToArrayPipe } from './../object-to-array.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';

@Component({
  selector: 'app-twiglet-model-view',
  styleUrls: ['./twiglet-model-view.component.scss'],
  templateUrl: '../model-form/model-form.component.html',
})
export class TwigletModelViewComponent implements OnInit, OnDestroy, AfterViewChecked {
  userState: Map<string, any>;
  twigletModel: Map<string, any> = Map({});
  twiglet: Map<string, any>;
  nodes: any[] = [];
  modelSubscription: Subscription;
  modelEventsSubscription: Subscription;
  userStateSubscription: Subscription;
  twigletSubscription: Subscription;
  form: FormGroup;
  entityFormErrors = [ 'class', 'type' ];
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
    },
  };
  expanded = { };

  constructor(public stateService: StateService,
    private cd: ChangeDetectorRef,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private dragulaService: DragulaService) {
    const formBuilt = false;
    this.modelSubscription = stateService.twiglet.modelService.observable.subscribe(model => {
      const newModel = this.twigletModel.get('entities') && this.twigletModel.get('entities').size === 0
        && model.get('entities').size !== 0;
      this.twigletModel = model;
      if (newModel) {
        this.buildForm();
      }
      this.cd.markForCheck();
    });
    this.twigletSubscription = stateService.twiglet.observable.subscribe(twiglet => {
      this.twiglet = twiglet;
      setTimeout(() => {
        twiglet.get('nodes').reduce((array, nodes) => {
          array.push(nodes.toJS());
          this.nodes = array;
          return this.nodes;
        }, []);
      }, 0);
    });
    this.route.params.subscribe((params: Params) => {
      if (!this.twiglet) {
        this.stateService.twiglet.loadTwiglet(params['name']);
      }
      if (this.twiglet && this.twiglet.get('name') !== params['name']) {
        this.stateService.twiglet.loadTwiglet(params['name']);
      }
    });
    this.userStateSubscription = stateService.userState.observable.subscribe(userState => {
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
        type: ['', Validators.required]
      }),
      entities: this.fb.array([])
    });
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
    this.modelEventsSubscription = this.stateService.twiglet.modelService.events.subscribe(response => {
      if (response === 'restore') {
        this.buildForm();
      }
    });
  }

  ngOnDestroy() {
    this.modelSubscription.unsubscribe();
    this.modelEventsSubscription.unsubscribe();
    this.twigletSubscription.unsubscribe();
    this.userStateSubscription.unsubscribe();
  }

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
        type: ['', Validators.required]
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
        const messages = this.validationMessages[field];
        Reflect.ownKeys(control.errors).forEach(error => {
          const currentErrors = this.validationErrors.getIn(['blankEntity', field]);
          if (currentErrors) {
            this.validationErrors =
              this.validationErrors.setIn(['blankEntity', field], `${currentErrors}, ${this.validationMessages[field][error]}`);
          } else {
            this.validationErrors = this.validationErrors.setIn(['blankEntity', field], this.validationMessages[field][error]);
          }
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
          if (!control.valid && this.userState.get('formValid')) {
            this.stateService.userState.setFormValid(false);
          }
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            Reflect.ownKeys(control.errors).forEach(error => {
              const currentErrors = this.validationErrors.getIn(['entities', key, field]);
              if (currentErrors) {
                this.validationErrors =
                  this.validationErrors.setIn(['entities', key, field], `${currentErrors}, ${this.validationMessages[field][error]}`);
              } else {
                this.validationErrors = this.validationErrors.setIn(['entities', key, field], this.validationMessages[field][error]);
              }
            });
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
          if (control && !control.valid) {
            const messages = this.validationMessages[field];
            Reflect.ownKeys(control.errors).forEach(error => {
              const currentErrors = this.validationErrors.getIn(['entities', entityKey, 'attributes', attrKey, field]);
              let message;
              if (currentErrors) {
                message = `${currentErrors}, ${this.validationMessages[field][error]}`;
              } else {
                message = this.validationMessages[field][error];
              }
              this.validationErrors = this.validationErrors
                  .setIn(['entities', entityKey, 'attributes', attrKey, field], message);
            });
          }
        });
      }
    });
  }

  onValueChanged() {
    if (!this.form) { return; }
    if (!this.userState.get('formValid')) {
      this.stateService.userState.setFormValid(true);
    };
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
    }

    return this.fb.group({
      attributes: attributeFormArray,
      class: [entity.get('class') || '', Validators.required],
      color: entity.get('color') || '#000000',
      image: entity.get('image') || '',
      size: entity.get('size') || '',
      type: [entity.get('type') || '', Validators.required],
    });
  }

  removeEntity(index: number) {
    const entities = <FormArray>this.form.get('entities');
    entities.removeAt(index);
  }

  addEntity() {
    const newEntity = <FormGroup>this.form.controls['blankEntity'];
    newEntity.value.type = newEntity.value.type.trim();
    if (newEntity.valid && newEntity.value.type.length > 0) {
      const entities = <FormArray>this.form.get('entities');
      entities.push(this.createEntity(fromJS(newEntity.value)));
      newEntity.reset({ color: '#000000' });
    } else {
      this.checkBlankEntityAndMarkErrors();
    }
  }

  inTwiglet(type) {
    return this.nodes.some(node => node.type === type);
  }

  toggleAttributes(index) {
    if (this.expanded[index]) {
      this.expanded[index] = !this.expanded[index];
    } else {
      this.expanded[index] = true;
    }
  }
}
