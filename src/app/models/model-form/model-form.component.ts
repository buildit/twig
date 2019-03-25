
import {first} from 'rxjs/operators';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { handleError } from '../../../non-angular/services-helpers';
import { ModelEntity } from './../../../non-angular/interfaces/model/index';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { ObjectToArrayPipe } from './../../shared/pipes/object-to-array.pipe';
import { StateService } from '../../state.service';
import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';
import MODEL_ENTITY_CONSTANTS from '../../../non-angular/services-helpers/models/constants/entity';
import MODEL_ENTITY_ATTRIBUTE_CONSTANTS from '../../../non-angular/services-helpers/models/constants/attribute';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

const FORMKEYS = {
  ENTITIES: 'entities'
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-form',
  styleUrls: ['./model-form.component.scss'],
  templateUrl: './model-form.component.html',
})
export class ModelFormComponent implements OnInit, OnDestroy, AfterViewChecked {
  MODEL = MODEL_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  MODEL_ENTITY_ATTRIBUTE = MODEL_ENTITY_ATTRIBUTE_CONSTANTS;
  MODEL_ENTITY = MODEL_ENTITY_CONSTANTS;

  @Input() models;
  @Input() userState;
  entityAdded = false;
  modelSubscription: Subscription;
  model: Map<string, any> = Map({});
  form: FormGroup;
  entityNames = [];
  entityFormErrors = [ 'class', 'type' ];
  attributeFormErrors = [ 'name', 'dataType' ];
  validationErrors = Map({});
  validationMessages = {
    [this.MODEL.NAME]: {
      required: 'name required',
    },
    [this.MODEL_ENTITY.CLASS]: {
      required: 'icon required'
    },
    [this.MODEL_ENTITY.TYPE]: {
      required: 'type required',
      unique: 'type must be unique, please rename'
    },
    [this.MODEL_ENTITY_ATTRIBUTE.DATA_TYPE]: {
      required: 'data type required',
    },
  };
  expanded = { };

  constructor(public stateService: StateService, private cd: ChangeDetectorRef,
          public fb: FormBuilder, private dragulaService: DragulaService, public modalService: NgbModal,
          private renderer: Renderer2) {
    this.modelSubscription = this.stateService.model.observable.subscribe(response => {
      this.model = response;
      this.entityNames = Reflect.ownKeys(this.model.toJS().entities);
    });
    dragulaService.drop.subscribe((value) => {
      const [type, index] = value[0].split('|');
      const entity = <FormGroup>(<FormArray>this.form.controls[this.MODEL.ENTITIES]).controls[index];
      const attributes = <FormArray>entity.controls.attributes;
      const reorderedAttributes = attributes.controls
        .reduce((array, attribute) => {
          array.push(attribute.value);
          return array;
      }, []);
      this.stateService.model.updateEntityAttributes(type, reorderedAttributes);
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

  notBlank(c: FormControl) {
    return c.value !== '' ? null : {
      unique: {
        valid: false,
      }
    };
  }

  ngOnInit() {
    this.stateService.userState.setFormValid(true);
    this.buildForm();
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  ngAfterViewChecked() {
    if (this.entityAdded) {
      this.entityAdded = false;
      const el = this.renderer.selectRootElement('input.entity-type');
      el.focus();
    }
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  ngOnDestroy() {
    if (this.modelSubscription) {
      this.modelSubscription.unsubscribe();
    }
  }


  buildForm() {
    this.form = this.fb.group({
      [this.MODEL.ENTITIES]: this.fb.array(this.model.get(this.MODEL.ENTITIES).reduce((array: any[], entity: Map<string, any>) => {
        array.push(this.createEntity(entity));
        return array;
      }, []))
    });
    this.form.valueChanges.subscribe(changes => {
      this.entityNames = changes.entities.map(entity => entity.type);
      this.stateService.model.updateEntities(changes.entities);
    });
  }

  checkEntitiesAndMarkErrors() {
    const entityForm = <FormGroup>this.form.controls[this.MODEL.ENTITIES];
    const entityFormArray = entityForm.controls as any as FormArray;
    Reflect.ownKeys(entityFormArray).forEach((key: string) => {
      if (key !== 'length') {
        this.entityFormErrors.forEach((field: string) => {
          const control = <FormControl>entityFormArray[key].get(field);
          if (field === 'class' && control.value === '') {
            // class isn't an input so normal trimming/checking doesn't work on it.
            this.stateService.userState.setFormValid(false);
          }
          if (control && control.dirty && !control.valid) {
            Reflect.ownKeys(control.errors).forEach(error => {
              this.validationErrors = this.validationErrors.setIn([this.MODEL.ENTITIES, key, field], this.validationMessages[field][error]);
            });
            this.stateService.userState.setFormValid(false);
          }
        });
        this.checkAttributesForErrors(entityFormArray[key], key);
      }
    });
  }

  checkAttributesForErrors(entity: FormGroup, entityKey: string) {
    const attributes = <FormArray>entity.controls.attributes;
    Reflect.ownKeys(attributes.controls).forEach(attrKey => {
      if (attrKey !== 'length') {
        this.attributeFormErrors.forEach(field => {
          const control = attributes.controls[attrKey].get(field);
          if (!control.valid) {
            this.stateService.userState.setFormValid(false);
          }
          if (control && !control.valid && control.dirty) {
            Reflect.ownKeys(control.errors).forEach(error => {
              let message;
              message = this.validationMessages[field][error];
              this.validationErrors =
                this.validationErrors.setIn([this.MODEL.ENTITIES, entityKey, this.MODEL_ENTITY.ATTRIBUTES, attrKey, field], message);
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

  addAttribute(index: number) {
    const entity = <FormGroup>(<FormArray>this.form.controls[this.MODEL.ENTITIES]).controls[0];
    const attributes = <FormArray>entity.controls.attributes;
    attributes.push(this.createAttribute());
  }

  createAttribute(attribute: Map<string, any> | { [key: string]: any } = Map<string, any>({ dataType: '', required: false })) {
    if (!Map.isMap(attribute)) {
      attribute = fromJS(attribute);
    }
    return this.fb.group({
      dataType: [(<Map<string, any>>attribute).get(this.MODEL_ENTITY_ATTRIBUTE.DATA_TYPE), Validators.required],
      name: [(<Map<string, any>>attribute).get(this.MODEL_ENTITY_ATTRIBUTE.NAME), Validators.required],
      required: (<Map<string, any>>attribute).get(this.MODEL_ENTITY_ATTRIBUTE.REQUIRED),
    });
  }

  removeAttribute(entityIndex: number, attributeIndex: number) {
    const entity = <FormGroup>(<FormArray>this.form.controls[this.MODEL.ENTITIES]).controls[entityIndex];
    const attributes = <FormArray>entity.controls.attributes;
    attributes.removeAt(attributeIndex);
  }

  createEntity(entity = Map<string, any>({})) {
    let attributeFormArray = this.fb.array([]);
    if (entity.get(this.MODEL_ENTITY.ATTRIBUTES)) {
      attributeFormArray = this.fb.array(entity.get(this.MODEL_ENTITY.ATTRIBUTES).reduce((array: any[], attribute: Map<string, any>) => {
        array.push(this.createAttribute(attribute));
        return array;
      }, []));
      ;
    }
    return this.fb.group({
      attributes: attributeFormArray,
      class: [entity.get(this.MODEL_ENTITY.CLASS) || '', [Validators.required]],
      color: entity.get(this.MODEL_ENTITY.COLOR) || '#000000',
      image: entity.get(this.MODEL_ENTITY.IMAGE) || '',
      type: [entity.get(this.MODEL_ENTITY.TYPE) || '', [Validators.required, this.validateType.bind(this)]],
    });
  }

  removeEntity(index: number, type: FormControl) {
    const entities = <FormArray>this.form.get(FORMKEYS.ENTITIES);
    entities.removeAt(index);
    const nameIndex = this.entityNames.indexOf(type.value);
    this.entityNames.splice(nameIndex, 1);
    if (this.validationErrors.size === 0) {
      this.stateService.userState.setFormValid(true);
    }
  }

  addEntity() {
    const entities = <FormArray>this.form.get(FORMKEYS.ENTITIES);
    entities.insert(0, this.createEntity(fromJS({})));
    this.entityAdded = true;
    this.stateService.userState.setFormValid(false);
  }

  discardChanges() {
    this.stateService.userState.setEditing(false);
    this.stateService.userState.setFormValid(true);
  }

  saveModel() {
    const modalRef = this.modalService.open(CommitModalComponent);
    const commitModal = modalRef.componentInstance as CommitModalComponent;
    commitModal.displayContinueEdit = true;
    commitModal.observable.pipe(first()).subscribe(formResult => {
      this.stateService.userState.startSpinner();
      this.stateService.model.saveChanges(formResult.commit).subscribe(() => {
        if (!formResult.continueEdit) {
          this.stateService.userState.setEditing(false);
        }
        commitModal.closeModal();
        this.stateService.userState.stopSpinner();
      }, handleError.bind(this));
    });
  }

  toggleAttributes(index) {
    if (this.expanded[index]) {
      this.expanded[index] = !this.expanded[index];
    } else {
      this.expanded[index] = true;
    }
  }

}
