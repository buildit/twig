import { Http } from '@angular/http';
import { Component } from '@angular/core';

declare function require(moduleName: string): any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version;
  year;

  constructor() {
    this.version = require('../../../package.json').version;
    this.year = new Date().getFullYear();
  }
}
