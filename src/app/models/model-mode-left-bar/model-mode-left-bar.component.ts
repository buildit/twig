import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-model-mode-left-bar',
  styleUrls: ['./model-mode-left-bar.component.scss'],
  templateUrl: './model-mode-left-bar.component.html',
})
export class ModelModeLeftBarComponent implements OnInit {
  @Input() model;
  @Input() userState;

  constructor() { }

  ngOnInit() {
  }

}
