import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';

import { AboutEventAndSeqModalComponent } from './../about-event-and-seq-modal/about-event-and-seq-modal.component';
import { DeleteSequenceConfirmationComponent } from './../../shared/delete-confirmation/delete-sequence-confirmation.component';
import { EditEventsAndSeqModalComponent } from './../edit-events-and-seq-modal/edit-events-and-seq-modal.component';
import { SequenceListComponent } from './sequence-list.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('SequenceListComponent', () => {
  let component: SequenceListComponent;
  let fixture: ComponentFixture<SequenceListComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceListComponent, SortImmutablePipe ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') }},
        { provide: StateService, useValue: stateServiceStubbed },
        NgbModal,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceListComponent);
    component = <SequenceListComponent>fixture.componentInstance;
    component.sequences = fromJS([
      {
        description: 'description',
        id: 'seq1',
        name: 'first sequence'
      },
      {
        id: 'seq2',
        name: 'second sequence',
      }
    ]);
    component.userState = Map({
      user: 'some user',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of the sequences', () => {
    expect(fixture.nativeElement.querySelectorAll('li.list-group-item').length).toEqual(2);
  });

  it('opens a new sequence modal when new sequence is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {} });
    fixture.nativeElement.querySelector('.pull-right').click();
    expect(component.modalService.open).toHaveBeenCalledWith(EditEventsAndSeqModalComponent);
  });

  it('loads a sequence when that sequence name is clicked', () => {
    spyOn(component, 'loadSequence');
    fixture.nativeElement.querySelector('.sequence-name').click();
    expect(component.loadSequence).toHaveBeenCalledWith('seq1');
  });

  it('opens the save sequence modal when the overwrite icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setup: () => {} } });
    fixture.nativeElement.querySelector('.fa-floppy-o').click();
    expect(component.modalService.open).toHaveBeenCalledWith(EditEventsAndSeqModalComponent);
  });

  it('opens the about sequence modal when the about icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { name: 'seq1', description: 'description' }
    });
    fixture.nativeElement.querySelector('.fa-info-circle').click();
    expect(component.modalService.open).toHaveBeenCalledWith(AboutEventAndSeqModalComponent);
  });

  it('opens the delete sequence modal when the delete icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { sequenceId: 'seq1', resourceName: 'first sequence' }});
    fixture.nativeElement.querySelector('.fa-trash').click();
    expect(component.modalService.open).toHaveBeenCalledWith(DeleteSequenceConfirmationComponent);
  });
});
