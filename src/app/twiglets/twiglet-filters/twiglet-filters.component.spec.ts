/* tslint:disable:no-unused-variable */
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { fromJS } from 'immutable';
import { Observable } from 'rxjs/Observable';

import { routerForTesting } from './../../app.router';
import { TwigletFilterTargetComponent } from './../twiglet-filter-target/twiglet-filter-target.component';
import { StateService } from './../../state.service';
import { stateServiceStub } from '../../../non-angular/testHelpers';
import { TwigletFiltersComponent } from './twiglet-filters.component';

describe('TwigletFiltersComponent', () => {
  let component: TwigletFiltersComponent;
  let fixture: ComponentFixture<TwigletFiltersComponent>;
  const stateServiceStubbed = stateServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletFiltersComponent, TwigletFilterTargetComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: StateService, useValue: stateServiceStubbed },
        { provide: ActivatedRoute, useValue: {
            firstChild: { params: Observable.of({name: 'name1'}) },
            params: Observable.of({name: 'name1'}),
          }
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletFiltersComponent);
    component = fixture.componentInstance;
    component.twiglet = fromJS({
      nodes: [],
    });
    component.userState = fromJS({
      filters: {
        attributes: [],
        types: {},
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('creates a non-repeating array of types', () => {
      component.twiglet = fromJS({
        nodes: [
          { type: 'type1', attrs: [] },
          { type: 'type2', attrs: [] },
          { type: 'type2', attrs: [] },
          { type: 'type1', attrs: [] },
          { type: 'type3', attrs: [] },
        ]
      });
      component.ngOnChanges({});
      expect(component.types).toEqual(['type1', 'type2', 'type3']);
    });
  });

  describe('keys', () => {
    it('creates a non-repeating array of keys', () => {
      component.twiglet = fromJS({
        nodes: [
          { type: 'type1', attrs: [ { key: 'key1' } ] },
          { type: 'type2', attrs: [ { key: 'key2' } ] },
          { type: 'type2', attrs: [ { key: 'key1' } ] },
          { type: 'type1', attrs: [ { key: 'key3' } ] },
          { type: 'type3', attrs: [ { key: 'key2' } ] },
        ]
      });
      expect(component.keys(new FormGroup({}))).toEqual(['key1', 'key2', 'key3']);
    });

    it('creates a non-repeating array of keys but filtered by type', () => {
      component.twiglet = fromJS({
        nodes: [
          { type: 'type1', attrs: [ { key: 'key1' } ] },
          { type: 'type2', attrs: [ { key: 'key2' } ] },
          { type: 'type2', attrs: [ { key: 'key1' } ] },
          { type: 'type1', attrs: [ { key: 'key3' } ] },
          { type: 'type3', attrs: [ { key: 'key2' } ] },
        ]
      });
      expect(component.keys(new FormGroup({ type: new FormControl('type1') }))).toEqual(['key1', 'key3']);
    });
  });

  describe('values', () => {
    it('returns an empty array if the attribute is not set', () => {
      const attributeFormControl = new FormGroup({
        key: new FormControl(),
      });
      expect(component.values(attributeFormControl)).toEqual([]);
    });

    it('returns an array of possible values to match a key', () => {
      const attributeFormControl = new FormGroup({
        key: new FormControl('key1'),
      });
      component.twiglet = fromJS({
        nodes: [
          {
            attrs: [
              {
                key: 'key1',
                value: 'match1',
              },
              {
                key: 'key2',
                value: 'nonmatch1',
              }
            ]
          },
          {
            attrs: [
              {
                key: 'key1',
                value: 'match2',
              },
              {
                key: 'key3',
                value: 'nonmatch2',
              }
            ]
          },
        ]
      });
      expect(component.values(attributeFormControl)).toEqual(['match1', 'match2']);
    });
  });
});
