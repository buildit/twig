import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';
import { Observable } from 'rxjs/Observable';

import { AboutTwigletModalComponent } from './about-twiglet-modal.component';
import { handleError } from '../../../non-angular/services-helpers/httpHelpers';
import { router, stateServiceStub } from '../../../non-angular/testHelpers';
import { SanitizeHtmlPipe } from './../../shared/pipes/sanitize-html.pipe';
import { StateService } from './../../state.service';

describe('AboutTwigletModalComponent', () => {
  let component: AboutTwigletModalComponent;
  let fixture: ComponentFixture<AboutTwigletModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    TestBed.configureTestingModule({
      declarations: [ AboutTwigletModalComponent, MarkdownToHtmlPipe, SanitizeHtmlPipe ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        {provide: Router, useValue: router() },
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTwigletModalComponent);
    component = fixture.componentInstance;
    component.twigletName = 'name1';
    component.description = 'This is **the** description.';
    component.userState = Map({
      user: 'not null'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays markdown text properly', () => {
    expect(document.getElementById('description').innerHTML.trim()).toEqual('<p>This is <strong>the</strong> description.</p>');
  });

  it('should switch to edit mode when edit icon is clicked', () => {
    fixture.nativeElement.querySelector('.edit').click();
    expect(component.editMode).toEqual(true);
  });

  it('form has the correct description', () => {
    expect(component.form.controls.description.value).toEqual('This is **the** description.');
  });

  it('processes the form when save is clicked', () => {
    spyOn(component, 'processForm');
    fixture.nativeElement.querySelector('.edit').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.save').click();
    expect(component.processForm).toHaveBeenCalled();
  });

  describe('process form', () => {
    it('sets the description of the current twiglet', () => {
      spyOn(stateServiceStubbed.twiglet, 'setDescription');
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
      component.processForm();
      expect(stateServiceStubbed.twiglet.setDescription).toHaveBeenCalled();
    });

    it('updates the list of twiglets', () => {
      spyOn(stateServiceStubbed.twiglet, 'updateListOfTwiglets');
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.of({}));
      component.processForm();
      expect(stateServiceStubbed.twiglet.updateListOfTwiglets).toHaveBeenCalled();
    });

    it('refreshes the changelog', () => {
      spyOn(stateServiceStubbed.twiglet.changeLogService, 'refreshChangelog');
      spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue(Observable.of({}));
      component.processForm();
      expect(stateServiceStubbed.twiglet.changeLogService.refreshChangelog).toHaveBeenCalled();
    });
  });
});
