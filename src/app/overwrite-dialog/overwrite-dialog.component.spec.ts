/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OverwriteDialogComponent } from './overwrite-dialog.component';

describe('OverwriteDialogComponent', () => {
  let component: OverwriteDialogComponent;
  let fixture: ComponentFixture<OverwriteDialogComponent>;
  let userResponse;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverwriteDialogComponent ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteDialogComponent);
    component = fixture.componentInstance;
    component.commit = {
      message: 'hello',
      timestamp: '2017-02-09T20:12:33.805Z',
      user: 'test@test.com',
    };
    component.userResponse.subscribe(response => userResponse = response);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clicking yes', () => {
    it('publishes true when the yes button is clicked', () => {
      fixture.nativeElement.querySelector('.button.warning').click();
      expect(userResponse).toBeTruthy();
    });

    it('closes the modal', () => {
      spyOn(component.activeModal, 'close');
      fixture.nativeElement.querySelector('.button.warning').click();
      expect(component.activeModal.close).toHaveBeenCalled();
    });
  });

  describe('clicking no', () => {
    it('publishes false when the no button is clicked', () => {
      fixture.nativeElement.querySelectorAll('.button')[1].click();
      expect(userResponse).toBeFalsy();
    });

    it('closes the modal', () => {
      spyOn(component.activeModal, 'close');
      fixture.nativeElement.querySelectorAll('.button')[1].click();
      expect(component.activeModal.close).toHaveBeenCalled();
    });
  });
});
