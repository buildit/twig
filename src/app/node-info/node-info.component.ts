import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { NodesService } from '../../non-angular/services-helpers';
import { D3Node } from '../../non-angular/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-node-info',
  styleUrls: ['./node-info.component.css'],
  templateUrl: './node-info.component.html',
})
export class NodeInfoComponent {
  @Input() node: D3Node;
  @Input() removeNode: () => undefined;
}
