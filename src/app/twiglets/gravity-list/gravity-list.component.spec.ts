import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { fromJS } from 'immutable';
import { pick } from 'ramda';

import { GravityListComponent } from './gravity-list.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import VIEW from '../../../non-angular/services-helpers/twiglet/constants/view';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data';

describe('GravityListComponent', () => {
  let component: GravityListComponent;
  let fixture: ComponentFixture<GravityListComponent>;
  let stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    stateServiceStubbed = stateServiceStub();
    TestBed.configureTestingModule({
      declarations: [ GravityListComponent ],
      providers: [ { provide: StateService, useValue: stateServiceStubbed } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityListComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.userState = fromJS({
      user: '',
    });
    component.viewData = fromJS({
      [VIEW_DATA.GRAVITY_POINTS]: {
        id1: {
          id: 'id1',
          name: 'name1',
        }
      },
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('add gravity button', () => {
    it('allows adding gravity points if in gravity edit mode and has a user', () => {
      component.userState = fromJS({
        isEditingGravity: true,
        user: { }
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          id1: {
            id: 'id1',
            name: 'name1',
          }
        },
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-plus')).toBeTruthy();
    });

    it('adds a gravity point', () => {
      component.userState = fromJS({
        isEditingGravity: true,
        user: { }
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          id1: {
            id: 'id1',
            name: 'name1',
          }
        },
      });
      fixture.detectChanges();
      const spy = spyOn(stateServiceStubbed.twiglet.viewService, 'setGravityPoint');
      fixture.nativeElement.querySelector('i.fa-plus').click();
      expect(pick(['name', 'x', 'y'], spy.calls.argsFor(0)[0])).toEqual({
        name: '',
        x: 100,
        y: 100,
      });
    });

    it('cannot add gravity points if there is no user', () => {
      component.userState = fromJS({
        isEditingGravity: true,
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          id1: {
            id: 'id1',
            name: 'name1',
          }
        },
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-plus')).toBeFalsy();
    })

    it('cannot add gravity points if not in gravity edit mode', () => {
      component.userState = fromJS({
        isEditingGravity: false,
        user: { },
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          id1: {
            id: 'id1',
            name: 'name1',
          }
        },
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-plus')).toBeFalsy();
    });
  })

  describe('deleting gravity points', () => {
    it('allows deleting gravity points if in gravity edit mode and has a user', () => {
      component.userState = fromJS({
        isEditingGravity: true,
        user: { }
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          id1: {
            id: 'id1',
            name: 'name1',
          }
        },
      })
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-trash')).toBeTruthy();
    });

    it('deletes a gravity point', () => {
      component.userState = fromJS({
        isEditingGravity: true,
        user: { }
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          id1: {
            id: 'id1',
            name: 'name1',
          }
        },
      })
      fixture.detectChanges();
      const spy = spyOn(stateServiceStubbed.twiglet.viewService, 'setGravityPoints');
      fixture.nativeElement.querySelector('i.fa-trash').click();
      expect(spy.calls.argsFor(0)[0]).toEqual({});
    });

    it('does not allow deleting gravity points if there is no user', () => {
      component.userState = fromJS({
        isEditingGravity: true,
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          gp1: {
            id: 'id1',
            name: 'name1',
          }
        },
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-trash')).toBeFalsy();
    });

    it('does not allow deleting gravity points if not in gravity edit mode', () => {
      component.userState = fromJS({
        isEditingGravity: false,
        user: {}
      });
      component.viewData = fromJS({
        [VIEW_DATA.GRAVITY_POINTS]: {
          gp1: {
            id: 'id1',
            name: 'name1',
          }
        },
      })
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-trash')).toBeFalsy();
    });
  });
});
