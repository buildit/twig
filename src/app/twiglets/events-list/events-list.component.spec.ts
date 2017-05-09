import { NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map, List, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { AboutEventAndSeqModalComponent } from './../about-event-and-seq-modal/about-event-and-seq-modal.component';
import { DeleteEventConfirmationComponent } from './../../shared/delete-confirmation/delete-event-confirmation.component';
import { EventsListComponent } from './events-list.component';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { StateService } from './../../state.service';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsListComponent ],
      imports: [ NgbModule.forRoot(), NgbTooltipModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbTooltipConfig,
        NgbModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    component.eventsList = fromJS({
      id1: {
        description: 'about event',
        id: 'id1',
        name: 'event1',
      },
      some_id: {
        id: 'some_id',
        name: 'some id'
      }
    });
    component.sequences = fromJS([{events: ['some_id']}]);
    component.userState = fromJS({
      currentEvent: 'some_other_id'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls updateEventSequence on the event service', () => {
    spyOn(stateServiceStubbed.twiglet.eventsService, 'updateEventSequence');
    component.updateEventSequence(0, {
      target: {
        checked: true
      }
    });
    expect(stateServiceStubbed.twiglet.eventsService.updateEventSequence).toHaveBeenCalledWith(0, true);
  });

  it('calls showEvent on the twiglet service', () => {
    spyOn(stateServiceStubbed.twiglet, 'showEvent');
    component.preview('some_id');
    expect(stateServiceStubbed.twiglet.showEvent).toHaveBeenCalledWith('some_id');
  });

  it('opens the about event modal when the name is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { eventName: 'event1', description: 'about event' }});
    fixture.nativeElement.querySelectorAll('.btn-link')[0].click();
    expect(component.modalService.open).toHaveBeenCalledWith(AboutEventAndSeqModalComponent);
  });

  describe('delete event', () => {
    it('opens the delete event modal when the delete icon is clicked', () => {
      spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { eventId: 'id1', resourceName: 'event1' }});
      fixture.nativeElement.querySelector('.fa-trash').click();
      expect(component.modalService.open).toHaveBeenCalledWith(DeleteEventConfirmationComponent);
    });
  });
});
