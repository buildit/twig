/* tslint:disable:no-unused-variable */
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PageScrollService } from 'ng2-page-scroll';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbAccordionConfig, NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { FilterEntitiesPipe } from './../filter-entities.pipe';
import { ImmutableMapOfMapsPipe } from './../immutable-map-of-maps.pipe';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { NodeSearchPipe } from './../node-search.pipe';
import { ObjectSortPipe } from './../object-sort.pipe';
import { RightSideBarComponent } from './right-side-bar.component';
import { stateServiceStub, pageScrollService } from '../../non-angular/testHelpers';
import { StateService } from './../state.service';
import { TwigletRightSideBarComponent } from './../twiglet-right-sidebar/twiglet-right-sidebar.component';

describe('RightSideBarComponent', () => {
  let component: RightSideBarComponent;
  let fixture: ComponentFixture<RightSideBarComponent>;
  const stateServiceStubbed = stateServiceStub();
  const routerEvents = new BehaviorSubject<any>({ url: '/' });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterEntitiesPipe,
        ImmutableMapOfMapsPipe,
        NodeInfoComponent,
        NodeSearchPipe,
        ObjectSortPipe,
        RightSideBarComponent,
        TwigletRightSideBarComponent,
      ],
      imports: [ NgbAccordionModule ],
      providers: [
        NgbAccordionConfig,
        { provide: PageScrollService, useValue: pageScrollService },
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: Router, useValue: { events: routerEvents } }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('router sets appropriate mode', () => {
    it('shows the twiglets sidebar when the url ends with /twiglet', () => {
      routerEvents.next({ url: '/twiglet/some%20twiglet' });
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('app-twiglet-right-sidebar')).toBeTruthy();
    });

    it('shows a placeholder for models when the url ends with /models', () => {
      routerEvents.next({ url: '/model/some%20model' });
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Model');
    });

    it('shows a placeholder for the home page when the url contains garbage', () => {
      routerEvents.next({ url: 'gobbledygook' });
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Home');
    });

    it('shows a placeholder for the home page when the is a slash', () => {
      routerEvents.next({ url: '/' });
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Home');
    });

    it('shows a placeholder for the home page when the url is nothing', () => {
      routerEvents.next({ url: '' });
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('p').innerHTML).toContain('Home');
    });
  });
});
