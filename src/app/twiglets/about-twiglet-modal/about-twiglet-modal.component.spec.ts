import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

fdescribe('AboutTwigletModalComponent', () => {
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('not edit mode', () => {
    beforeEach(() => {
      component.editMode = false;
    });

    it('displays markdown text properly', () => {
      component.twigletName = 'name1';
      component.currentTwiglet = 'name1';
      component.description = 'This is **the** description.';
      component.userState = Map({
        user: 'not null'
      });
      fixture.detectChanges();
      expect(document.getElementById('description').innerHTML.trim()).toEqual('<p>This is <strong>the</strong> description.</p>');
    });

    it('should switch to edit mode when edit icon is clicked', () => {
      component.twigletName = 'name1';
      component.currentTwiglet = 'name1';
      component.description = 'This is **the** description.';
      component.userState = Map({
        user: 'not null'
      });
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.edit').click();
      expect(component.editMode).toEqual(true);
    });

    describe('editing a twiglet description', () => {
      it('offers editing when the user is logged in and the twiglet matches the currently open twiglet', () => {
        component.twigletName = 'name1';
        component.currentTwiglet = 'name1';
        component.userState = Map({
          user: 'not null'
        });
        fixture.detectChanges();
        const offer = <HTMLParagraphElement>fixture.nativeElement.querySelector('.modal-body p');
        expect(offer.innerHTML.trim()).toContain('edit');
      });

      it('makes no offer if there is no user', () => {
        component.twigletName = 'name1';
        component.currentTwiglet = 'name1';
        component.userState = Map({});
        fixture.detectChanges();
        const offer = <HTMLParagraphElement>fixture.nativeElement.querySelector('.modal-body p');
        expect(offer.innerHTML.trim()).not.toContain('edit');
      });

      it('makes no offer if there is already a description', () => {
        component.twigletName = 'name1';
        component.currentTwiglet = 'name1';
        component.description = 'a description';
        component.userState = Map({
          user: 'not null'
        });
        fixture.detectChanges();
        const offer = <HTMLParagraphElement>fixture.nativeElement.querySelector('.modal-body p');
        expect(offer.innerHTML.trim()).not.toContain('edit');
      });

      it('makes no offer if this is not the current twiglet', () => {
        component.twigletName = 'name1';
        component.currentTwiglet = 'name2';
        component.userState = Map({
          user: 'not null'
        });
        fixture.detectChanges();
        const offer = <HTMLParagraphElement>fixture.nativeElement.querySelector('.modal-body p');
        expect(offer.innerHTML.trim()).not.toContain('edit');
      });

      it('does not display an edit button if editableAbout is false', () => {
        spyOn(component, 'editableAbout').and.returnValue(false);
        component.twigletName = 'name1';
        component.currentTwiglet = 'name1';
        component.userState = Map({
          user: 'not null'
        });
        fixture.detectChanges();
        const edit = <HTMLParagraphElement>fixture.nativeElement.querySelector('.modal-footer .edit');
        expect(edit).toBeNull();
      });

      it('displays an edit button if editableAbout is false', () => {
        spyOn(component, 'editableAbout').and.returnValue(true);
        component.twigletName = 'name1';
        component.currentTwiglet = 'name1';
        component.userState = Map({
          user: 'not null'
        });
        fixture.detectChanges();
        const edit = <HTMLParagraphElement>fixture.nativeElement.querySelector('.modal-footer .edit');
        expect(edit).not.toBeNull();
      });
    });
  });

  describe('editMode', () => {
    it('shows the form in edit mode', () => {
      component.editMode = true;
      component.twigletName = 'name1';
      component.currentTwiglet = 'name1';
      component.userState = Map({
        user: 'not null'
      });
      fixture.detectChanges();
      const form = <HTMLFormElement>fixture.nativeElement.querySelector('.modal-body form');
      expect(form).not.toBeNull();
    });

    it('displays a save button in edit mode', () => {
      component.editMode = true;
      component.twigletName = 'name1';
      component.currentTwiglet = 'name1';
      component.userState = Map({
        user: 'not null'
      });
      fixture.detectChanges();
      const save = <HTMLFormElement>fixture.nativeElement.querySelector('.modal-footer .save');
      expect(save).not.toBeNull();
    });
  });

  it('form has the correct description', () => {
    component.twigletName = 'name1';
    component.currentTwiglet = 'name1';
    component.description = 'This is **the** description.';
    component.userState = Map({
      user: 'not null'
    });
    fixture.detectChanges();
    expect(component.form.controls.description.value).toEqual('This is **the** description.');
  });

  it('processes the form when save is clicked', () => {
    component.twigletName = 'name1';
    component.currentTwiglet = 'name1';
    component.description = 'This is **the** description.';
    component.userState = Map({
      user: 'not null'
    });
    fixture.detectChanges();
    spyOn(component, 'processForm');
    fixture.nativeElement.querySelector('.edit').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.save').click();
    expect(component.processForm).toHaveBeenCalled();
  });

  describe('process form', () => {
    beforeEach(() => {
      component.twigletName = 'name1';
      component.currentTwiglet = 'name1';
      component.description = 'This is **the** description.';
      component.userState = Map({
        user: 'not null'
      });
      fixture.detectChanges();
    });
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

  describe('Keyboard Events', () => {
    it('starts editing if the in the correct mode', () => {
      component.editMode = false;
      spyOn(component, 'editableAbout').and.returnValue(true);
      component.keyEvent({ keyCode: 13 } as KeyboardEvent);
      expect(component.editMode).toEqual(true);
    });

    it('closes the modal if not editable and not editing', () => {
      spyOn(component.activeModal, 'close');
      spyOn(component, 'editableAbout').and.returnValue(false);
      component.editMode = false;
      component.keyEvent({ keyCode: 13 } as KeyboardEvent)
      expect(component.activeModal.close).toHaveBeenCalled();
    });
  });
});
