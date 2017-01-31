import { EditTwigletDetailsComponent } from './edit-twiglet-details/edit-twiglet-details.component';
import { TwigletEditButtonComponent } from './twiglet-edit-button/twiglet-edit-button.component';
/* tslint:disable:no-unused-variable */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestBed, async } from '@angular/core/testing';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PageScrollService } from 'ng2-page-scroll';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { routerForTesting } from './app.router';

// Components
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { AppComponent } from './app.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { CreateTwigletModalComponent } from './create-twiglet-modal/create-twiglet-modal.component';
import { D3Service } from 'd3-ng2-service';
import { EditNodeModalComponent } from './edit-node-modal/edit-node-modal.component';
import { FilterEntitiesPipe } from './filter-entities.pipe';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button/font-awesome-toggle-button.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HeaderEditComponent } from './header-edit/header-edit.component';
import { HeaderEnvironmentComponent } from './header-environment/header-environment.component';
import { HeaderInfoBarComponent } from './header-info-bar/header-info-bar.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls/header-simulation-controls.component';
import { HeaderViewComponent } from './header-view/header-view.component';
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { KeyValuesPipe } from './key-values.pipe';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { NodeSearchPipe } from './node-search.pipe';
import { NodeSortPipe } from './node-sort.pipe';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { HeaderTwigletComponent } from './header-twiglet/header-twiglet.component';
import { SliderWithLabelComponent } from './slider-with-label/slider-with-label.component';
import { SplashComponent } from './splash/splash.component';
import { StateService } from './state.service';
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { TwigletDropdownComponent } from './twiglet-dropdown/twiglet-dropdown.component';

import { pageScrollService, stateServiceStub } from '../non-angular/testHelpers';


describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNodeByDraggingButtonComponent,
        AppComponent,
        CopyPasteNodeComponent,
        CreateTwigletModalComponent,
        EditNodeModalComponent,
        EditTwigletDetailsComponent,
        FilterEntitiesPipe,
        FilterMenuComponent,
        FontAwesomeToggleButtonComponent,
        FooterComponent,
        HeaderComponent,
        HeaderEditComponent,
        HeaderEnvironmentComponent,
        HeaderInfoBarComponent,
        HeaderTwigletComponent,
        HeaderSimulationControlsComponent,
        HeaderViewComponent,
        ImmutableMapOfMapsPipe,
        KeyValuesPipe,
        LeftSideBarComponent,
        LoginButtonComponent,
        LoginModalComponent,
        NodeInfoComponent,
        NodeSearchPipe,
        NodeSortPipe,
        RightSideBarComponent,
        SliderWithLabelComponent,
        SplashComponent,
        TwigletGraphComponent,
        TwigletDropdownComponent,
        TwigletEditButtonComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        routerForTesting,
        ToastModule,
      ],
      providers: [
        { provide: PageScrollService, useValue: pageScrollService },
        { provide: StateService, useValue: stateServiceStub() }
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have 4 panes', ((done) => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-left-side-bar')).toBeTruthy();
    expect(compiled.querySelector('app-right-side-bar')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
    done();
  }));
});
