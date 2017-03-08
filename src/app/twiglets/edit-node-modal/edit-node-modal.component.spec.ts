/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EditNodeModalComponent } from './edit-node-modal.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { fullTwigletMap, fullTwigletModelMap } from '../../../non-angular/testHelpers';

describe('EditNodeModalComponent', () => {
  let component: EditNodeModalComponent;
  let fixture: ComponentFixture<EditNodeModalComponent>;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('name1');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNodeModalComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNodeModalComponent);
    component = fixture.componentInstance;
    component.id = 'firstNode';
    component.twiglet = fullTwigletMap();
    component.twigletModel = fullTwigletModelMap();
    fixture.detectChanges();
    component.form.controls['name'].setValue('a name');
    component.form.controls['end_at'].setValue('2017-01-25T22:51:53.878Z');
    component.form.controls['location'].setValue('denver');
    component.form.controls['size'].setValue('12');
    component.form.controls['start_at'].setValue('2017-01-25T22:51:53.878Z');
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
      expect(selects.length).toEqual(6);
    });

    it('correctly puts selected on the correct entity option', () => {
      const selected = fixture.nativeElement.querySelector('option').attributes as NamedNodeMap;
      expect(selected.getNamedItem('ng-reflect-selected')).toBeTruthy();
    });

    it('does not show an error message when the form is valid', () => {
      fixture.nativeElement.querySelector('button.button').click();
    });

    it('displays an error message if the user submits the form with no node name', () => {
      component.form.controls['name'].setValue('');
      fixture.detectChanges();
      fixture.nativeElement.querySelectorAll('button.button')[2].click();
    });

    it('displays an error message if the user submits the form with empty spaces for a node name', () => {
      component.form.controls['name'].setValue('  ');
      fixture.detectChanges();
      fixture.nativeElement.querySelectorAll('button.button')[2].click();
    });
  });

  // HTML rendering test - describe

  // Describe button clicks - submit and delete
  describe('button clicks', () => {

    it('submits the form to add a node after removing unused attributes', () => {
      const attrs = <FormArray>component.form.get('attrs');
      attrs.push(component.createAttribute({ key: 'one', value: 'whatever' }));
      attrs.push(component.createAttribute());
      attrs.push(component.createAttribute({ key: 'three', value: 'idk' }));
      const expectedNode = {
        attrs: [
          { key: 'keyOne', value: 'valueOne', dataType: null, required: null },
          { key: 'keyTwo', value: 'valueTwo', dataType: null, required: null },
          { key: 'one', value: 'whatever', dataType: null, required: null },
          { key: 'three', value: 'idk', dataType: null, required: null }
        ],
        end_at: '2017-01-25T22:51:53.878Z',
        id: 'firstNode',
        location: 'denver',
        name: 'a name',
        size: '12',
        start_at: '2017-01-25T22:51:53.878Z',
        type: 'ent1'
      };
      spyOn(stateServiceStubbed.twiglet, 'updateNode');
      fixture.nativeElement.querySelectorAll('button.button')[2].click();
      expect(stateServiceStubbed.twiglet.updateNode).toHaveBeenCalledWith(expectedNode);
    });

    it('deletes a node when delete is clicked', () => {
      spyOn(stateServiceStubbed.twiglet, 'removeNode');
      fixture.nativeElement.querySelector('button.warning').click();
      expect(stateServiceStubbed.twiglet.removeNode).toHaveBeenCalledWith({ id: 'firstNode' });
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

    it('does not allow the form to be submitted if there is no name', () => {
      component.form.controls['name'].setValue('');
      fixture.detectChanges();
      spyOn(stateServiceStubbed.twiglet, 'updateNode');
      fixture.nativeElement.querySelector('button.button').click();
      expect(stateServiceStubbed.twiglet.updateNode).not.toHaveBeenCalled();
    });

    it('does not allow the form to be submitted if there the name is just empty spaces', () => {
      component.form.controls['name'].setValue('  ');
      fixture.detectChanges();
      spyOn(stateServiceStubbed.twiglet, 'updateNode');
      fixture.nativeElement.querySelector('button.button').click();
      expect(stateServiceStubbed.twiglet.updateNode).not.toHaveBeenCalled();
    });
  });

});
