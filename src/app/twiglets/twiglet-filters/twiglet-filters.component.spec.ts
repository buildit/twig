import { FormGroup, FormControl } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { fromJS } from 'immutable';

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
      providers: [{ provide: StateService, useValue: stateServiceStubbed }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletFiltersComponent);
    component = fixture.componentInstance;
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
      component.ngOnChanges();
      expect(component.types).toEqual(['type1', 'type2', 'type3']);
    });

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
      component.ngOnChanges();
      expect(component.keys).toEqual(['key1', 'key2', 'key3']);
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
