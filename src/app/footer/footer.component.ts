import { environment } from './../../environments/environment';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  version;
  year;

  constructor(private http: Http) {
    this.version = environment.version;
    this.year = new Date().getFullYear();
  }

  ngOnInit() {
  }
}
