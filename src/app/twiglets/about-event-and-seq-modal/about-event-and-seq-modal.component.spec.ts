import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { AboutEventAndSeqModalComponent } from './about-event-and-seq-modal.component';
import { SanitizeHtmlPipe } from './../../shared/pipes/sanitize-html.pipe';

describe('AboutEventAndSeqModalComponent', () => {
  let component: AboutEventAndSeqModalComponent;
  let fixture: ComponentFixture<AboutEventAndSeqModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutEventAndSeqModalComponent, MarkdownToHtmlPipe, SanitizeHtmlPipe ],
      imports: [ NgbModule.forRoot() ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutEventAndSeqModalComponent);
    component = fixture.componentInstance;
    component.name = 'name1';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays markdown text properly', () => {
    component.description = 'This is **the** description.';
    fixture.detectChanges();
    expect(document.getElementById('description').innerHTML.trim()).toEqual('<p>This is <strong>the</strong> description.</p>');
  });

  it('tells the user there is no description if there is no description', () => {
    fixture.detectChanges();
    expect(document.getElementsByClassName('modal-body')[0].innerHTML)
      .toContain('has no description');
  })
});
