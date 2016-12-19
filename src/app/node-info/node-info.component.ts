import { Component, Input, OnInit } from '@angular/core';

import { D3Node } from '../interfaces';

@Component({
  selector: 'app-node-info',
  styleUrls: ['./node-info.component.css'],
  templateUrl: './node-info.component.html',
})
export class NodeInfoComponent {
  @Input() node: D3Node;
  @Input() removeNode: () => undefined;
}
