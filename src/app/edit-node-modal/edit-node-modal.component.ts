import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs';
import { D3Node, Attribute } from '../../non-angular/interfaces';
import { StateService } from '../state.service';

@Component({
  selector: 'app-edit-node-modal',
  styleUrls: ['./edit-node-modal.component.scss'],
  templateUrl: './edit-node-modal.component.html',
})
export class EditNodeModalComponent implements OnInit {
  @Input() id: string;
  form: FormGroup;
  node: D3Node;
  entityNames: string[];
  subscription: Subscription;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private stateService: StateService) {
  }

  ngOnInit() {
    this.subscription = this.stateService.twiglet.nodes.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.node = response.get(this.id).toJS() ;
    });
    this.stateService.twiglet.model.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.entityNames = Object.keys(response.get('entities').toJS());
    });
    this.buildForm();
  }

  buildForm() {
    // build our form
    this.form = this.fb.group({
      attrs: this.fb.array(this.node.attrs.reduce((array: any[], attr: Attribute) => {
        array.push(this.createAttribute(attr.key, attr.value));
        return array;
      }, [])),
      end_at: [this.node.end_at],
      location: [this.node.location],
      name: [this.node.name],
      size: [this.node.size],
      start_at: [this.node.start_at],
      type: [this.node.type]
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
    this.form.value.id = this.id;
    this.stateService.twiglet.nodes.updateNode(this.form.value);
    this.activeModal.close();
  }

  deleteNode() {
    this.subscription.unsubscribe();
    this.stateService.twiglet.nodes.removeNode({id: this.id});
    this.activeModal.close();
  }

}
