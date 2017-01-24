import { ModuleWithProviders } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private router: Router ) {  }

  ngOnInit() {  }
}
