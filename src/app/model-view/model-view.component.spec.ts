import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModelViewComponent } from './model-view.component';

describe('ModelViewComponent', () => {
  let component: ModelViewComponent;
  let fixture: ComponentFixture<ModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('switching between models', () => {
      it('loads bsc', () => {
        router.next({ id: 'bsc' });
        // header and Add Entity button
        expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(14);
      });

      it('loads the miniModel', () => {
        router.next({ id: 'miniModel' });
        // header and Add Entity button
        expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(8);
      });
    });

    describe('Adding an entity', () => {
      it('responds to new entities', () => {
        component.addEntity();
        expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(8);
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('unsubscribes from the routes service', () => {
      spyOn(component.routeSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.routeSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('buildForm', () => {
    it('creates a form with an entities group', () => {
      component.form = null;
      component.buildForm();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(5);
    });
  });

  describe('createEntity', () => {
    it('creates a empty entity if nothing is passed in', () => {
      const control = component.createEntity();
      expect(control.value).toEqual({
        class: '',
        color: '#000000',
        image: '',
        size: '',
        type: ''
      });
    });

    it('uses the values passed in to create a non-empty entity', () => {
      const entity = {
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      };
      const control = component.createEntity(fromJS(entity));
      expect(control.value).toEqual(entity);
    });
  });

  describe('removeEntity', () => {
    it('can remove an entity at an index', () => {
      component.removeEntity(1);
      expect((component.form.controls['entities'] as FormArray)['ent2']).toBeFalsy();
    });
  });

  describe('addEntity', () => {
    it('can add an entity', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(6);
    });

    it('does not add an entity with no name', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: ''
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(5);
    });

    it('does not add an entity with a name of blank spaces', () => {
      component.form.controls['blankEntity'].patchValue({
        class: 'music',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: '  '
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(5);
    });

    it('does not add an entity with no icon', () => {
      component.form.controls['blankEntity'].patchValue({
        class: '',
        color: '#00FF00',
        image: '\uf001',
        size: '10',
        type: 'something'
      });
      component.addEntity();
      expect((component.form.controls['entities'] as FormArray).length).toEqual(5);
    });
  });
});
