/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EditNodeModalComponent } from './edit-node-modal.component';
import { StateService, StateServiceStub } from '../state.service';

fdescribe('EditNodeModalComponent', () => {
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
    let attrs = <FormArray>component.form.get('attrs');
    attrs.push(component.createAttribute('one', 'whatever'));
    attrs.push(component.createAttribute());
    attrs.push(component.createAttribute('three', 'idk'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // HTML rendering test - describe

  // Describe button clicks - submit and delete 

  it('submits the form to add a node after removing unused attributes', () => {
    const expectedNode = {
      attrs: [{ key: 'one', value: 'whatever' }, { key: 'three', value: 'idk' }],
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
});
