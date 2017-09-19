import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DiscardChangesModalComponent } from './discard-changes-modal.component';

describe('DiscardChangesModalComponent', () => {
  let component: DiscardChangesModalComponent;
  let fixture: ComponentFixture<DiscardChangesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscardChangesModalComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardChangesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('saveChanges', () => {
    it('clicking the close button calls it with false', () => {
      spyOn(component, 'saveChanges');
      fixture.nativeElement.querySelector('.btn-secondary').click();
      expect(component.saveChanges).toHaveBeenCalledWith(false);
    });

    it('clicking the save button calls it with true', () => {
      spyOn(component, 'saveChanges');
      fixture.nativeElement.querySelectorAll('.btn-sm')[1].click();
      expect(component.saveChanges).toHaveBeenCalledWith(true);
    });

    it('closes the modal', () => {
      spyOn(component.activeModal, 'close');
      component.saveChanges(true);
      expect(component.activeModal.close).toHaveBeenCalled();
    });

    it('passes on the discard result', () => {
      component.saveChanges(true);
      component.observable.subscribe(discardResults => {
        expect(discardResults.saveChanges).toEqual(true);
      });
    });
  });
});
