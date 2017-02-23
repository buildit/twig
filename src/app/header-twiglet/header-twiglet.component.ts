import { UserState } from './../../non-angular/interfaces/userState/index';
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
  @Input() userState;
  @Input() twigletChangelog;

  constructor() { }

  ngOnInit() {
  }

}
