import { FilterImmutablePipe } from './../../shared/pipes/filter-immutable.pipe';
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
      declarations: [ EventsListComponent, FilterImmutablePipe ],
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
        checked: true,
        description: 'about event',
        id: 'id1',
        name: 'event1',
      },
      some_id: {
        checked: true,
        id: 'some_id',
        name: 'some id'
      }
    });
    component.sequences = fromJS([{events: ['some_id']}]);
    component.userState = fromJS({
      currentEvent: 'some_other_id',
      eventFilterText: null,
      user: 'some user',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.currentEvent = 'event1';
    });

    describe('if statement does not match', () => {
      it('does not do anything if the changes do not have a userstate', () => {
        component.ngOnChanges({});
        expect(component.currentEvent).toEqual('event1');
      });

      it('does not do anything if there is no current event', () => {
        component.ngOnChanges({
          userState: {
            currentValue: Map({})
          },
        } as any);
        expect(component.currentEvent).toEqual('event1');
      });

      it('does not do anything if the current event has not changed', () => {
        component.ngOnChanges({
          userState: {
            currentValue: Map({
              currentEvent: 'event1',
            }),
          },
        } as any);
        expect(component.needToScroll).toEqual(false);
      });
    });

    describe('new event id', () => {

      it('updates the currentEvent', () => {
          component.ngOnChanges({
            userState: {
              currentValue: Map({
                currentEvent: 'event2',
              }),
            },
          } as any);
          expect(component.currentEvent).toEqual('event2');
        });

      describe('from playing a sequence', () => {
        beforeEach(() => {
          component.ngOnChanges({
            userState: {
              currentValue: Map({
                currentEvent: 'event2',
              }),
            },
          } as any);
        });

        it('sets needToScroll = true', () => {
          component.userClick = false;
          expect(component.needToScroll).toBeTruthy();
        });
      });

      describe('from user interaction', () => {
        beforeEach(() => {
          component.userClick = true;
          component.ngOnChanges({
            userState: {
              currentValue: Map({
                currentEvent: 'event2',
              }),
            },
          } as any);
        });

        it('does not set needToScroll', () => {
          expect(component.needToScroll).toBeFalsy();
        });

        it('changes userClick to false', () => {
          expect(component.userClick).toBeFalsy();
        });
      });
    });
  });

  describe('ngAfterViewChecked', () => {
    let scrollIntoView;
    beforeEach(() => {
      scrollIntoView = jasmine.createSpy('scrollIntoView');
      component['elementRef'] = {
        nativeElement: {
          querySelector() {
            return {
              scrollIntoView,
            };
          },
        },
      };
    });

    describe('needToScroll is true', () => {
      beforeEach(() => {
        component.needToScroll = true;
        component.ngAfterViewChecked();
      });

      it('sets needToScroll = false', () => {
        expect(component.needToScroll).toBeFalsy();
      });

      it('calls scrollIntoView', () => {

      });
    });
  });

  describe('updateEventSequence', () => {
    it('updates the event sequence', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'updateEventSequence');
      component.updateEventSequence(1, { target: { checked: true, }, });
      expect(stateServiceStubbed.twiglet.eventsService.updateEventSequence).toHaveBeenCalledWith(1, true);
    });
  });

  describe('preview', () => {
    describe('a new event', () => {
      beforeEach(() => {
        spyOn(stateServiceStubbed.twiglet, 'showEvent');
        component.userState = Map({
          currentEvent: 'old id',
        });
        component.preview('new id');
      });

      it('sets userClick to true', () => {
        expect(component.userClick).toBeTruthy();
      });

      it('calls showEvent with the new id', () => {
        expect(stateServiceStubbed.twiglet.showEvent).toHaveBeenCalledWith('new id');
      });
    });

    describe('the already selected event', () => {
      beforeEach(() => {
        spyOn(stateServiceStubbed.twiglet, 'showEvent');
        component.userState = Map({
          currentEvent: 'old id',
        });
        component.preview('old id');
      });

      it('calls showEvent with null', () => {
        expect(stateServiceStubbed.twiglet.showEvent).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('delete event', () => {
    it('opens the delete event modal when the delete icon is clicked', () => {
      spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { eventId: 'id1', resourceName: 'event1' }});
      fixture.nativeElement.querySelector('.fa-trash').click();
      expect(component.modalService.open).toHaveBeenCalledWith(DeleteEventConfirmationComponent);
    });
  });

  describe('original', () => {
    beforeEach(() => {
      spyOn(stateServiceStubbed.twiglet, 'showOriginal');
      component.original();
    });

    it('calls showOriginal', () => {
      expect(stateServiceStubbed.twiglet.showOriginal).toHaveBeenCalled();
    });
  });

  describe('checkAll', () => {
    beforeEach(() => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'setAllCheckedTo');
      component.checkAll({ target: { checked: true }, });
    });

    it('calls setAllCheckedTo', () => {
      expect(stateServiceStubbed.twiglet.eventsService.setAllCheckedTo).toHaveBeenCalledWith(true);
    });
  });

  describe('keyboardDown', () => {
    function event(key, tagName?) {
      return {
        key,
        srcElement: {
          tagName: tagName || 'BODY',
        },
      } as any;
    }
    beforeEach(() => {
      spyOn(stateServiceStubbed.twiglet, 'nextEvent');
      spyOn(stateServiceStubbed.twiglet, 'previousEvent');
    });

    describe('non-listened events', () => {
      it('only fires if the event target is the <BODY>', () => {
        component.keyboardDown(event('ArrowDown', 'NOT BODY'));
        expect(stateServiceStubbed.twiglet.nextEvent).not.toHaveBeenCalled();
      });

      it('only fires if the event target is the <BODY>', () => {
        component.keyboardDown(event('NOT ARROW'));
        expect(stateServiceStubbed.twiglet.nextEvent).not.toHaveBeenCalled();
        expect(stateServiceStubbed.twiglet.previousEvent).not.toHaveBeenCalled();
      });
    });

    describe('arrow keys', () => {
      it('fires nextEvent if ArrowDown', () => {
        component.keyboardDown(event('ArrowDown'));
        expect(stateServiceStubbed.twiglet.nextEvent).toHaveBeenCalled();
      });

      it('fires nextEvent if ArrowRight', () => {
        component.keyboardDown(event('ArrowRight'));
        expect(stateServiceStubbed.twiglet.nextEvent).toHaveBeenCalled();
      });

      it('fires previousEvent if ArrowUp', () => {
        component.keyboardDown(event('ArrowUp'));
        expect(stateServiceStubbed.twiglet.previousEvent).toHaveBeenCalled();
      });

      it('fires previousEvent if ArrowLeft', () => {
        component.keyboardDown(event('ArrowLeft'));
        expect(stateServiceStubbed.twiglet.previousEvent).toHaveBeenCalled();
      });
    });
  });

  describe('showAbout', () => {
    it('opens the about event modal when the name is clicked', () => {
      spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { eventName: 'event1', description: 'about event' }});
      fixture.nativeElement.querySelectorAll('.btn-link')[0].click();
      expect(component.modalService.open).toHaveBeenCalledWith(AboutEventAndSeqModalComponent);
    });
  });


});
