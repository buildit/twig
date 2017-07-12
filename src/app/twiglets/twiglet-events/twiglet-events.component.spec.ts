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
  let stateServiceStubbed: StateService;

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
      imports: [ NgbModule.forRoot(), FormsModule ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletEventsComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      isPlayingBack: false,
      user: 'some user'
    });
    component.sequences = List([]);
    component.eventsList = fromJS({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the create event modal when create event is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {}, twiglet: Map({}) });
    fixture.nativeElement.querySelector('.clickable.button').click();
    expect(component.modalService.open).toHaveBeenCalledWith(EditEventsAndSeqModalComponent);
  });

  it('starts playback', () => {
    spyOn(stateServiceStubbed.twiglet, 'playSequence');
    fixture.nativeElement.querySelectorAll('.button')[1].click();
    expect(stateServiceStubbed.twiglet.playSequence).toHaveBeenCalled();
  });

  it('stops playback', () => {
    component.userState = component.userState.set('isPlayingBack', true);
    component['cd'].markForCheck();
    fixture.detectChanges();
    spyOn(stateServiceStubbed.twiglet, 'stopPlayback');
    fixture.nativeElement.querySelectorAll('.button')[1].click();
    expect(stateServiceStubbed.twiglet.stopPlayback).toHaveBeenCalled();
  });

  it('should change the playbackInterval', () => {
    spyOn(stateServiceStubbed.userState, 'setPlaybackInterval');
    component.setPlaybackInterval(1.2);
    expect(stateServiceStubbed.userState.setPlaybackInterval).toHaveBeenCalledWith(1200);
  });

});
