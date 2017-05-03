import { DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map } from 'immutable';

import { DeleteViewConfirmationComponent } from './../../shared/delete-confirmation/delete-view-confirmation.component';
import { SortImmutablePipe } from './../../shared/pipes/sort-immutable.pipe';
import { StateService } from './../../state.service';
import { stateServiceStub, viewsList } from '../../../non-angular/testHelpers';
import { SequenceDropdownComponent } from './sequence-dropdown.component';
import { CreateEventsModalComponent } from './../create-events-modal/create-events-modal.component';

describe('SequenceDropdownComponent', () => {
  let component: SequenceDropdownComponent;
  let fixture: ComponentFixture<SequenceDropdownComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceDropdownComponent, SortImmutablePipe ],
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
    fixture = TestBed.createComponent(SequenceDropdownComponent);
    component = <SequenceDropdownComponent>fixture.componentInstance;
    component.sequences = fromJS([
      {
        id: 'seq1',
        name: 'first sequence'
      },
      {
        id: 'seq2',
        name: 'second sequence',
      }
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of the sequences', () => {
    expect(fixture.nativeElement.querySelectorAll('li.sequence-list-item').length).toEqual(2);
  });

  it('opens a new sequence modal when new sequence is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {} });
    fixture.nativeElement.querySelector('.dropdown-item').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CreateEventsModalComponent);
  });

  it('loads a sequence when that sequence name is clicked', () => {
    spyOn(component, 'loadSequence');
    fixture.nativeElement.querySelector('.clickable.col-6').click();
    expect(component.loadSequence).toHaveBeenCalledWith('seq1');
  });

  it('opens the save sequence modal when the overwrite icon is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { setup: () => {} } });
    fixture.nativeElement.querySelector('.fa-floppy-o').click();
    expect(component.modalService.open).toHaveBeenCalledWith(CreateEventsModalComponent);
  });

  it('opens the delete sequence modal when the delete icon is clicked', () => {

  });
});
