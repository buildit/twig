import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { Map } from 'immutable';

import { AboutComponent } from './about.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  const stateService = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutComponent ],
      providers: [ { provide: StateService, useValue: stateService } ]
    })
    .overrideComponent(AboutComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const bs = stateService.userState['_userState'];
    const existingState = bs.getValue();
    stateService.userState['_userState'].next(existingState.set(USERSTATE.PING, {
      authenticated: {
        user: {
          name: 'some@email.com'
        }
      },
      config: {
        DB_URL: 'dburl',
        LDAP_URL: 'ldap://url',
        LOG_CONSOLE: true,
        LOG_FILE: true,
        LOG_LEVEL: 'debug',
        TENANT: ''
      },
      version: '2.0.0',
    }).set(USERSTATE.USER, { user: { name: 'some@email.com' } }));
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('render', () => {
    describe('userState.ping is filled out', () => {

      it('shows the version', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.api-version')).toBeTruthy();
      });

      it('shows the config information', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.api-config')).toBeTruthy();
      });
    });

    describe('userState.ping is not filled out', () => {
      beforeEach(() => {
        const bs = stateService.userState['_userState'];
        bs.next(bs.getValue().set(USERSTATE.PING, null));
      });

      it('does not show the version', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.api-version')).toBeFalsy();
      });

      it('does not show the config information', () => {
        expect(fixture.nativeElement.querySelector('.api-config')).toBeFalsy();
      });
    });

    describe('the user is logged in', () => {
      it('shows the current user if logged in', () => {
        const name = 'a user name';
        const bs = stateService.userState['_userState'];
        bs.next(bs.getValue().set(USERSTATE.USER, { user: { name } }));
        fixture.detectChanges();
        const userP = <HTMLParagraphElement>fixture.nativeElement.querySelector('.user-info');
        expect(userP.innerText).toContain(name);
      });

      it('shows N/A if the user is not logged in', () => {
        const expectedText = 'N/A';
        const bs = stateService.userState['_userState'];
        bs.next(bs.getValue().set(USERSTATE.USER, null));
        fixture.detectChanges();
        const userP = <HTMLParagraphElement>fixture.nativeElement.querySelector('.user-info');
        expect(userP.innerText).toContain(expectedText);
      });
    });
  });

});
