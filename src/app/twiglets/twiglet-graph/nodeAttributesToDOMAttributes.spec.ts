import { ViewDropdownComponent } from './../view-dropdown/view-dropdown.component';
import { BreadcrumbNavigationComponent } from './../breadcrumb-navigation/breadcrumb-navigation.component';
/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { fromJS, Map } from 'immutable';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

import { AddNodeByDraggingButtonComponent } from './../add-node-by-dragging-button/add-node-by-dragging-button.component';
import { CopyPasteNodeComponent } from './../copy-paste-node/copy-paste-node.component';
import { D3Node, Link } from '../../../non-angular/interfaces';
import { getColorFor, getColorForLink, getNodeImage, getSizeFor, getSizeForLink } from './nodeAttributesToDOMAttributes';
import { HeaderTwigletComponent } from './../header-twiglet/header-twiglet.component';
import { HeaderTwigletEditComponent } from './../header-twiglet-edit/header-twiglet-edit.component';
import { Model } from './../../../non-angular/interfaces/model';
import { StateService } from '../../state.service';
import { stateServiceStub, mockToastr } from '../../../non-angular/testHelpers';
import { TwigletDropdownComponent } from './../twiglet-dropdown/twiglet-dropdown.component';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { DismissibleHelpModule } from './../../directives/dismissible-help/dismissible-help.module';
import { DismissibleHelpDialogComponent } from './../../shared/dismissible-help-dialog/dismissible-help-dialog.component';

const stateServiceStubbed = stateServiceStub();
stateServiceStubbed.twiglet.updateNodes = () => undefined;

const testBedSetup = {
  declarations: [
    AddNodeByDraggingButtonComponent,
    CopyPasteNodeComponent,
    DismissibleHelpDialogComponent,
    HeaderTwigletComponent,
    HeaderTwigletEditComponent,
    TwigletDropdownComponent,
    TwigletGraphComponent,
    BreadcrumbNavigationComponent,
    ViewDropdownComponent,
  ],
  imports: [ NgbModule.forRoot(), DismissibleHelpModule ],
  providers: [
    D3Service,
    NgbModal,
    { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
    { provide: ActivatedRoute, useValue: { params: Observable.of({name: 'name1'}) } },
    { provide: StateService, useValue: stateServiceStubbed },
    { provide: ToastrService, useValue: mockToastr },
  ],
};

describe('TwigletGraphComponent:nodeAttributesToDOMAttributes', () => {
  let component: TwigletGraphComponent;
  let fixture: ComponentFixture<TwigletGraphComponent>;
  function node(): D3Node {
    return {
      id: 'id',
      name: 'a name',
      type: 'ent1',
    };
  };

  function link(): Link {
    return {
      association: 'name',
      id: 'id',
      source: 'id',
      target: 'id2',
    };
  };

  function overrideNode(): D3Node {
    return {
      _color: 'purple',
      _size: 50,
      id: 'id',
      name: 'a name',
      type: 'ent1'
    };
  };

  function overrideLink(): Link {
    return {
      _color: 'blue',
      _size: 5,
      association: 'name',
      id: 'id',
      source: 'id',
      target: 'id2',
    };
  }

  beforeEach(async(() => {
    stateServiceStubbed.twiglet.loadTwiglet('name1');
    TestBed.configureTestingModule(testBedSetup).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletGraphComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });


  describe('getNodeImage', () => {
    it('returns the correct image if the Model.entity exists', () => {
      expect(getNodeImage.bind(component)(node())).toEqual('!');
    });

    it('warns to the console and returns an empty string if the entity does not exist', () => {
      const _node = node();
      _node.type = 'non-existant entity';
      spyOn(console, 'warn');
      expect(getNodeImage.bind(component)(_node)).toEqual('');
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('getColorFor', () => {
    it('returns the correct color if the Model.entity exists', () => {
      expect(getColorFor.bind(component)(node())).toEqual('#bada55');
    });

    it('returns a default color and warns to the console if the entity does not exist', () => {
      const _node = node();
      _node.type = 'non-existant entity';
      spyOn(console, 'warn');
      expect(getColorFor.bind(component)(_node)).toEqual('#000000');
      expect(console.warn).toHaveBeenCalled();
    });

    it('returns the override _color if that exists', () => {
      expect(getColorFor.bind(component)(overrideNode())).toEqual('purple');
    });
  });

  describe('getColorForLink', () => {
    it('returns the default color for a link with no override', () => {
      expect(getColorForLink.bind(component)(link())).toEqual('#999999');
    });

    it('returns the override _color if that exists', () => {
      expect(getColorForLink.bind(component)(overrideLink())).toEqual('blue');
    });
  });

  describe('getSizeForLink', () => {
    it('returns the default size for a link with no override', () => {
      expect(getSizeForLink.bind(component)(link())).toEqual(1);
    });

    it('returns the override _size if that exists', () => {
      expect(getSizeForLink.bind(component)(overrideLink())).toEqual(5);
    });
  });
});
