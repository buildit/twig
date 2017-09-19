import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import { CommitModalComponent } from './../../shared/commit-modal/commit-modal.component';
import { handleError } from '../../../non-angular/services-helpers';
import { ModelEntity } from './../../../non-angular/interfaces/model/index';
import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';
import { ObjectSortPipe } from './../../shared/pipes/object-sort.pipe';
import { ObjectToArrayPipe } from './../../shared/pipes/object-to-array.pipe';
import { StateService } from '../../state.service';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-form',
  styleUrls: ['./model-form.component.scss'],
  templateUrl: './model-form.component.html',
})
export class ModelFormComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() models;
  @Input() userState;
  modelSubscription: Subscription;
  model: Map<string, any> = Map({});
  form: FormGroup;
  entityNames = [];
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
      unique: 'type must be unique, please rename'
    },
  };
  expanded = { };
  MODEL = MODEL_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public stateService: StateService, private cd: ChangeDetectorRef,
          public fb: FormBuilder, private dragulaService: DragulaService, public modalService: NgbModal) {
    this.modelSubscription = this.stateService.model.observable.subscribe(response => {
      this.model = response;
      this.entityNames = Reflect.ownKeys(this.model.toJS().entities);
    });
    dragulaService.drop.subscribe((value) => {
      const [type, index] = value[0].split('|');
      const reorderedAttributes = this.form.controls['entities']['controls'][index].controls.attributes.controls
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

  ngOnDestroy() {
    this.modelSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    this.form = this.fb.group({
      entities: this.fb.array(this.model.get(this.MODEL.ENTITIES).reduce((array: any[], entity: Map<string, any>) => {
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
    const entityForm = <FormGroup>this.form.controls['entities'];
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
          if (!control.valid) {
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

  createAttribute(attribute: Map<string, any> | { [key: string]: any } = Map<string, any>({ dataType: '', required: false })) {
    if (!Map.isMap(attribute)) {
      attribute = fromJS(attribute);
    }
    return this.fb.group({
      dataType: [(<Map<string, any>>attribute).get('dataType'), Validators.required],
      name: [(<Map<string, any>>attribute).get('name'), Validators.required],
      required: (<Map<string, any>>attribute).get('required'),
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
      class: [entity.get('class') || '', [Validators.required]],
      color: entity.get('color') || '#000000',
      image: entity.get('image') || '',
      type: [entity.get('type') || '', [Validators.required, this.validateType.bind(this)]],
    });
  }

  removeEntity(index: number, type: FormControl) {
    const entities = <FormArray>this.form.get('entities');
    entities.removeAt(index);
    const nameIndex = this.entityNames.indexOf(type.value);
    this.entityNames.splice(nameIndex, 1);
    if (this.validationErrors.size === 0) {
      this.stateService.userState.setFormValid(true);
    }
  }

  addEntity() {
    const entities = <FormArray>this.form.get('entities');
    entities.insert(0, this.createEntity(fromJS({})));
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
    commitModal.observable.first().subscribe(formResult => {
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
