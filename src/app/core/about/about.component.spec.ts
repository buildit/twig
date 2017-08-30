import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Map } from 'immutable';

import { AboutComponent } from './about.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  const stateService = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutComponent ],
      providers: [ { provide: StateService, useValue: stateService } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const bs = stateService.userState['_userState'];
    const existingState = bs.getValue();
    stateService.userState['_userState'].next(existingState.set('ping', {
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
    }).set('user', { user: { name: 'some@email.com' } }));
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
