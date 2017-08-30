import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { AboutTwigletModalComponent } from './../about-twiglet-modal/about-twiglet-modal.component';
import { ChangelogListComponent } from './../../shared/changelog-list/changelog-list.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletDetailsComponent } from './twiglet-details.component';

describe('TwigletsDetailsComponent', () => {
  let component: TwigletDetailsComponent;
  let fixture: ComponentFixture<TwigletDetailsComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletDetailsComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletDetailsComponent);
    component = fixture.componentInstance;
    component.twiglet = Map({
      name: 'name1'
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('opens the about twiglet modal when the about button is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({
      componentInstance: { twigletName: 'name1', description: 'description', currentTwiglet: 'name1' }
    });
    fixture.nativeElement.querySelector('.about').click();
    expect(component.modalService.open).toHaveBeenCalledWith(AboutTwigletModalComponent, { size: 'lg' });
  });

  it('opens the changelog modal when the changelog button is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: {} });
    fixture.nativeElement.querySelector('.changelog').click();
    expect(component.modalService.open).toHaveBeenCalledWith(ChangelogListComponent, { size: 'lg' });
  });
});
