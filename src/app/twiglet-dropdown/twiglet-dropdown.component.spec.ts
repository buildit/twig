/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TwigletDropdownComponent } from './twiglet-dropdown.component';
import { StateService, StateServiceStub } from '../state.service';

describe('TwigletDropdownComponent', () => {
  let component: TwigletDropdownComponent;
  let fixture: ComponentFixture<TwigletDropdownComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletDropdownComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [ { provide: StateService, useValue: stateService} ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the twiglets', () => {
    expect(component.twiglets.length).toEqual(2);
  });

  it('loads a twiglet when a twiglet is selected', () => {
    spyOn(stateService, 'loadTwiglet');
    fixture.nativeElement.querySelector('.dropdown-item').click();
    expect(stateService.loadTwiglet).toHaveBeenCalledWith('id1', 'name1');
  });
});
