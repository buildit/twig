/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager, ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { DragulaModule } from 'ng2-dragula';
import { D3Service } from 'd3-ng2-service';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { ModelsModule } from './models/models.module';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { router } from './app.router';
import { SharedModule } from './shared/shared.module';
import { StateService } from './state.service';
import { TwigletsModule } from './twiglets/twiglets.module';

import { stateServiceStub } from '../non-angular/testHelpers';
import { routerForTesting } from './app.router';

describe('AppComponent', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        LeftSideBarComponent,
        RightSideBarComponent,
      ],
      imports: [
        CoreModule,
        DragulaModule,
        FormsModule,
        ModelsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        routerForTesting,
        SharedModule,
        ToastModule,
        TwigletsModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: StateService, useValue: stateServiceStub() },
        ToastsManager,
        ToastOptions,
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have 4 panes', ((done) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-left-side-bar')).toBeTruthy();
    expect(compiled.querySelector('app-right-side-bar')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
    done();
  }));
});
