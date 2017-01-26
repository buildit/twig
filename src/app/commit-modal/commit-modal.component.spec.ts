/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CommitModalComponent } from './commit-modal.component';
import { StateService, StateServiceStub } from '../state.service';

describe('CommitModalComponent', () => {
  let component: CommitModalComponent;
  let fixture: ComponentFixture<CommitModalComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot(), ],
      providers: [
        { provide: StateService, useValue: stateService},
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
    spyOn(stateService.twiglet, 'saveChanges');
    fixture.nativeElement.querySelector('.btn-primary').click();
    expect(stateService.twiglet.saveChanges).not.toHaveBeenCalled();
  });

  it('submits twiglet changes when a commit message is entered', () => {
    component.form.controls['commit'].setValue('commit message');
    fixture.detectChanges();
    spyOn(stateService.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
    fixture.nativeElement.querySelector('.btn-primary').click();
    expect(stateService.twiglet.saveChanges).toHaveBeenCalled();
  });
});
