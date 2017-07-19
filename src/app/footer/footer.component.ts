import { Http } from '@angular/http';
import { Component } from '@angular/core';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version;
  year;

  constructor() {
    this.version = environment.version;
    this.year = new Date().getFullYear();
  }

}
