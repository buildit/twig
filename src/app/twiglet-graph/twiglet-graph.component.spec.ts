    /* tslint:disable:no-unused-variable */
    import { async, ComponentFixture, TestBed } from '@angular/core/testing';
    import { D3Service } from 'd3-ng2-service';
    import { FormsModule } from '@angular/forms';
    import { StateService, StateServiceStub } from '../state.service';
    import { By } from '@angular/platform-browser';
    import { DebugElement } from '@angular/core';

    import { TwigletGraphComponent } from './twiglet-graph.component';

    describe('TwigletGraphComponent', () => {
      let component: TwigletGraphComponent;
      let fixture: ComponentFixture<TwigletGraphComponent>;

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ TwigletGraphComponent ],
          imports: [
            FormsModule,
          ],
          providers: [ D3Service, { provide: StateService, useValue: new StateServiceStub()} ]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(TwigletGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });
