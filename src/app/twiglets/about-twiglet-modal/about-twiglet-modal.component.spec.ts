import { Twiglet } from './../../../non-angular/interfaces/twiglet/twiglet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AboutTwigletModalComponent } from './about-twiglet-modal.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

fdescribe('AboutTwigletModalComponent', () => {
  let component: AboutTwigletModalComponent;
  let fixture: ComponentFixture<AboutTwigletModalComponent>;
  let compRef;
  const stateServiceStubbed = stateServiceStub();
  stateServiceStubbed.twiglet.loadTwiglet('name1');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTwigletModalComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTwigletModalComponent);
    compRef = fixture.componentRef.hostView['internalView']['compView_0'];
    component = fixture.componentInstance;
    component.twigletName = 'name1';
    component.description = 'This is the description about the Twiglet.';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch to edit mode when edit icon is clicked', () => {
    fixture.nativeElement.querySelector('.fa-pencil').click();
    expect(component.editMode).toEqual(true);
  });

  it('form has the correct description', () => {
    expect(component.form.controls.description.value).toEqual('This is the description about the Twiglet.');
  });

  // describe('process form', () => {
  //   beforeEach(() => {
  //     fixture.nativeElement.querySelector('.fa-pencil').click();
  //     fixture.detectChanges();
  //   });

  //   it('sets the description when save is clicked', () => {
  //     spyOn(component.stateService.twiglet, 'setDescription');
  //     fixture.nativeElement.querySelector('.save').click();
  //     expect(component.stateService.twiglet.setDescription).toHaveBeenCalled();
  //   });

  //   it('saves the updated twiglet', () => {
  //     spyOn(stateServiceStubbed.twiglet, 'saveChanges').and.returnValue({ subscribe: () => {} });
  //     fixture.nativeElement.querySelector('.save').click();
  //     expect(component.stateService.twiglet.saveChanges).toHaveBeenCalled();
  //   });
  // });
});
