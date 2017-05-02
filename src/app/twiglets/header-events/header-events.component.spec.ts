import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { CreateEventsModalComponent } from './../create-events-modal/create-events-modal.component';
import { HeaderEventsComponent } from './header-events.component';

describe('HeaderEventsComponent', () => {
  let component: HeaderEventsComponent;
  let fixture: ComponentFixture<HeaderEventsComponent>;

  beforeEach(async(() => {
    const stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ HeaderEventsComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed }, ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEventsComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      isPlayingBack: false,
    });
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
