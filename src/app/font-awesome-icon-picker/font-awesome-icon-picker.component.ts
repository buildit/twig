import { FormControl, FormGroup } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  Renderer,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';

import { iconNamesArray, iconsObject } from './../../non-angular/utils/icons';

@Component({
  selector: 'app-font-awesome-icon-picker',
  styleUrls: ['./font-awesome-icon-picker.component.scss'],
  templateUrl: './font-awesome-icon-picker.component.html',
})
export class FontAwesomeIconPickerComponent implements OnInit {
  @Input() entity: FormControl;
  left = '0px';
  top = '0px';
  maxHeight = 300;
  maxHeightWithPx = `${this.maxHeight}px`;
  dropUp = false;
  start: number;
  end: number;
  icons = [];
  filteredIcons = [];
  currentDeltaY = 0;
  deltaYTarget = 5;
  show = false;
  search = '';
  constructor(private elementRef: ElementRef, private render: Renderer, private cd: ChangeDetectorRef) {
    this.filter('');
  }

  ngOnInit() {
    this.render.listen(this.elementRef.nativeElement.querySelector('.fa-icon-dropdown'), 'wheel', (event) => {
      event.preventDefault();
      if (this.currentDeltaY * event.deltaY > 0) {
        this.currentDeltaY += event.deltaY;
      } else {
        this.currentDeltaY = event.deltaY;
      }
      if (event.deltaY < (-1) * this.deltaYTarget) {
        this.decrementIcons();
      } else if (event.deltaY > this.deltaYTarget) {
        this.incrementIcons();
      }
    });
  }

  resetEndpoints() {
    this.start = 0;
    this.end = 8;
  }

  incrementIcons() {
    if (this.end + 1 < this.filteredIcons.length) {
      this.start++;
      this.end++;
      this.updateRenderedArray();
    }
  }

  decrementIcons() {
    if (this.start - 1 >= 0) {
      this.start--;
      this.end--;
      this.updateRenderedArray();
    }
  }

  filter($event) {
    if (!$event) {
      this.filteredIcons = iconNamesArray();
    } else {
      this.filteredIcons = iconNamesArray().filter(icon => icon.includes($event));
    }
    this.resetEndpoints();
    this.updateRenderedArray();
  }

  updateRenderedArray() {
    this.icons.length = 0;
    for (let i = this.start; i < this.end; i++) {
      this.icons.push(this.filteredIcons[i]);
    }
    this.currentDeltaY = 0;
    this.cd.markForCheck();
  }

  toggleShow() {
    const boundingRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.left = `${boundingRect.left + 20}px`;
    if (!this.show) {
      if (boundingRect.bottom + this.maxHeight > window.innerHeight) {
        this.dropUp = true;
        this.top = `${boundingRect.top - this.maxHeight}px`;
        this.cd.markForCheck();
      } else {
        this.top = `${boundingRect.bottom}px`;
        this.dropUp = false;
        this.cd.markForCheck();
      }
      const removeEventListener = this.render.listenGlobal('document', 'click', (event: MouseEvent) => {
        if (this.show) {
          const buttonRect = this.elementRef.nativeElement.querySelector('button').getBoundingClientRect();
          const dropDownRect = this.elementRef.nativeElement.querySelector('.fa-icon-dropdown').getBoundingClientRect();
          if (event.clientX < buttonRect.left || event.clientX > buttonRect.right) {
            this.show = false;
            removeEventListener();
            this.cd.markForCheck();
          } else {
            if (this.dropUp) {
              if (event.clientY < dropDownRect.top || event.clientY > buttonRect.bottom) {
                this.show = false;
                removeEventListener();
                this.cd.markForCheck();
              }
            } else {
              if (event.clientY < buttonRect.top || event.clientY > dropDownRect.bottom) {
                this.show = false;
                removeEventListener();
                this.cd.markForCheck();
              }
            }
          }
        } else {
          removeEventListener();
        }
      });
    }
    this.show = !this.show;
  }

  setFormValue(icon) {
    this.search = '';
    this.updateRenderedArray();
    this.entity['class'].setValue(icon);
    this.entity['image'].setValue(iconsObject()[icon]);
    this.show = false;
    this.cd.markForCheck();
  }
}
