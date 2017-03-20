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
