import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, List, Map } from 'immutable';

import { EditEventsAndSeqModalComponent } from './../edit-events-and-seq-modal/edit-events-and-seq-modal.component';
import { EventsListComponent } from './../events-list/events-list.component';
import { FilterImmutablePipe } from './../../shared/pipes/filter-immutable.pipe';
import { SequenceListComponent } from './../sequence-list/sequence-list.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletEventsComponent } from './twiglet-events.component';
import { TwigletFilterTargetComponent } from './../twiglet-filter-target/twiglet-filter-target.component';

describe('TwigletEventsComponent', () => {
  let component: TwigletEventsComponent;
  let fixture: ComponentFixture<TwigletEventsComponent>;
  let stateServiceStubbed = stateServiceStub()

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        EventsListComponent,
        FilterImmutablePipe,
        SequenceListComponent,
        SortImmutablePipe,
        TwigletEventsComponent,
      ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletEventsComponent);
    component = fixture.componentInstance;
    component.sequences = List([]);
    component.eventsList = fromJS({});
  });

  it('should create', () => {
    component.userState = Map({
      isPlayingBack: false,
      user: 'some user',
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('opens the create event modal when create event is clicked', () => {
    component.userState = Map({
      isPlayingBack: false,
      user: 'some user',
    });
    fixture.detectChanges();
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {}, twiglet: Map({}) });
    fixture.nativeElement.querySelector('.clickable.button').click();
    expect(component.modalService.open).toHaveBeenCalledWith(EditEventsAndSeqModalComponent);
  });

  it('can step backwards', () => {
    component.userState = Map({
      isPlayingBack: false,
      user: 'some user',
    });
    fixture.detectChanges();
    const prev = spyOn(stateServiceStubbed.twiglet, 'previousEvent');
    fixture.nativeElement.querySelector('.fa.fa-backward').click();
    expect(prev).toHaveBeenCalled();
  });

  it('can step forwards', () => {
    component.userState = Map({
      isPlayingBack: false,
      user: 'some user',
    });
    fixture.detectChanges();
    const next = spyOn(stateServiceStubbed.twiglet, 'nextEvent');
    fixture.nativeElement.querySelector('.fa.fa-forward').click();
    expect(next).toHaveBeenCalled();
  });

  it('starts playback', () => {
    component.userState = Map({
      isPlayingBack: false,
      user: 'some user',
    });
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'playSequence');
    fixture.nativeElement.querySelectorAll('.button')[1].click();
    expect(stateServiceStubbed.twiglet.playSequence).toHaveBeenCalled();
  });

  it('stops playback', () => {
    component.userState = Map({
      isPlayingBack: false,
      user: 'some user',
    });
    fixture.detectChanges();
    component.userState = component.userState.set('isPlayingBack', true);
    component['cd'].markForCheck();
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'stopPlayback');
    fixture.nativeElement.querySelectorAll('.button')[1].click();
    expect(stateServiceStubbed.twiglet.stopPlayback).toHaveBeenCalled();
  });

  it('should change the playbackInterval', () => {
    component.userState = Map({
      isPlayingBack: true,
      user: 'some user',
    });
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'setPlaybackInterval');
    component.setPlaybackInterval(1.2);
    expect(stateServiceStubbed.userState.setPlaybackInterval).toHaveBeenCalledWith(1200);
  });

  describe('render', () => {
    describe('playback mode', () => {
      describe('is playing back', () => {
        it('does not show the play button', () => {
          component.userState = Map({
            isPlayingBack: true,
            user: 'some user',
          });
          fixture.detectChanges();
          expect(fixture.nativeElement.querySelector('.fa-play')).toBeFalsy();
        });

        it('shows the stop button', () => {
          component.userState = Map({
            isPlayingBack: true,
            user: 'some user',
          });
          fixture.detectChanges();
          expect(fixture.nativeElement.querySelector('.fa-stop')).toBeTruthy();
        });
      });

      describe('is not playing back', () => {
        it('shows the play button', () => {
          component.userState = Map({
            isPlayingBack: false,
            user: 'some user',
          });
          fixture.detectChanges();
          expect(fixture.nativeElement.querySelector('.fa-play')).toBeTruthy();
        });

        it('does not shows the stop button', () => {
          component.userState = Map({
            isPlayingBack: false,
            user: 'some user',
          });
          fixture.detectChanges();
          expect(fixture.nativeElement.querySelector('.fa-stop')).toBeFalsy();
        });
      });
    });

    describe('event creation', () => {
      it('shows the button when the user is logged in', () => {
        component.userState = Map({
          isPlayingBack: false,
          user: 'some user',
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('i.fa-plus.event')).toBeTruthy();
      });

      it('hides the button when the user is not logged in', () => {
        component.userState = Map({
          isPlayingBack: false,
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('i.fa-plus.event')).toBeFalsy();
      });
    });
  });
});
