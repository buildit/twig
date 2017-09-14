/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { EditNodeModalComponent } from './edit-node-modal.component';
import { fullTwigletMap, fullTwigletModelMap, newNodeTwigletMap } from '../../../non-angular/testHelpers';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';

describe('EditNodeModalComponent', () => {
  let component: EditNodeModalComponent;
  let fixture: ComponentFixture<EditNodeModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    TestBed.configureTestingModule({
      declarations: [ EditNodeModalComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal,
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNodeModalComponent);
    component = fixture.componentInstance;
    component.TWIGLET = TWIGLET_CONSTANTS;
    component.id = 'firstNode';
    component.twiglet = fullTwigletMap();
    component.twigletModel = fullTwigletModelMap();
    component.userState = fromJS({
      gravityPoints: {
        gp1: {
          id: 'gp1', name: 'gp1Name', x: 100, y: 100
        },
        gp2: {
          id: 'gp2', name: 'gp2Name', x: 600, y: 1000,
        }
      }
    });
    fixture.detectChanges();
    component.form.controls['name'].setValue('a name');
    component.form.controls['type'].setValue('ent1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML rendering', () => {
    it('displays all of the attributes the node has', () => {
      const attrs = fixture.nativeElement.querySelectorAll('.attr');
      const firstSet = attrs[0].querySelectorAll('input');
      expect(firstSet[0].value).toEqual('valueOne');
      const thirdSet = attrs[2].querySelectorAll('input');
      expect(thirdSet[0].value).toEqual('keyTwo');
      expect(thirdSet[1].value).toEqual('valueTwo');
    });

    it('displays all of the appropriate select values for node.type and gravity points', () => {
      const selects = fixture.nativeElement.querySelectorAll('option');
      expect(selects.length).toEqual(3);
    });

    it('does not show an error message when the form is valid', () => {
      fixture.nativeElement.querySelector('button.button').click();
    });

    it('displays an error message if the name is blank', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('displays an error message if the required attribute is blank', () => {
      const attrsArray = component.form.controls['attrs'] as FormArray;
      const firstAttrArray = attrsArray.controls[0] as FormArray;
      firstAttrArray.controls['value'].setValue('');
      firstAttrArray.controls['value'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('displays "Add Node" if the node is a new', () => {
      component.newNode = true;
      component.onValueChanged();
      fixture.detectChanges();
      const submitButton = <HTMLButtonElement>fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.innerHTML).toEqual('Add Node');
    });

    it('displays "Update Node" if not given information about the node', () => {
      component.onValueChanged();
      fixture.detectChanges();
      const submitButton = <HTMLButtonElement>fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.innerHTML).toEqual('Update Node');
    });
  });


  // Describe button clicks
  describe('button clicks', () => {
    describe('submit', () => {
      it('submits the form to add a node after removing unused attributes', () => {
        const attrs = <FormArray>component.form.get('attrs');
        attrs.push(component.createAttribute({ key: 'one', value: 'whatever' }));
        attrs.push(component.createAttribute());
        attrs.push(component.createAttribute({ key: 'three', value: 'idk' }));
        const expectedNode = {
          attrs: [
            { key: 'keyOne', value: 'valueOne', dataType: 'string' },
            { key: 'keyExtra', value: '', dataType: 'string' },
            { key: 'keyTwo', value: 'valueTwo', dataType: null },
            { key: 'one', value: 'whatever', dataType: null },
            { key: 'three', value: 'idk', dataType: null }
          ],
          gravityPoint: '',
          id: 'firstNode',
          name: 'a name',
          type: 'ent1',
          x: 100,
          y: 100
        };
        spyOn(stateServiceStubbed.twiglet.modelService, 'updateEntityAttributes');
        spyOn(stateServiceStubbed.twiglet.modelService, 'saveChanges').and.returnValue(Observable.of({}));
        spyOn(stateServiceStubbed.twiglet, 'updateNode');
        fixture.nativeElement.querySelector('button[type="submit"]').click();
        expect(stateServiceStubbed.twiglet.updateNode).toHaveBeenCalledWith(expectedNode);
      });

      it('adds a new attribute to the twiglet model', () => {
        const attrs = <FormArray>component.form.get('attrs');
        attrs.push(component.createAttribute({ key: 'one', value: 'whatever' }));
        spyOn(stateServiceStubbed.twiglet.modelService, 'updateEntityAttributes');
        spyOn(stateServiceStubbed.twiglet.modelService, 'saveChanges').and.returnValue(Observable.of({}));
        fixture.nativeElement.querySelector('button[type="submit"]').click();
        expect(stateServiceStubbed.twiglet.modelService.updateEntityAttributes).toHaveBeenCalled();
      });

      it('does not allow the form to be submitted if there is no name', () => {
        component.form.controls['name'].setValue('');
        fixture.detectChanges();
        spyOn(stateServiceStubbed.twiglet, 'updateNode');
        fixture.nativeElement.querySelector('button.button').click();
        expect(stateServiceStubbed.twiglet.updateNode).not.toHaveBeenCalled();
      });

      it('does not allow the form to be submitted if the name is just empty spaces', () => {
        component.form.controls['name'].setValue('  ');
        fixture.detectChanges();
        spyOn(stateServiceStubbed.twiglet, 'updateNode');
        fixture.nativeElement.querySelector('button.button').click();
        expect(stateServiceStubbed.twiglet.updateNode).not.toHaveBeenCalled();
      });
    });

    describe('delete', () => {
      it('deletes a node when delete is clicked', () => {
        spyOn(stateServiceStubbed.twiglet, 'removeNode');
        fixture.nativeElement.querySelector('#deleteButton').click();
        expect(stateServiceStubbed.twiglet.removeNode).toHaveBeenCalledWith({ id: 'firstNode' });
      });
    });

    describe('attribute buttons', () => {
      it('can toggle the attribute input display', () => {
        fixture.nativeElement.querySelector('.btn-link').click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.fa-plus')).toBeNull();
      });

      it('adds a blank line to add an attribute', () => {
        fixture.nativeElement.querySelector('.fa-plus').click();
        fixture.detectChanges();
        const attrs = fixture.nativeElement.querySelectorAll('.attr');
        expect(attrs.length).toEqual(4);
        const emptySet = attrs[3].querySelectorAll('input');
        expect(emptySet[0].value).toEqual('');
        expect(emptySet[1].value).toEqual('');
      });

      it('removes an attribute', () => {
        fixture.nativeElement.querySelector('.fa-trash').click();
        fixture.detectChanges();
        const attrs = fixture.nativeElement.querySelectorAll('.attr');
        expect(attrs.length).toEqual(2);
        const firstSet = attrs[0].querySelectorAll('input');
        expect(firstSet[0].value).toEqual('valueOne');
      });
    });

    describe('close', () => {
      it('closes the modal is the close button is clicked when the node has a name', () => {
        spyOn(component.activeModal, 'dismiss');
        fixture.nativeElement.querySelector('.close').click();
        expect(component.activeModal.dismiss).toHaveBeenCalled();
      });

      it('discards the new node if the close button is clicked when the node has no name', () => {
        component.twiglet = newNodeTwigletMap();
        component.node = component.twiglet.get(component.TWIGLET.NODES).get('firstNode');
        spyOn(stateServiceStubbed.twiglet, 'removeNode');
        fixture.nativeElement.querySelector('.close').click();
        expect(stateServiceStubbed.twiglet.removeNode).toHaveBeenCalledWith({ id: 'firstNode' });
      });
    });
  });
});
