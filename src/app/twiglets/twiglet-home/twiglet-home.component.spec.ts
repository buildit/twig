import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { DragulaModule } from 'ng2-dragula';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './../copy-paste-node/copy-paste-node.component';
import { FontAwesomeIconPickerComponent } from './../../shared/font-awesome-icon-picker/font-awesome-icon-picker.component';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { mockToastr, stateServiceStub } from '../../../non-angular/testHelpers';
import { StateService } from './../../state.service';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletGraphComponent } from './../twiglet-graph/twiglet-graph.component';
import { TwigletHomeComponent } from './twiglet-home.component';
import { TwigletModelViewComponent } from './../twiglet-model-view/twiglet-model-view.component';

describe('TwigletHomeComponent', () => {
  let component: TwigletHomeComponent;
  let fixture: ComponentFixture<TwigletHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        FontAwesomeIconPickerComponent,
        HeaderTwigletComponent,
        HeaderTwigletEditComponent,
        TwigletDropdownComponent,
        TwigletHomeComponent,
        TwigletGraphComponent,
        TwigletModelViewComponent,
      ],
      imports: [
        DragulaModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStub() },
        { provide: Router, useValue: { url: '/twiglet' } },
        { provide: ToastsManager, useValue: mockToastr },
        { provide: ActivatedRoute, useValue: {
            firstChild: { params: Observable.of({name: 'name1'}) },
            params: Observable.of({name: 'name1'}),
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getTwigletGraphClass', () => {
    it('returns "show" if not editing the twiglet model', () => {
      component.userState = fromJS({
        editTwigletModel: false,
        mode: 'twiglet',
      });
      expect(component.getTwigletGraphClass()).toEqual('show');
    });

    it('returns "no-show" if editing the twiglet model', () => {
      component.userState = fromJS({
        editTwigletModel: true,
      });
      expect(component.getTwigletGraphClass()).toEqual('no-show');
    });
  });

  describe('getTwigletModelClass', () => {
    it('returns "show" if editing the twiglet model', () => {
      component.userState = fromJS({
        editTwigletModel: true,
      });
      expect(component.getTwigletModelClass()).toEqual('show');
    });

    it('returns "no-show" if not editing the twiglet model', () => {
      component.userState = fromJS({
        editTwigletModel: false,
      });
      expect(component.getTwigletModelClass()).toEqual('no-show');
    });
  });
});
