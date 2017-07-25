/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';

import { EditLinkModalComponent } from './edit-link-modal.component';
import { fullTwigletMap, stateServiceStub } from '../../../non-angular/testHelpers';
import { StateService } from '../../state.service';

describe('EditLinkModalComponent', () => {
  let component: EditLinkModalComponent;
  let fixture: ComponentFixture<EditLinkModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    TestBed.configureTestingModule({
      declarations: [ EditLinkModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLinkModalComponent);
    component = fixture.componentInstance;
    component.id = 'firstLink';
    component.twiglet = fullTwigletMap();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML rendering', () => {
    it('displays all the attributes a link has', () => {
      const attrs = fixture.nativeElement.querySelectorAll('.attr');
      const firstSet = attrs[0].querySelectorAll('input');
      expect(firstSet[0].value).toEqual('keyOne');
      expect(firstSet[1].value).toEqual('valueOne');
      const secondSet = attrs[1].querySelectorAll('input');
      expect(secondSet[0].value).toEqual('keyTwo');
      expect(secondSet[1].value).toEqual('valueTwo');
    });

    it('displays an empty attribute line', () => {
      const attrs = fixture.nativeElement.querySelectorAll('.attr');
      const emptySet = attrs[2].querySelectorAll('input');
      expect(emptySet[0].value).toEqual('');
      expect(emptySet[1].value).toEqual('');
    });

    it('displays the correct source node', () => {
      expect(component.sourceNode.get('name')).toEqual('firstNodeName');
    });

    it('displays the correct target node', () => {
      expect(component.targetNode.get('name')).toEqual('secondNodeName');
    });
  });

  describe('button clicks', () => {
    it('submits the form to edit a link after removing empty attributes', () => {
      const attrs = <FormArray>component.form.get('attrs');
      attrs.push(component.createAttribute('one', 'whatever'));
      attrs.push(component.createAttribute());
      attrs.push(component.createAttribute('three', 'idk'));
      const expectedLink = {
        association: 'firstLink',
        attrs: [
          { key: 'keyOne', value: 'valueOne' },
          { key: 'keyTwo', value: 'valueTwo' },
          { key: 'one', value: 'whatever' },
          { key: 'three', value: 'idk' }
        ],
        id: 'firstLink',
        source: 'firstNode',
        target: 'secondNode'
      };
      spyOn(stateServiceStubbed.twiglet, 'updateLink');
      fixture.nativeElement.querySelectorAll('button.button')[2].click();
      expect(stateServiceStubbed.twiglet.updateLink).toHaveBeenCalledWith(expectedLink);
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

    it('deletes a link', () => {
      spyOn(stateServiceStubbed.twiglet, 'removeLink');
      fixture.nativeElement.querySelector('#deleteButton').click();
      expect(stateServiceStubbed.twiglet.removeLink).toHaveBeenCalled();
    });
  });
});
