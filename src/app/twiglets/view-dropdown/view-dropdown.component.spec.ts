import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { stateServiceStub, viewsList } from '../../../non-angular/testHelpers';
import { ViewDropdownComponent } from './view-dropdown.component';
import { Map, fromJS } from 'immutable';

describe('ViewDropdownComponent', () => {
  let stateServiceStubbed = stateServiceStub();
  let component: ViewDropdownComponent;
  let fixture: ComponentFixture<ViewDropdownComponent>;

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ ViewDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDropdownComponent);
    component = fixture.componentInstance;
    component.views = viewsList();
    component.twiglet = Map({});
    component.userState = fromJS({
      currentViewName: 'view1',
      user: 'some user',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads a view when that view name is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'loadView');
    fixture.nativeElement.querySelector('span.view-name').click();
    expect(component.loadView).toHaveBeenCalledWith('view1');
  });

  it('loading a view sets the view to the userState', () => {
    fixture.detectChanges();
    spyOn(stateServiceStubbed.userState, 'setCurrentView');
    component.loadView('view1');
    expect(stateServiceStubbed.userState.setCurrentView).toHaveBeenCalledWith('view1');
  });
});
