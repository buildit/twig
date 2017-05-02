import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Map, List, fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

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
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    component.eventsList = fromJS({ id1: { id: 'id1', name: 'event1'}, some_id: { id: 'some_id', name: 'some id'}});
    component.sequences = fromJS([{events: ['some_id']}]);
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

  describe('inEventSequence', () => {
    it('returns true if the event is in a sequence', () => {
      expect(component.inEventSequence('some_id')).toEqual(true);
    });
  });

  describe('delete event', () => {
    it('calls delete event', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'deleteEvent').and.returnValue(Observable.of({}));
      component.deleteEvent('id1');
      expect(stateServiceStubbed.twiglet.eventsService.deleteEvent).toHaveBeenCalledWith('id1');
    });
  });
});
