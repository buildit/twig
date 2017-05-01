import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls updateEventSequence on the event service', () => {
    spyOn(stateServiceStubbed.twiglet.eventService, 'updateEventSequence');
    component.updateEventSequence(0, {
      target: {
        checked: true
      }
    });
    expect(stateServiceStubbed.twiglet.eventService.updateEventSequence).toHaveBeenCalledWith(0, true);
  });

  it('calls showEvent on the twiglet service', () => {
    spyOn(stateServiceStubbed.twiglet, 'showEvent');
    component.preview('some id');
    expect(stateServiceStubbed.twiglet.showEvent).toHaveBeenCalledWith('some id');
  });
});
