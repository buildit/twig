import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { ViewsSaveModalComponent } from './views-save-modal.component';

describe('ViewsSaveModalComponent', () => {
  let component: ViewsSaveModalComponent;
  let fixture: ComponentFixture<ViewsSaveModalComponent>;
  let stateService;

  beforeEach(async(() => {
    stateService = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ ViewsSaveModalComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: StateService, useValue: stateService },
        NgbActiveModal,
        { provide: ActivatedRoute, useValue: {
            firstChild: { params: Observable.of({ name: 'name1' }) },
          }
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsSaveModalComponent);
    component = fixture.componentInstance;
    component.views = fromJS([{ name: 'name1' }, { name: 'name2' }]);
    component.viewNames = ['name1', 'name2'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form errors', () => {
    describe('required', () => {
      beforeEach(() => {
        component.name = '';
      });

      it('displays a form error if there is no name', () => {
        component.processForm();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
      });

      it('does not save the view if there is no name', () => {
        spyOn(stateService.twiglet.viewService, 'saveView');
        component.processForm();
        expect(stateService.twiglet.viewService.saveView).not.toHaveBeenCalled();
      });
    });

    describe('/ errors', () => {
      beforeEach(() => {
        component.name = 'name/';
      });

      it('displays a form error if the name includes a /', () => {
        component.processForm();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
      });

      it('does not save the view if the name includes a /', () => {
        spyOn(stateService.twiglet.viewService, 'saveView');
        component.processForm();
        expect(stateService.twiglet.viewService.saveView).not.toHaveBeenCalled();
      });
    });

    describe('? errors', () => {
      beforeEach(() => {
        component.name = 'name?';
      });

      it('displays a form error if the name includes a ?', () => {
        component.processForm();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
      });

      it('does not save the view if the name includes a ?', () => {
        component.processForm();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
      });
    });

    describe('unique', () => {
      beforeEach(() => {
        component.name = 'name1';
      });

      it('displays a form error if the name is not unique', () => {
        component.processForm();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
      });

      it('does not save the view if the name is not unique', () => {
        spyOn(stateService.twiglet.viewService, 'saveView');
        component.processForm();
        expect(stateService.twiglet.viewService.saveView).not.toHaveBeenCalled();
      });
    });
  });

  describe('processForm', () => {
    beforeEach(() => {
      component.name = 'View Name';
    });

    it('calls saveView if there is a url', () => {
      spyOn(stateService.twiglet.viewService, 'saveView').and.returnValue(Observable.of({}));
      component.setup('url', 'name', 'description');
      component.processForm();
      expect(stateService.twiglet.viewService.saveView).toHaveBeenCalled();
    });

    it('calls createView if there is no url', () => {
      spyOn(stateService.twiglet.viewService, 'createView').and.returnValue(Observable.of({}));
      component.processForm();
      expect(stateService.twiglet.viewService.createView).toHaveBeenCalled();
    });
  });
});
