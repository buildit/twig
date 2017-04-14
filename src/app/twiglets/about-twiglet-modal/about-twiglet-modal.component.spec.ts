import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { AboutTwigletModalComponent } from './about-twiglet-modal.component';
import { SanitizeHtmlPipe } from './../../shared/pipes/sanitize-html.pipe';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('AboutTwigletModalComponent', () => {
  let component: AboutTwigletModalComponent;
  let fixture: ComponentFixture<AboutTwigletModalComponent>;
  let compRef;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('name1');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTwigletModalComponent, MarkdownToHtmlPipe, SanitizeHtmlPipe ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTwigletModalComponent);
    compRef = fixture.componentRef.hostView['internalView']['compView_0'];
    component = fixture.componentInstance;
    component.twigletName = 'name1';
    component.description = 'This is **the** description.';
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
});
