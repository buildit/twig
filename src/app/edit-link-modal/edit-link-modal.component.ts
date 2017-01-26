import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs';

import { D3Node, Attribute, Link } from '../../non-angular/interfaces';
import { StateService } from '../state.service';

@Component({
  selector: 'app-edit-link-modal',
  styleUrls: ['./edit-link-modal.component.scss'],
  templateUrl: './edit-link-modal.component.html',
})
export class EditLinkModalComponent implements OnInit {
  @Input() id: string;
  form: FormGroup;
  sourceNode: D3Node;
  targetNode: D3Node;
  link: Link;
  subscription: Subscription;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log(this.id);
    this.subscription = this.stateService.twiglet.observable.subscribe((response: OrderedMap<string, Map<string, any>>) => {
      this.link = response.get('links').get(this.id).toJS();
      this.sourceNode = response.get('nodes').get(this.link.source).toJS();
      this.targetNode = response.get('nodes').get(this.link.target).toJS();
    });
    this.buildForm();
  }

  buildForm() {
    if (!this.link.attrs) {
      this.link.attrs = [];
    }

    // build our form
    this.form = this.fb.group({
      association: [this.link.association],
      attrs: this.fb.array(this.link.attrs.reduce((array: any[], attr: Attribute) => {
        array.push(this.createAttribute(attr.key, attr.value));
        return array;
      }, [])),
      end_at: [this.link.end_at],
      start_at: [this.link.start_at],
    });
    this.addAttribute();
    // watch for changes and validate
    // this.form.valueChanges.subscribe(data => this.validateForm());
  }
  //
  createAttribute(key = '', value = '') {
    return this.fb.group({
      key: [key],
      value: [value]
    });
  }
  //
  addAttribute() {
    let attrs = <FormArray>this.form.get('attrs');
    attrs.push(this.createAttribute());
  }
  //
  removeAttribute(i) {
    let attrs = <FormArray>this.form.get('attrs');
    attrs.removeAt(i);
  }
  //
  processForm() {
    let attrs = <FormArray>this.form.get('attrs');
    for (let i = attrs.length - 1; i >= 0; i--) {
      if (attrs.at(i).value.key === '') {
        attrs.removeAt(i);
      }
    }
    this.form.value.id = this.id;
    console.log(this.form.value);
    // this.stateService.twiglet.updateNode(this.form.value);
    // this.subscription.unsubscribe();
    // this.activeModal.close();
  }
  //
  // deleteNode() {
  //   Object.keys(this.links).forEach(key => {
  //     if (this.id === this.links[key].source || this.id === this.links[key].target) {
  //       this.stateService.twiglet.removeLink(this.links[key]);
  //     }
  //   });
  //   this.subscription.unsubscribe();
  //   this.stateService.twiglet.removeNode({id: this.id});
  //   this.activeModal.close();
  // }
  //
  closeModal() {
    this.subscription.unsubscribe();
    this.activeModal.dismiss('Cross click');
  }

}
