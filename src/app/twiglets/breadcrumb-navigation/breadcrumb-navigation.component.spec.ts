import { Observable } from 'rxjs/Observable';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewDropdownComponent } from './../view-dropdown/view-dropdown.component';
import { Map, List, fromJS } from 'immutable';
import { Router } from '@angular/router';
import { StateService } from './../../state.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbNavigationComponent } from './breadcrumb-navigation.component';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';

describe('BreadcrumbNavigationComponent', () => {
  let component: BreadcrumbNavigationComponent;
  let fixture: ComponentFixture<BreadcrumbNavigationComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  }
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbNavigationComponent, ViewDropdownComponent ],
      imports: [
        NgbModule.forRoot(),
      ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: mockRouter },
        NgbModal
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbNavigationComponent);
    component = fixture.componentInstance;
    component.userState = Map({});
    component.twiglet = Map({
      name: 'a name'
    });
    component.eventsList = fromJS({
      'a uuid': {
        name: 'an eventName'
      }
    });
    component.views = List([]);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('going home', () => {
    it('sets the currentEvent to null', async(() => {
      spyOn(stateServiceStubbed.twiglet, 'loadTwiglet').and.returnValue(Observable.of({}));
      spyOn(component, 'canGoToDefault').and.returnValue(true);
      stateServiceStubbed.userState.setCurrentEvent('an event');
      fixture.detectChanges();
      fixture.nativeElement.querySelector('span.twiglet-name').click();
      stateServiceStubbed.userState.observable.subscribe(response => {
        expect(response.get(USERSTATE.CURRENT_VIEW_NAME)).toBeFalsy();
      });
    }));

    it('navigates to the default twiglet page if there is a view loaded', async(() => {
      spyOn(component, 'canGoToDefault').and.returnValue(true);
      component.userState = component.userState.set(USERSTATE.CURRENT_VIEW_NAME, 'a name');
      fixture.detectChanges();
      fixture.nativeElement.querySelector('span.twiglet-name').click();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/twiglet', 'a name']);
    }));

    it('reloads the twiglet for anything else', async(() => {
      spyOn(component, 'canGoToDefault').and.returnValue(true);
      spyOn(stateServiceStubbed.twiglet, 'loadTwiglet').and.returnValue(Observable.of({}));
      fixture.detectChanges();
      fixture.nativeElement.querySelector('span.twiglet-name').click();
      expect(stateServiceStubbed.twiglet.loadTwiglet).toHaveBeenCalledWith('a name');
    }));

    it('does nothing if canGoToDefault returns false', () => {
      spyOn(component, 'canGoToDefault').and.returnValue(false);
      spyOn(component, 'goHome');
      fixture.detectChanges();
      fixture.nativeElement.querySelector('span.twiglet-name').click();
      expect(component.goHome).not.toHaveBeenCalled();

    })
  });

  describe('canGoToDefault', () => {
    it('returns true if there is a view name', () => {
      component.userState = component.userState.set(USERSTATE.CURRENT_VIEW_NAME, 'a name');
      fixture.detectChanges();
      expect(component.canGoToDefault()).toBeTruthy();
    });

    it('returns true if there is a event id', () => {
      component.userState = component.userState.set(USERSTATE.CURRENT_EVENT, 'a uuid');
      fixture.detectChanges();
      expect(component.canGoToDefault()).toBeTruthy();
    });

    it('returns false if neither of the above are true', () => {
      fixture.detectChanges();
      expect(component.canGoToDefault()).toBeFalsy();
    });
  });

  describe('displays the appropriate event name if an event is picked', () => {
    it('displays the event name if there is one', () => {
      component.userState = component.userState.set(USERSTATE.CURRENT_EVENT, 'a uuid');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('span.twiglet-name').innerText).toContain('an eventName');
    });

    it('does not display anything extra if there is no event picked', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('span.twiglet-name').innerText.trim()).toContain('a name');
    });
  });
});
