import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit,
  SimpleChanges, ViewChildren } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from './../../state.service';
import { D3Node } from './../../../non-angular/interfaces/twiglet/node';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-node-group',
  styleUrls: ['./twiglet-node-group.component.scss'],
  templateUrl: './twiglet-node-group.component.html',
})
export class TwigletNodeGroupComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() userState;
  @Input() type;
  @Input() twiglet;
  @ViewChildren('nodeVar') viewableNodes;
  isOpen = false;
  currentNode = '';
  viewNodeCount;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState.currentValue.get('currentNode') && this.currentNode !== changes.userState.currentValue.get('currentNode')) {
      this.currentNode = this.userState.get('currentNode') || '';
      this.isOpen = this.type[1].some(node => node.get('id') === this.currentNode);
    }
  }

  ngAfterViewInit() {
    console.log(this.viewableNodes.toArray());
    console.log(this.viewableNodes.toArray().length);
  }

  setLocalVar(count) {
    // for (let i = 0; i < this.type.length; i++) {
    //   // this.type[i].push(count);
    //   console.log(this.type[i]);
    // }
    console.log('counting');
    console.log(this.type);
    this.viewNodeCount = count;
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  highlight(id) {
    this.stateService.userState.setHighLightedNode(id);
  }
  unhighlight() {
    this.stateService.userState.setHighLightedNode(null);
  }

  public beforeChange($event: NgbPanelChangeEvent) {
    if ($event.nextState && $event.panelId !== this.currentNode) {
      this.stateService.userState.setCurrentNode($event.panelId);
    }
  };
}
