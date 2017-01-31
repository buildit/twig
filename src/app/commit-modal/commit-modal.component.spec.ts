/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CommitModalComponent } from './commit-modal.component';
import { StateService } from '../state.service';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('CommitModalComponent', () => {
  let component: CommitModalComponent;
  let fixture: ComponentFixture<CommitModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed},
        NgbActiveModal,
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not submit the form without a commit message', () => {
    component.form.controls['commit'].setValue(null);
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'saveChanges');
    fixture.nativeElement.querySelector('.btn-primary').click();
    expect(stateServiceStubbed.twiglet.saveChanges).not.toHaveBeenCalled();
  });

  it('submits twiglet changes when a commit message is entered', () => {
    component.form.controls['commit'].setValue('commit message');
    spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
    component.saveChanges();
    expect(stateServiceStubbed.twiglet.saveChanges).toHaveBeenCalled();
  });
});
