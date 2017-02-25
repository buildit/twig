import { FormsModule, FormBuilder, FormControl } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FontAwesomeIconPickerComponent } from './font-awesome-icon-picker.component';

describe('FontAwesomeIconPickerComponent', () => {
  let component: FontAwesomeIconPickerComponent;
  let fixture: ComponentFixture<FontAwesomeIconPickerComponent>;
  let fb = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FontAwesomeIconPickerComponent ],
      imports: [ FormsModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FontAwesomeIconPickerComponent);
    component = fixture.componentInstance;
    component.entity = fb.group({
      class: 'bug',
      color: '#00FF00',
      image: '\uf188',
      size: '20',
      type: 'test',
    }).controls as any as FormControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no filter on construction', () => {
    expect(component.filteredIcons.length).toEqual(729);
  });

  describe('resetEndpoints', () => {
    it('resets start', () => {
      component.start = 12;
      component.resetEndpoints();
      expect(component.start).toEqual(0);
    });

    it('resets end', () => {
      component.end = 12;
      component.resetEndpoints();
      expect(component.end).toEqual(8);
    });
  });

  describe('incrementing icons', () => {
    it ('increments start', () => {
      component.start = 10;
      component.incrementIcons();
      expect(component.start).toEqual(11);
    });

    it ('increments end', () => {
      component.start = 17;
      component.incrementIcons();
      expect(component.start).toEqual(18);
    });

    it('does not increment end if the end would be greater than the length', () => {
      component.end = 728;
      component.incrementIcons();
      expect(component.end).toEqual(728);
    });

    it('does not increment start if the end would be greater than the length', () => {
      component.start = 718;
      component.end = 728;
      component.incrementIcons();
      expect(component.start).toEqual(718);
    });

    it('calls updateRenderedArray after processing', () => {
      spyOn(component, 'updateRenderedArray');
      component.incrementIcons();
      expect(component.updateRenderedArray).toHaveBeenCalled();
    });
  });

  describe('decrementing icons', () => {
    it ('decrements start', () => {
      component.start = 10;
      component.decrementIcons();
      expect(component.start).toEqual(9);
    });

    it ('decrements end', () => {
      component.start = 17;
      component.decrementIcons();
      expect(component.start).toEqual(16);
    });

    it('does not decrement start if the start would be negative', () => {
      component.start = 0;
      component.decrementIcons();
      expect(component.start).toEqual(0);
    });

    it('does not decrement end if the start would be negative', () => {
      component.start = 0;
      component.end = 10;
      component.decrementIcons();
      expect(component.end).toEqual(10);
    });

    it('calls updateRenderedArray after processing', () => {
      component.incrementIcons();
      spyOn(component, 'updateRenderedArray');
      component.decrementIcons();
      expect(component.updateRenderedArray).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('does no filtering if the search field is blank', () => {
      component.filteredIcons.length = 0;
      component.filter('');
      expect(component.filteredIcons.length).toEqual(729);
    });

    it('filters for icons that contain the search phrase', () => {
      component.filter('ama');
      expect(component.filteredIcons.length).toEqual(4);
    });

    it('calls reset Endpoints on a search', () => {
      spyOn(component, 'resetEndpoints');
      component.filter('');
      expect(component.resetEndpoints).toHaveBeenCalled();
    });

    it('calls reset updateRenderedArray on a search', () => {
      spyOn(component, 'updateRenderedArray');
      component.filter('');
      expect(component.updateRenderedArray).toHaveBeenCalled();
    });
  });

  describe('updateRenderedArray', () => {
    it('takes a piece of the filtered icons', () => {
      component.filter('ama');
      component.start = 0;
      component.end = 2;
      component.updateRenderedArray();
      expect(component.icons).toEqual(['amazon', 'exclamation']);
    });

    it('resets the deltaY', () => {
      component.currentDeltaY = 10;
      component.updateRenderedArray();
      expect(component.currentDeltaY).toEqual(0);
    });
  });

  describe('toggleShow', () => {
    it('toggles to false', () => {
      spyOn(document, 'querySelector').and.returnValue({
        getBoundingClientRect() {
          return {
            height: 100,
            top: 50,
          };
        }
      });
      component.show = false;
      component.toggleShow();
      expect(component.show).toEqual(true);
    });

    it('toggles to true', () => {
      spyOn(document, 'querySelector').and.returnValue({
        getBoundingClientRect() {
          return {
            height: 100,
            top: 50,
          };
        }
      });
      component.show = true;
      component.toggleShow();
      expect(component.show).toEqual(false);
    });
  });

  describe('setFormValue', () => {
    it('sets search to an empty string', () => {
      component.search = 'not empty';
      component.setFormValue('music');
      expect(component.search).toBeFalsy('');
    });

    it('calls updateRenderedArray so that the icons reset', () => {
      spyOn(component, 'updateRenderedArray');
      component.setFormValue('music');
      expect(component.updateRenderedArray).toHaveBeenCalled();
    });

    it('sets the entity class to the icon name', () => {
      component.setFormValue('music');
      expect(component.entity['class'].value).toEqual('music');
    });

    it('sets the entity image to the correct font-awesome icon', () => {
      component.setFormValue('music');
      expect(component.entity['image'].value).toEqual('\uf001');
    });

    it('hides the dropdown', () => {
      component.show = true;
      component.setFormValue('music');
      expect(component.show).toBeFalsy();
    });
  });

  describe('display', () => {
    it('displays the icon in the search button', () => {
      component.setFormValue('music');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button').querySelector('i')
        .getAttribute('class').includes('fa-music')).toBeTruthy();
    });

    it('displays the icon name in the search button', () => {
      component.setFormValue('music');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button').textContent).toEqual(' music');
    });
  });
});
