import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-twiglet',
  styleUrls: ['./header-twiglet.component.scss'],
  templateUrl: './header-twiglet.component.html',
})
export class HeaderTwigletComponent implements OnInit {
  @Input() twiglet;
  @Input() twiglets;
  @Input() models;

  constructor() { }

  ngOnInit() {
  }

}
