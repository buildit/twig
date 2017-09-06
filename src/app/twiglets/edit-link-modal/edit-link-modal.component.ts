import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Map, OrderedMap } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import { D3Node, Attribute, Link } from '../../../non-angular/interfaces';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-edit-link-modal',
  styleUrls: ['./edit-link-modal.component.scss'],
  templateUrl: './edit-link-modal.component.html',
})
export class EditLinkModalComponent implements OnInit {
  @ViewChild('autofocus') private elementRef: ElementRef;
  id: string;
  twiglet: Map<string, any>;
  form: FormGroup;
  sourceNode: Map<string, any>;
  targetNode: Map<string, any>;
  link: Map<string, any>;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder,
    private stateService: StateService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.link = this.twiglet.get('links').get(this.id);
    this.sourceNode = this.twiglet.get('nodes').get(this.link.get('source') as string);
    this.targetNode = this.twiglet.get('nodes').get(this.link.get('target') as string);
    this.buildForm();
    if (this.elementRef) {
      this.elementRef.nativeElement.focus();
    }
  }

  buildForm() {
    const link = this.link.toJS() as Link;
    if (!link.attrs) {
      link.attrs = [];
    }

    // build our form
    this.form = this.fb.group({
      association: [link.association],
      attrs: this.fb.array(link.attrs.reduce((array: any[], attr: Attribute) => {
        array.push(this.createAttribute(attr.key, attr.value));
        return array;
      }, []))
    });
    this.addAttribute();
  }

  /**
   * Creates a new attribute, defaults to an empty row.
   *
   * @param {string} [key='']
   * @param {string} [value='']
   * @returns
   *
   * @memberOf EditLinkModalComponent
   */
  createAttribute(key = '', value = '') {
    return this.fb.group({
      key: [key],
      value: [value]
    });
  }

  /**
   * Adds an attribute to the list of attribute rows in the node.
   *
   *
   * @memberOf EditLinkModalComponent
   */
  addAttribute() {
    const attrs = <FormArray>this.form.get('attrs');
    attrs.push(this.createAttribute());
  }

  /**
   * Removes the nth attribute from the nodes list.
   *
   * @param {any} i index to remove.
   *
   * @memberOf EditLinkModalComponent
   */
  removeAttribute(i) {
    const attrs = <FormArray>this.form.get('attrs');
    attrs.removeAt(i);
  }

  /**
   * updates the link with the new information.
   *
   *
   * @memberOf EditLinkModalComponent
   */
  processForm() {
    if (this.form.valid) {
      const attrs = <FormArray>this.form.get('attrs');
      for (let i = attrs.length - 1; i >= 0; i--) {
        if (attrs.at(i).value.key === '') {
          attrs.removeAt(i);
        }
      }
      this.form.value.id = this.id;
      this.form.value.source = this.sourceNode.get('id');
      this.form.value.target = this.targetNode.get('id');
      this.stateService.twiglet.updateLink(this.form.value);
      this.activeModal.close();
    }
  }

  /**
   * Removes the link from the twiglet.
   *
   *
   * @memberOf EditLinkModalComponent
   */
  deleteLink() {
    this.stateService.twiglet.removeLink({ id: this.link.get('id') });
    this.activeModal.close();
  }

  /**
   * Closes the modal.
   *
   *
   * @memberOf EditLinkModalComponent
   */
  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

}
