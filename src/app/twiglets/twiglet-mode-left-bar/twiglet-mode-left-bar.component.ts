import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Map, OrderedMap } from 'immutable';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-mode-left-bar',
  styleUrls: ['./twiglet-mode-left-bar.component.scss'],
  templateUrl: './twiglet-mode-left-bar.component.html',
})
export class TwigletModeLeftBarComponent implements OnInit {

  @Input() userState: Map<string, any>;
  @Input() twiglet: Map<string, any>;
  @Input() eventsList: OrderedMap<string, Map<string, any>>;
  @Input() sequences;

  constructor() { }

  ngOnInit() {
  }

}
