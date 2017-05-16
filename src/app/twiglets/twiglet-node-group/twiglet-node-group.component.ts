import { AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, OnChanges,
  OnInit, SimpleChanges, ViewChildren } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Map } from 'immutable';

import { D3Node } from './../../../non-angular/interfaces/twiglet/node';
import { NodeInfoComponent } from './../node-info/node-info.component';
import { StateService } from './../../state.service';

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
  @Input() elementRef;
  isOpen = false;
  currentNode = '';
  currentNodeCard = '';
  needToScroll = false;
  @ViewChildren('nodeList') createdNodes;
  viewNodeCount = 0;

  constructor(private stateService: StateService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState.currentValue.get('currentNode') && this.currentNode !== changes.userState.currentValue.get('currentNode')) {
      this.currentNode = changes.userState.currentValue.get('currentNode');
      this.currentNodeCard = `node-card-${this.currentNode}`;
      this.isOpen = this.type[1].some(node => node.id === this.currentNode);
      if (this.isOpen) {
        const previousUserStateIsMapAndHasCurrentNode = changes.userState.previousValue
                                                    && Map.isMap(changes.userState.previousValue)
                                                    && changes.userState.previousValue.get('currentNode');
        if (previousUserStateIsMapAndHasCurrentNode) {
          if (this.currentNode !== changes.userState.previousValue.get('currentNode')) {
            this.needToScroll = true;
          }
        } else {
          this.needToScroll = true;
        }
      }
    }
  }

  ngAfterViewChecked() {
    if (this.needToScroll) {
      this.needToScroll = false;
      const active = this.elementRef.nativeElement.querySelector(`#node-card-${this.currentNode}-header`);
      if (active) {
        active.scrollIntoView();
      }
    }
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

  // check for overriding _color property on node, and if none exists apply default type color
  getColor(type, node) {
    if (node._color) {
      return node._color;
    }
    return type[0].color;
  }

  beforeChange($event: NgbPanelChangeEvent) {
    if ($event.nextState && $event.panelId !== this.currentNode) {
      this.stateService.userState.setCurrentNode($event.panelId.replace('node-card-', ''));
    }
  };
}
