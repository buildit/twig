import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() id: string;
  form: FormGroup;
  node: Map<string, any>;
  links: Map<string, Link>;
  entityNames: string[];
  subscription: Subscription;
  datePipe = new DatePipe('en-US');

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.subscription = this.stateService.twiglet.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.node = response.get('nodes').get(this.id);
      this.links = response.get('links');
    });
    this.stateService.twiglet.modelService.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.entityNames = Object.keys(response.get('entities').toJS());
    });
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
      name: [node.name],
      size: [node.size],
      start_at: [this.datePipe.transform(node.start_at, 'yyyy-MM-dd')],
      type: [node.type]
    });
    this.addAttribute();
    // watch for changes and validate
    // this.form.valueChanges.subscribe(data => this.validateForm());
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
    let attrs = <FormArray>this.form.get('attrs');
    for (let i = attrs.length - 1; i >= 0; i--) {
      if (attrs.at(i).value.key === '') {
        attrs.removeAt(i);
      }
    }
    this.form.value.id = this.id;
    this.stateService.twiglet.updateNode(this.form.value);
    this.subscription.unsubscribe();
    this.activeModal.close();
  }

  deleteNode() {
    const links = this.links.toJS() as Link[];
    Object.keys(links).forEach(key => {
      if (this.id === this.links[key].source || this.id === this.links[key].target) {
        this.stateService.twiglet.removeLink(links[key]);
      }
    });
    this.subscription.unsubscribe();
    this.stateService.twiglet.removeNode({id: this.id});
    this.activeModal.close();
  }

  closeModal() {
    this.subscription.unsubscribe();
    this.activeModal.dismiss('Cross click');
  }

}
