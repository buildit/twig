    /* tslint:disable:no-unused-variable */
    import { async, ComponentFixture, TestBed } from '@angular/core/testing';
    import { D3Service } from 'd3-ng2-service';
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
          providers: [ D3Service, { provide: StateService, useValue: new StateServiceStub()} ]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(TwigletGraphComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should have three nodes on it', () => {
        const compiled = fixture.debugElement.nativeElement;
        const nodeGroups = compiled.querySelectorAll('.node-group');
        expect(nodeGroups.length).toEqual(3);
      });

      it('should have two links on it', () => {
        const compiled = fixture.debugElement.nativeElement;
        const nodeGroups = compiled.querySelectorAll('.link-group');
        expect(nodeGroups.length).toEqual(2);
      });
    });
