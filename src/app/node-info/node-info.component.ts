import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { D3Node } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-node-info',
  styleUrls: ['./node-info.component.scss'],
  templateUrl: './node-info.component.html',
})
export class NodeInfoComponent {
  @Input() node: D3Node;
}
