import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
      providers: [{ provide: StateService, useValue: stateService }, NgbActiveModal],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsSaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('action', () => {
    it('calls saveView if there is a url', () => {
      spyOn(stateService.twiglet.viewService, 'saveView').and.returnValue(Observable.of({}));
      component.setup('url', 'name', 'description');
      component.action();
      expect(stateService.twiglet.viewService.saveView).toHaveBeenCalled();
    });

    it('calls createView if there is no url', () => {
      spyOn(stateService.twiglet.viewService, 'createView').and.returnValue(Observable.of({}));
      component.action();
      expect(stateService.twiglet.viewService.createView).toHaveBeenCalled();
    });
  });
});
