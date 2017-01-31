import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateService } from './../state.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditTwigletDetailsComponent } from './edit-twiglet-details.component';
import { stateServiceStub } from '../../non-angular/testHelpers';

describe('EditTwigletDetailsComponent', () => {
  let component: EditTwigletDetailsComponent;
  let fixture: ComponentFixture<EditTwigletDetailsComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTwigletDetailsComponent ],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTwigletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
