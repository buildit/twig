import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fromJS, Map, List } from 'immutable';

import { ChangelogListComponent } from './../../shared/changelog-list/changelog-list.component';
import { ModelDetailsComponent } from './model-details.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('ModelDetailsComponent', () => {
  let component: ModelDetailsComponent;
  let fixture: ComponentFixture<ModelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangelogListComponent,
        ModelDetailsComponent
      ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStub() },
        NgbModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDetailsComponent);
    component = fixture.componentInstance;
    component.model = Map({
      name: 'name1'
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('opens the changelog when view changelog is clicked', () => {
    spyOn(component.modalService, 'open').and.returnValue({ componentInstance: { changelog: Map([]) } });
    fixture.nativeElement.querySelector('.clickable').click();
    expect(component.modalService.open).toHaveBeenCalledWith(ChangelogListComponent, { size: 'lg' });
  });
});
