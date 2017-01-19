/* tslint:disable:no-unused-variable */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { PageScrollService } from 'ng2-page-scroll';

// Components
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { FooterComponent } from './footer/footer.component';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { HeaderComponent } from './header/header.component';
import { HeaderViewComponent } from './header-view/header-view.component';
import { HeaderInfoBarComponent } from './header-info-bar/header-info-bar.component';
import { HeaderEditComponent } from './header-edit/header-edit.component';
import { FontAwesomeToggleButtonComponent } from './font-awesome-toggle-button/font-awesome-toggle-button.component';
import { AddNodeByDraggingButtonComponent } from './add-node-by-dragging-button/add-node-by-dragging-button.component';
import { HeaderEnvironmentComponent } from './header-environment/header-environment.component';
import { HeaderSimulationControlsComponent } from './header-simulation-controls/header-simulation-controls.component';
import { SliderWithLabelComponent } from './slider-with-label/slider-with-label.component';
import { CopyPasteNodeComponent } from './copy-paste-node/copy-paste-node.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { TwigletDropdownComponent } from './twiglet-dropdown/twiglet-dropdown.component';

// Pipes
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { NodeSortPipe } from './node-sort.pipe';
import { NodeSearchPipe } from './node-search.pipe';
import { KeyValuesPipe } from './key-values.pipe';
import { FilterEntitiesPipe } from './filter-entities.pipe';

import { StateService, StateServiceStub } from './state.service';


describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,

        // Components
        AddNodeByDraggingButtonComponent,
        CopyPasteNodeComponent,
        FilterMenuComponent,
        FontAwesomeToggleButtonComponent,
        FooterComponent,
        HeaderComponent,
        HeaderEditComponent,
        HeaderEnvironmentComponent,
        HeaderInfoBarComponent,
        HeaderSimulationControlsComponent,
        HeaderViewComponent,
        LeftSideBarComponent,
        NodeInfoComponent,
        RightSideBarComponent,
        SliderWithLabelComponent,
        TwigletDropdownComponent,
        TwigletGraphComponent,

        // Pipes
        ImmutableMapOfMapsPipe,
        KeyValuesPipe,
        NodeSearchPipe,
        NodeSortPipe,
        FilterEntitiesPipe,
      ],
      imports: [
        FormsModule, NgbModule.forRoot()
      ],
      providers: [ PageScrollService, { provide: StateService, useValue: new StateServiceStub()} ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have 5 panes', ((done) => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-left-side-bar')).toBeTruthy();
    expect(compiled.querySelector('app-twiglet-graph')).toBeTruthy();
    expect(compiled.querySelector('app-right-side-bar')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
    done();
  }));
});
