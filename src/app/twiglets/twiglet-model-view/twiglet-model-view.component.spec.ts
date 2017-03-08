/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Map, fromJS} from 'immutable';
import { DragulaService, DragulaModule } from 'ng2-dragula';

import { fullTwigletMap } from '../../../non-angular/testHelpers';
import { TwigletModelViewComponent } from './twiglet-model-view.component';
import { FontAwesomeIconPickerComponent } from './../../font-awesome-icon-picker/font-awesome-icon-picker.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('TwigletModelViewComponent', () => {
  let component: TwigletModelViewComponent;
  let fixture: ComponentFixture<TwigletModelViewComponent>;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('name1');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletModelViewComponent, FontAwesomeIconPickerComponent ],
      imports: [ ReactiveFormsModule, FormsModule, NgbModule.forRoot(), DragulaModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
        DragulaService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.twiglet = fromJS(fullTwigletMap());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
