import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { BehaviorSubject } from 'rxjs/Rx';

import { CustomValidators } from './../../../non-angular/utils/formValidators';
import { D3Node, Link } from '../../../non-angular/interfaces';
import { ModelNodeAttribute } from './../../../non-angular/interfaces/model/index';
import { StateService } from '../../state.service';
import LINK_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/link';
import NODE_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/node';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-node-modal',
  styleUrls: ['./edit-node-modal.component.scss'],
  templateUrl: './edit-node-modal.component.html',
})
export class EditNodeModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('autofocus') private elementRef: ElementRef;
  newNode = false;
  id: string;
  twiglet: Map<string, any>;
  twigletModel: Map<string, any>;
  userState: Map<string, any> = Map({});
  form: FormGroup;
  node: Map<string, any>;
  links: Map<string, Map<string, any>>;
  attrsShown = false;
  entityNames = [];
  nodeType = Map({});
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
    value: {
      float: 'Must be a number',
      integer: 'Must be an integer',
      required: 'This is a required field',
      timestamp: 'Must be a valid date format',
    },
  };
  LINK = LINK_CONSTANTS;
  NODE = NODE_CONSTANTS;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) {
      this.validationErrors = Map({});
  }

  ngOnInit() {
    const twigletEntities = this.twigletModel.get('entities').toJS();
    this.node = this.twiglet.get(this.TWIGLET.NODES).get(this.id) || this.node;
    this.nodeType = this.node.get(this.NODE.TYPE);
    this.links = this.twiglet.get(this.TWIGLET.LINKS);
    for (const key of Object.keys(twigletEntities)) {
      const entityObject = {
        color: twigletEntities[key].color,
        icon: twigletEntities[key].class,
        type: key,
      };
      this.entityNames.push(entityObject);
    }
    this.buildForm();
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewChecked() {
    if (this.form) {
      this.form.valueChanges.subscribe(this.onValueChanged.bind(this));
    }
  }

  buildForm() {
    const node = this.node.toJS() as D3Node;
    // Order the attributes
    const attributes: ModelNodeAttribute[] = node.attrs.filter(attr => attr.value.length !== 0);
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
      gravityPoint: [node.gravityPoint || ''],
      name: [node.name, Validators.required],
      type: [node.type],
    });
    if (node.attrs.length) {
      this.attrsShown = true;
    }
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
        delete attrs.at(i).value.required;
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
        this.stateService.twiglet.modelService.saveChanges(this.twiglet.get(this.TWIGLET.NAME),
          `${this.twiglet.get(this.TWIGLET.NAME)}'s model changed`)
        .subscribe(response => {});
      }
      // set up the form to be ready to update the node. Needs id, x, and y values
      this.form.value.id = this.id;
      this.form.value.x = this.node.get(this.NODE.X);
      this.form.value.y = this.node.get(this.NODE.Y);
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
      if (this.id === link.get(this.LINK.SOURCE) || this.id === link.get(this.LINK.TARGET)) {
        this.stateService.twiglet.removeLink({ id: link.get(this.LINK.ID) });
      }
    });
    this.activeModal.close();
    this.stateService.twiglet.removeNode({id: this.id});
  }

  closeModal() {
    // Since nodes are technically added as soon as they are placed on the graph, not when the form submit button is clicked,
    // make sure that new nodes don't get added and saved with no name, invalid form, etc. If a new node is added and the user
    // clicks close without adding the required info, that node will be discarded.
    if (this.node.get(this.NODE.NAME)) {
      this.activeModal.dismiss('Cross click');
    } else {
      this.stateService.twiglet.removeNode({ id: this.id });
      this.activeModal.dismiss('Cross click');
    }
  }

  setNodeType(entity) {
    this.node = this.node.set(this.NODE.TYPE, entity.type);
    this.nodeType = entity.type;
    this.buildForm();
    this.cd.markForCheck();
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
