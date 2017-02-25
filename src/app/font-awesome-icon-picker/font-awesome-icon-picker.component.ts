import { iconNamesArray, iconsObject } from './../../non-angular/utils/icons';
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


@Component({
  selector: 'app-font-awesome-icon-picker',
  styleUrls: ['./font-awesome-icon-picker.component.scss'],
  templateUrl: './font-awesome-icon-picker.component.html',
})
export class FontAwesomeIconPickerComponent implements OnInit {
  @Input() entity: FormControl;
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
    this.render.listen(this.elementRef.nativeElement.querySelector('.dropdown-menu'), 'wheel', (event) => {
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
    const appModelViewRect = document.querySelector('app-model-view').getBoundingClientRect();
    if (this.elementRef.nativeElement.getBoundingClientRect().top + 250
        > appModelViewRect.height + appModelViewRect.top) {
      this.dropUp = true;
      this.cd.markForCheck();
    } else {
      this.dropUp = false;
      this.cd.markForCheck();
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
