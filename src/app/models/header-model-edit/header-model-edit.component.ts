import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-model-edit',
  styleUrls: ['./header-model-edit.component.scss'],
  templateUrl: './header-model-edit.component.html',
})
export class HeaderModelEditComponent implements OnInit {
  @Input() userState;
  @Input() model;
  @Input() models;

  constructor() { }

  ngOnInit() {
  }

}
