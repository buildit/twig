import { Component, Input, OnInit } from '@angular/core';
import { icons } from './../../non-angular/utils/icons';


@Component({
  selector: 'app-font-awesome-icon-picker',
  styleUrls: ['./font-awesome-icon-picker.component.scss'],
  templateUrl: './font-awesome-icon-picker.component.html',
})
export class FontAwesomeIconPickerComponent implements OnInit {
  @Input() activeIcon: string;
  icons: {};

  constructor() {
    this.icons = icons;
   }

  ngOnInit() {
  }

}
