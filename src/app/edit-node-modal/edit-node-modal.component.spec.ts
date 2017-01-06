/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EditNodeModalComponent } from './edit-node-modal.component';
import { StateService, StateServiceStub } from '../state.service';

describe('EditNodeModalComponent', () => {
  let component: EditNodeModalComponent;
  let fixture: ComponentFixture<EditNodeModalComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNodeModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [ { provide: StateService, useValue: stateService},
        NgbActiveModal, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNodeModalComponent);
    component = fixture.componentInstance;
    component.id = 'firstNode';
    fixture.detectChanges();
    component.form.controls['name'].setValue('a name');
    component.form.controls['end_at'].setValue('some date');
    component.form.controls['location'].setValue('denver');
    component.form.controls['size'].setValue('12');
    component.form.controls['start_at'].setValue('some previous date');
    component.form.controls['type'].setValue('ent1');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML rendering', () => {
    it('displays all of the attributes the node has', () => {
      const attrs = fixture.nativeElement.querySelectorAll('.attr');
      const firstSet = attrs[0].querySelectorAll('input');
      expect(firstSet[0].value).toEqual('keyOne');
      expect(firstSet[1].value).toEqual('valueOne');
      const secondSet = attrs[1].querySelectorAll('input');
      expect(secondSet[0].value).toEqual('keyTwo');
      expect(secondSet[1].value).toEqual('valueTwo');
    });

    it('displays an empty attribute line for adding new attributes', () => {
      const attrs = fixture.nativeElement.querySelectorAll('.attr');
      const emptySet = attrs[2].querySelectorAll('input');
      expect(emptySet[0].value).toEqual('');
      expect(emptySet[1].value).toEqual('');
    });

    it('displays all of the appropriate select values for node.type', () => {
      const selects = fixture.nativeElement.querySelectorAll('option');
      expect(selects.length).toEqual(5);
    });

    it('correctly puts selected on the correct select element', () => {
      const selected = fixture.nativeElement.querySelector('option').attributes as NamedNodeMap;
      expect(selected.getNamedItem('ng-reflect-selected')).toBeTruthy();
    });
  });

  // HTML rendering test - describe

  // Describe button clicks - submit and delete
  describe('button clicks', () => {

    it('submits the form to add a node after removing unused attributes', () => {
      let attrs = <FormArray>component.form.get('attrs');
      attrs.push(component.createAttribute('one', 'whatever'));
      attrs.push(component.createAttribute());
      attrs.push(component.createAttribute('three', 'idk'));
      const expectedNode = {
        attrs: [
          { key: 'keyOne', value: 'valueOne' },
          { key: 'keyTwo', value: 'valueTwo' },
          { key: 'one', value: 'whatever' },
          { key: 'three', value: 'idk' }
        ],
        end_at: 'some date',
        id: 'firstNode',
        location: 'denver',
        name: 'a name',
        size: '12',
        start_at: 'some previous date',
        type: 'ent1'
      };
      spyOn(stateService.twiglet.nodes, 'updateNode');
      fixture.nativeElement.querySelector('button.btn-primary').click();
      expect(stateService.twiglet.nodes.updateNode).toHaveBeenCalledWith(expectedNode);
    });

    it('deletes a node when delete is clicked', () => {
      spyOn(stateService.twiglet.nodes, 'removeNode');
      fixture.nativeElement.querySelector('button.btn-danger').click();
      expect(stateService.twiglet.nodes.removeNode).toHaveBeenCalledWith({ id: 'firstNode' });
    });

    it('adds a blank line to add an attribute', () => {
      fixture.nativeElement.querySelector('.fa-plus-circle').click();
      fixture.detectChanges();
      const attrs = fixture.nativeElement.querySelectorAll('.attr');
      expect(attrs.length).toEqual(4);
      const emptySet = attrs[3].querySelectorAll('input');
      expect(emptySet[0].value).toEqual('');
      expect(emptySet[1].value).toEqual('');
    });

    it('removes an attribute', () => {
      fixture.nativeElement.querySelector('.fa-minus-circle').click();
      fixture.detectChanges();
      const attrs = fixture.nativeElement.querySelectorAll('.attr');
      expect(attrs.length).toEqual(2);
      const firstSet = attrs[0].querySelectorAll('input');
      expect(firstSet[0].value).toEqual('keyTwo');
      expect(firstSet[1].value).toEqual('valueTwo');
    });
  });

});
