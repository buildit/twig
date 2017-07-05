import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Map } from 'immutable';

import { AboutComponent } from './about.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutComponent ],
      providers: [ { provide: StateService, useValue: stateServiceStub()} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    component.userState = Map({
      ping: {
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
      },
      user: 'some@email.com',
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
