import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { PingComponent } from './ping.component';

describe('PingComponent', () => {
  let component: PingComponent;
  let fixture: ComponentFixture<PingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PingComponent ],
      imports: [ NgbModule.forRoot() ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PingComponent);
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
