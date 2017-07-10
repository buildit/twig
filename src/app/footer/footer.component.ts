import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  version;
  year;

  constructor() {
    this.version = environment.version;
    this.year = new Date().getFullYear();
  }

  ngOnInit() {
  }
}
