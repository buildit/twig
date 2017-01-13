/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FilterMenuComponent } from './filter-menu.component';
import { StateService, StateServiceStub } from '../state.service';

fdescribe('FilterMenuComponent', () => {
  let component: FilterMenuComponent;
  let fixture: ComponentFixture<FilterMenuComponent>;
  const stateService = new StateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterMenuComponent ],
      imports: [NgbModule.forRoot()],
      providers: [ { provide: StateService, useValue: stateService} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the entities from the model', () => {
    const entities = fixture.nativeElement.querySelectorAll('.dropdown-entity');
    expect(entities.length).toEqual(5);
  });

  it('sets the entity to be filtered to selected entity', () => {
    spyOn(stateService.userState, 'setFilterEntities');
    fixture.nativeElement.querySelector('.dropdown-entity').click();
    expect(stateService.userState.setFilterEntities).toHaveBeenCalledWith(['ent1']);
    fixture.nativeElement.querySelector('.dropdown-entity').click();
  });

  it('when all is clicked, empties filtered entities array to display all types', () => {
    spyOn(stateService.userState, 'setFilterEntities');
    fixture.nativeElement.querySelector('.dropdown-entity').click();
    expect(component.userState.filterEntities.length).toEqual(1);
    fixture.nativeElement.querySelector('.dropdown-item').click();
    expect(stateService.userState.setFilterEntities).toHaveBeenCalledWith([]);
    expect(component.userState.filterEntities.length).toEqual(0);
  });
});
