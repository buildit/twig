/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

// Components
import { TwigletGraphComponent } from './twiglet-graph/twiglet-graph.component';
import { NodeInfoComponent } from './node-info/node-info.component';

// Pipes
import { ImmutableMapOfMapsPipe } from './immutable-map-of-maps.pipe';
import { StateService } from './state.service';


describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,

        // Components
        TwigletGraphComponent,
        NodeInfoComponent,

        // Pipes
        ImmutableMapOfMapsPipe,
      ],
      imports: [
        FormsModule,
      ],
      providers: [ StateService ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', ((done) => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
    done();
  }));
});
