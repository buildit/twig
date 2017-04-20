import { fromJS } from 'immutable';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { TwigletFilterTargetComponent } from './twiglet-filter-target.component';

describe('TwigletFilterTargetComponent', () => {
  let component: TwigletFilterTargetComponent;
  let fixture: ComponentFixture<TwigletFilterTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigletFilterTargetComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigletFilterTargetComponent);
    component = fixture.componentInstance;
    component.targetControl = new FormGroup({
      attributes: new FormControl(),
      type: new FormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('keys', () => {
    beforeEach(() => {
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
            ],
            type: 'ent1',
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
            ],
            type: 'ent2',
          },
        ]
      });
    });

    it('sends all of the keys if no type is selected', () => {
      const attributeFormControl = new FormGroup({
        type: new FormControl(),
      });
      expect(component.keys(attributeFormControl).length).toEqual(3);
    });

    it('sends a subset of the keys if a specific type is selected', () => {
      const attributeFormControl = new FormGroup({
        type: new FormControl('ent1'),
      });
      expect(component.keys(attributeFormControl).length).toEqual(2);
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
              },
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
          {
            attrs: [
              {
                key: 'key1',
                value: 'match1',
              },
              {
                key: 'key4',
                value: 'nonmatch4',
              }
            ]
          },
        ]
      });
      expect(component.values(attributeFormControl)).toEqual(['match1', 'match2']);
    });
  });
});
