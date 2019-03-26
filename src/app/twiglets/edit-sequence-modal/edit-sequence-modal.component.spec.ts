import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService,  } from 'ngx-toastr';
import { Map, List, fromJS, OrderedMap } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { EditSequenceModalComponent } from './edit-sequence-modal.component';
import { FilterImmutableByBoolPipe } from './../../shared/pipes/filter-immutable-by-bool.pipe';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EditSequenceModalComponent', () => {
  let component: EditSequenceModalComponent;
  let fixture: ComponentFixture<EditSequenceModalComponent>;
  const stateServiceStubbed = stateServiceStub();
  let toastrServiceSpy: SpyObj<any>;

  beforeEach(async(() => {
    toastrServiceSpy = createSpyObj(['success', 'error']);

    stateServiceStubbed.twiglet.loadTwiglet('name1').subscribe((response) => {
      TestBed.configureTestingModule({
        declarations: [ EditSequenceModalComponent, FilterImmutableByBoolPipe ],
        imports: [ FormsModule, ReactiveFormsModule ],
        providers: [
          { provide: StateService, useValue: stateServiceStubbed },
          FormBuilder,
          NgbActiveModal,
          { provide: ToastrService, useValue: toastrServiceSpy},
        ]
      })
      .compileComponents();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSequenceModalComponent);
    component = fixture.componentInstance;
    component.eventsList = fromJS({
      id1: {
        description: 'about event',
        id: 'id1',
        name: 'event1',
      },
      some_id: {
        id: 'some_id',
        memberOf: ['some sequence'],
        name: 'some id',
      },
      some_id2: {
        id: 'some_id2',
        memberOf: ['some sequence'],
        name: 'some id2',
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewChecked', () => {
    it('does nothing if the form does not exist yet', () => {
      delete component.form;
      expect(component.ngAfterViewChecked()).toBe(false);
    });

    it('subscribes to form changes if the form exists', () => {
      spyOn(component.form.valueChanges, 'subscribe');
      component.ngAfterViewChecked();
      expect(component.form.valueChanges.subscribe).toHaveBeenCalled();
    });
  });

  describe('displays error message', () => {
    it('shows an error if the name is blank', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      component['cd'].markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    });

    it('shows no errors if the name validates', () => {
      component.form.controls['name'].setValue('name3');
      component.form.controls['name'].markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.alert-sm')).toBeFalsy();
    });
  });

  describe('button clicks', () => {
    it('can add all the events to the sequence', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'setAllCheckedTo');
      fixture.nativeElement.querySelector('.fa-forward').click();
      expect(stateServiceStubbed.twiglet.eventsService.setAllCheckedTo).toHaveBeenCalledWith(true);
    });

    it('can remove all the events from the sequence', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'setAllCheckedTo');
      fixture.nativeElement.querySelector('.fa-forward').click();
      fixture.nativeElement.querySelector('.fa-backward').click();
      expect(stateServiceStubbed.twiglet.eventsService.setAllCheckedTo).toHaveBeenCalledWith(false);
    });

    it('can add events one at a time', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'checkEvent');
      component.form.controls['availableEvents'].setValue(['id1']);
      fixture.nativeElement.querySelector('.fa-play').click();
      expect(stateServiceStubbed.twiglet.eventsService.checkEvent).toHaveBeenCalledWith('id1', true);
    });

    it('can add multiple events', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'checkEvent');
      component.form.controls['availableEvents'].setValue(['id1', 'some_id2']);
      fixture.nativeElement.querySelector('.fa-play').click();
      expect(stateServiceStubbed.twiglet.eventsService.checkEvent).toHaveBeenCalledWith('id1', true);
      expect(stateServiceStubbed.twiglet.eventsService.checkEvent).toHaveBeenCalledWith('some_id2', true);
    });

    it('can remove events one at a time', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'checkEvent');
      component.form.controls['eventsInSequence'].setValue(['id1']);
      fixture.nativeElement.querySelector('.fa-play.fa-rotate-180').click();
      expect(stateServiceStubbed.twiglet.eventsService.checkEvent).toHaveBeenCalledWith('id1', false);
    });

    it('can remove multiple events', () => {
      spyOn(stateServiceStubbed.twiglet.eventsService, 'checkEvent');
      component.form.controls['eventsInSequence'].setValue(['id1', 'some_id2']);
      fixture.nativeElement.querySelector('.fa-play.fa-rotate-180').click();
      expect(stateServiceStubbed.twiglet.eventsService.checkEvent).toHaveBeenCalledWith('id1', false);
      expect(stateServiceStubbed.twiglet.eventsService.checkEvent).toHaveBeenCalledWith('some_id2', false);
    });
  });

  describe('process form', () => {
    beforeEach(() => {
      component.form.controls['name'].setValue('sequence name');
      component.form.controls['name'].markAsDirty();
      fixture.detectChanges();
    });

    describe('success', () => {
      it('submits the new sequence', () => {
        spyOn(stateServiceStubbed.twiglet.eventsService, 'createSequence').and.returnValue({ subscribe: () => {} });
        component.form.controls['eventsInSequence'].setValue(['id1']);
        component.form.controls['availableEvents'].setValue(['some_id']);
        component.processForm();
        expect(stateServiceStubbed.twiglet.eventsService.createSequence).toHaveBeenCalledWith({
          availableEvents: ['some_id'],
          description: '',
          eventsInSequence: ['id1'],
          id: '',
          name: 'sequence name',
        });
      });

      it('closes the modal', () => {
        spyOn(stateServiceStubbed.twiglet.eventsService, 'createSequence').and.returnValue(Observable.of({}));
        spyOn(component.activeModal, 'close');
        component.processForm();
        expect(component.activeModal.close).toHaveBeenCalled();
      });
    });

    describe('errors', () => {
      beforeEach(() => {
        spyOn(console, 'error');
        spyOn(component.activeModal, 'close');
        spyOn(component.stateService.twiglet.eventsService, 'createSequence').and.returnValue(Observable.throw({statusText: 'whatever'}));
        component.processForm();
      });

      it('does not close the modal', () => {
        expect(component.activeModal.close).not.toHaveBeenCalled();
      });

      it('displays an error message', () => {
        expect(component.toastr.error).toHaveBeenCalled();
      });
    });
  });
});
