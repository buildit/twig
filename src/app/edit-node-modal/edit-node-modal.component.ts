import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs';

import { D3Node, Attribute, Link } from '../../non-angular/interfaces';
import { StateService } from '../state.service';

@Component({
  selector: 'app-edit-node-modal',
  styleUrls: ['./edit-node-modal.component.scss'],
  templateUrl: './edit-node-modal.component.html',
})
export class EditNodeModalComponent implements OnInit {
  id: string;
  twiglet: Map<string, any>;
  twigletModel: Map<string, any>;
  form: FormGroup;
  node: Map<string, any>;
  links: Map<string, Map<string, any>>;
  entityNames: PropertyKey[];
  datePipe = new DatePipe('en-US');
  errorMessage: string;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.node = this.twiglet.get('nodes').get(this.id);
    this.links = this.twiglet.get('links');
    this.entityNames = Reflect.ownKeys(this.twigletModel.get('entities').toJS());
    this.buildForm();
  }

  buildForm() {
    const node = this.node.toJS();
    // build our form
    this.form = this.fb.group({
      attrs: this.fb.array(node.attrs.reduce((array: any[], attr: Attribute) => {
        array.push(this.createAttribute(attr.key, attr.value));
        return array;
      }, [])),
      end_at: [this.datePipe.transform(node.end_at, 'yyyy-MM-dd')],
      location: [node.location],
      name: [node.name, Validators.required],
      size: [node.size],
      start_at: [this.datePipe.transform(node.start_at, 'yyyy-MM-dd')],
      type: [node.type],
    });
    this.addAttribute();
  }

  createAttribute(key = '', value = '') {
    return this.fb.group({
      key: [key],
      value: [value]
    });
  }

  addAttribute() {
    let attrs = <FormArray>this.form.get('attrs');
    attrs.push(this.createAttribute());
  }

  removeAttribute(i) {
    let attrs = <FormArray>this.form.get('attrs');
    attrs.removeAt(i);
  }

  processForm() {
    if (this.form.value.name) {
      this.form.value.name = this.form.value.name.trim();
    }
    if (this.form.valid && this.form.value.name.length) {
      let attrs = <FormArray>this.form.get('attrs');
      for (let i = attrs.length - 1; i >= 0; i--) {
        if (attrs.at(i).value.key === '') {
          attrs.removeAt(i);
        }
      }
      this.form.value.id = this.id;
      this.stateService.twiglet.updateNode(this.form.value);
      this.activeModal.close();
    } else {
      this.errorMessage = 'You must enter a name for your node!';
      this.cd.markForCheck();
    }
  }

  deleteNode() {
    this.links.forEach(link => {
      if (this.id === link.get('source') || this.id === link.get('target')) {
        this.stateService.twiglet.removeLink({ id: link.get('id') });
      }
    });
    this.stateService.twiglet.removeNode({id: this.id});
    this.activeModal.close();
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

}
