import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { BehaviorSubject } from 'rxjs/Rx';

import { CustomValidators } from './../../../non-angular/utils/formValidators';
import { D3Node, Link } from '../../../non-angular/interfaces';
import { ModelNodeAttribute } from './../../../non-angular/interfaces/model/index';
import { StateService } from '../../state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-node-modal',
  styleUrls: ['./edit-node-modal.component.scss'],
  templateUrl: './edit-node-modal.component.html',
})
export class EditNodeModalComponent implements OnInit, AfterViewChecked {
  id: string;
  twiglet: Map<string, any>;
  twigletModel: Map<string, any>;
  userState: Map<string, any> = Map({});
  form: FormGroup;
  node: Map<string, any>;
  links: Map<string, Map<string, any>>;
  entityNames: PropertyKey[];
  nodeFormErrors = [ 'name' ];
  attributeFormErrors = [ 'key', 'value' ];
  validationErrors = Map({});
  validationMessages = {
    key: {
      required: 'Icon required'
    },
    name: {
      required: 'Name required.',
    },
    newNode: 'Please click the Submit button to save the changes to your new node.',
    value: {
      float: 'Must be a number',
      integer: 'Must be an integer',
      required: 'This is a required field',
      timestamp: 'Must be a valid date format',
    },
  };

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) {
      this.validationErrors = Map({});
  }

  ngOnInit() {
    const twigletEntities = this.twigletModel.get('entities').toJS();
    this.node = this.twiglet.get('nodes').get(this.id) || this.node;
    this.links = this.twiglet.get('links');
    this.entityNames = Reflect.ownKeys(twigletEntities);
    this.buildForm();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    const node = this.node.toJS() as D3Node;
    // Order the attributes
    const attributes: ModelNodeAttribute[] = node.attrs;
    node.attrs = [];
    if (this.twigletModel.get('entities').get(node.type).get('attributes')) {
      this.twigletModel.get('entities').get(node.type).get('attributes').forEach((attribute: Map<string, any>) => {
        const index = attributes.findIndex(attr => {
          return attr.key === attribute.get('name');
        });
        if (index !== -1) {
          const [removedAttribute] = attributes.splice(index, 1);
          removedAttribute.required = attribute.get('required');
          removedAttribute.dataType = attribute.get('dataType');
          node.attrs.push(removedAttribute);
        } else {
          node.attrs.push({
            dataType: attribute.get('dataType'),
            key: attribute.get('name'),
            required: attribute.get('required'),
            value: '',
          });
        }
      });
    }
    (attributes || []).forEach(attribute => {
      node.attrs.push(attribute);
    });
    // build our form
    const twigletEntities = this.twigletModel.get('entities').toJS();
    this.form = this.fb.group({
      attrs: this.fb.array(node.attrs.reduce((array: any[], attr: ModelNodeAttribute) => {
        array.push(this.createAttribute(attr));
        return array;
      }, [])),
      color: [node._color || twigletEntities[node.type].color],
      gravityPoint: [node.gravityPoint || ''],
      location: [node.location || ''],
      name: [node.name, Validators.required],
      type: [node.type],
    });
    this.addAttribute();
  }

  createAttribute(attr: ModelNodeAttribute = { key: '', value: '', required: false }) {
    return this.fb.group({
      dataType: attr.dataType,
      key: attr.key,
      required: attr.required,
      value: createValueArray(attr.value, attr.required, attr.dataType),
    });
  }

  // function that gets called when user clicks the plus icon to add an attribute. pushes a blank attribute to the attr form array
  addAttribute() {
    const attrs = <FormArray>this.form.get('attrs');
    attrs.push(this.createAttribute());
  }

  removeAttribute(i) {
    const attrs = <FormArray>this.form.get('attrs');
    attrs.removeAt(i);
  }

  checkFormErrors() {
    this.nodeFormErrors.forEach((field: string) => {
      const control = this.form.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];
        Reflect.ownKeys(control.errors).forEach(error => {
          this.validationErrors = this.validationErrors.set(field, this.validationMessages[field][error]);
        });
      }
    });
  }

  checkAttributeErrors() {
    const attributesFormArray = (<FormGroup>this.form.controls['attrs']).controls as any as FormArray;
    Reflect.ownKeys(attributesFormArray).forEach((key: string) => {
      if (key !== 'length') {
        this.attributeFormErrors.forEach((field: string) => {
          const control = attributesFormArray[key].get(field);
          if (control && control.dirty && control.invalid) {
            const messages = this.validationMessages[field];
            Reflect.ownKeys(control.errors).forEach(error => {
              this.validationErrors = this.validationErrors.setIn(['attrs', key, field], this.validationMessages[field][error]);
            });
          }
        });
      }
    });
  }

  onValueChanged() {
    if (!this.form) { return; }

    // Reset all of the errors.
    this.validationErrors = Map({});
    this.checkFormErrors();
    this.checkAttributeErrors();
    this.cd.markForCheck();
  }

  processForm() {
    const twigletEntities = this.twigletModel.get('entities').toJS();
    this.form.value.name = this.form.value.name.trim();
    if (this.form.valid && this.form.value.name.length) {
      const attrs = <FormArray>this.form.get('attrs');
      for (let i = attrs.length - 1; i >= 0; i--) {
        if (attrs.at(i).value.key === '') {
          attrs.removeAt(i);
        }
      }
      // check if the node has any new attributes that were not on the twiglet's model. If it does, add those attributes
      // to the correct entity
      const modelAttrs = twigletEntities[this.form.value.type].attributes;
      if (modelAttrs && this.form.value.attrs.length !== modelAttrs.length) {
        for (let i = this.form.value.attrs.length - 1; i > modelAttrs.length - 1; i --) {
          modelAttrs.push({
            dataType: typeof this.form.value.attrs[i].value,
            name: this.form.value.attrs[i].key,
            required: false
          });
        }
        this.stateService.twiglet.modelService.updateEntityAttributes(this.form.value.type, modelAttrs);
        this.stateService.twiglet.modelService.saveChanges(this.twiglet.get('name'), `${this.twiglet.get('name')}'s model changed`);
      }
      // if the color has changed from the twiglet model's default value, add the override _color property to the form
      if (this.form.value.color !== twigletEntities[this.form.value.type].color) {
        this.form.value._color = this.form.value.color;
      }
      // set up the form to be ready to update the node. Needs id, x, and y values
      this.form.value.id = this.id;
      this.form.value.x = this.node.get('x');
      this.form.value.y = this.node.get('y');
      this.stateService.twiglet.updateNode(this.form.value);
      this.activeModal.close();
    } else if (this.form.value.name.length === 0) {
      // this validation accounts for some old twiglets that may come preloaded with names of empty strings
      this.validationErrors = this.validationErrors.set('name', this.validationMessages.name.required);
    }
  }

  deleteNode() {
    // remove any links that are connected to the node that is marked for deletion
    this.links.forEach(link => {
      if (this.id === link.get('source') || this.id === link.get('target')) {
        this.stateService.twiglet.removeLink({ id: link.get('id') });
      }
    });
    this.activeModal.close();
    this.stateService.twiglet.removeNode({id: this.id});
  }

  closeModal() {
    // Since nodes are technically added as soon as they are placed on the graph, not when the form submit button is clicked,
    // make sure that new nodes don't get added and saved with no name, invalid form, etc. If a new node is added and the user
    // clicks close without adding the required info, that node will be discarded.
    if (this.node.get('name')) {
      this.activeModal.dismiss('Cross click');
    } else {
      this.stateService.twiglet.removeNode({ id: this.id });
      this.activeModal.dismiss('Cross click');
    }
  }
}

function createValueArray(value, required, dataType) {
  const returner = [value];
  const validators = [];
  if (required) {
    validators.push(Validators.required);
  }
  returner.push(validators);
  if (dataType && dataType !== 'string') {
    validators.push(CustomValidators[dataType]);
  }
  return returner;
}
