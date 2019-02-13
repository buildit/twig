import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService, ToastOptions } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

import { CreateEventModalComponent } from './create-event-modal.component';
import { StateService } from '../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('CreateEventModalComponent', () => {
  let component: CreateEventModalComponent;
  let fixture: ComponentFixture<CreateEventModalComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1').subscribe((response) => {
      TestBed.configureTestingModule({
        declarations: [ CreateEventModalComponent ],
        imports: [ FormsModule, ReactiveFormsModule ],
        providers: [
          { provide: StateService, useValue: stateServiceStubbed },
          FormBuilder,
          NgbActiveModal,
          ToastrService,
          ToastOptions
        ]
      })
      .compileComponents();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventModalComponent);
    component = fixture.componentInstance;
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

  describe('onValueChanged', () => {
    it('does nothing if the form does not exist', () => {
      delete component.form;
      expect(component.onValueChanged()).toBe(false);
    });

    it('checks for errors if the form exists', () => {
      expect(component.onValueChanged()).toBe(true);
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

  describe('process form', () => {
    beforeEach(() => {
      component.form.controls['name'].setValue('event name');
      component.form.controls['name'].markAsDirty();
      spyOn(component.toastr, 'success');
      fixture.detectChanges();
    });

    describe('success', () => {
      it('submits the new event', () => {
        spyOn(stateServiceStubbed.twiglet.eventsService, 'createEvent').and.returnValue({ subscribe: () => {} });
        component.processForm();
        expect(stateServiceStubbed.twiglet.eventsService.createEvent).toHaveBeenCalledWith({ id: '', name: 'event name', description: '' });
      });

      it('closes the modal', () => {
        spyOn(component.activeModal, 'close');
        component.processForm();
        expect(component.activeModal.close).toHaveBeenCalled();
      });
    });

    describe('errors', () => {
      beforeEach(() => {
        spyOn(console, 'error');
        spyOn(component.activeModal, 'close');
        spyOn(component.toastr, 'error');
        spyOn(component.stateService.twiglet.eventsService, 'createEvent').and.returnValue(Observable.throw({statusText: 'whatever'}));
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
