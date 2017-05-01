import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { CreateEventsModalComponent } from './../create-events-modal/create-events-modal.component';
import { HeaderEventsComponent } from './header-events.component';

describe('HeaderEventsComponent', () => {
  let component: HeaderEventsComponent;
  let fixture: ComponentFixture<HeaderEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderEventsComponent ],
      imports: [ NgbModule.forRoot() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the create event modal when create event is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {}, twiglet: Map({}) });
    fixture.nativeElement.querySelector('.button').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CreateEventsModalComponent);
  });
});
