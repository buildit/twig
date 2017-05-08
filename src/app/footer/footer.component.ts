import { Component, OnInit } from '@angular/core';
import value from '../../../package.json';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  version;
  year;



  constructor() {
    this.version = value ? value.version : 'latest';
    this.year = new Date().getFullYear();
  }

  ngOnInit() {
  }
}
