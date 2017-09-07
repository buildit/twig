import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { fromJS } from 'immutable';

import { GravityListComponent } from './gravity-list.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('GravityListComponent', () => {
  let component: GravityListComponent;
  let fixture: ComponentFixture<GravityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GravityListComponent ],
      providers: [ { provide: StateService, useValue: stateServiceStub() } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityListComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.userState = fromJS({
      gravityPoints: {},
      user: '',
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('add gravity button', () => {
    it('allows adding gravity points if in gravity edit mode and has a user', () => {
      component.userState = fromJS({
        gravityPoints: [
          {
            id: 'id1',
            name: 'name1',
          }
        ],
        isEditingGravity: true,
        user: { }
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-plus')).toBeTruthy();
    });

    it('cannot add gravity points if there is no user', () => {
      component.userState = fromJS({
        gravityPoints: [
          {
            id: 'id1',
            name: 'name1',
          }
        ],
        isEditingGravity: true,
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-plus')).toBeFalsy();
    })

    it('cannot add gravity points if not in gravity edit mode', () => {
      component.userState = fromJS({
        gravityPoints: [
          {
            id: 'id1',
            name: 'name1',
          }
        ],
        isEditingGravity: false,
        user: { },
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-plus')).toBeFalsy();
    });
  })

  describe('deleting gravity points', () => {
    it('allows deleting gravity points if in gravity edit mode and has a user', () => {
      component.userState = fromJS({
        gravityPoints: [
          {
            id: 'id1',
            name: 'name1',
          }
        ],
        isEditingGravity: true,
        user: { }
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-trash')).toBeTruthy();
    });

    it('does not allow deleting gravity points if there is no user', () => {
      component.userState = fromJS({
        gravityPoints: {
          gp1: {
            id: 'id1',
            name: 'name1',
          }
        },
        isEditingGravity: true,
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-trash')).toBeFalsy();
    });

    it('does not allow deleting gravity points if not in gravity edit mode', () => {
      component.userState = fromJS({
        gravityPoints: {
          gp1: {
            id: 'id1',
            name: 'name1',
          }
        },
        isEditingGravity: false,
        user: {}
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('i.fa-trash')).toBeFalsy();
    });
  });
});
