import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, OnChanges,
  OnInit, SimpleChanges, ViewChildren } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { StateService } from './../../state.service';
import { D3Node } from './../../../non-angular/interfaces/twiglet/node';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-node-group',
  styleUrls: ['./twiglet-node-group.component.scss'],
  templateUrl: './twiglet-node-group.component.html',
})
export class TwigletNodeGroupComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() userState;
  @Input() type;
  @Input() twiglet;
  @ViewChildren('nodeList') createdNodes;
  isOpen = false;
  currentNode = '';
  viewNodeCount = 0;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState.currentValue.get('currentNode') && this.currentNode !== changes.userState.currentValue.get('currentNode')) {
      this.currentNode = this.userState.get('currentNode') || '';
      this.isOpen = this.type[1].some(node => node.get('id') === this.currentNode);
    }
  }

  ngAfterViewChecked() {
    this.viewNodeCount = this.createdNodes.toArray().length;
    this.cd.markForCheck();
    this.cd.detectChanges();
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
