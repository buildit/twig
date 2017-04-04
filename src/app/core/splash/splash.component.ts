import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  styleUrls: ['./splash.component.scss'],
  templateUrl: './splash.component.html',
})
export class SplashComponent implements OnInit {
  public splashImage: string;

  constructor() { }

  ngOnInit() {
    this.splashImage = '../../../../assets/images/twig-splash.png';
  }

}
