import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from './../../state.service';
import { D3Node } from './../../../non-angular/interfaces/twiglet/node';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-twiglet-node-group',
  styleUrls: ['./twiglet-node-group.component.scss'],
  templateUrl: './twiglet-node-group.component.html',
})
export class TwigletNodeGroupComponent implements OnInit, OnChanges {

  @Input() userState;
  @Input() type;
  @Input() twiglet;
  isOpen = false;
  currentNode = '';

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState.currentValue.get('currentNode') && this.currentNode !== changes.userState.currentValue.get('currentNode')) {
      this.currentNode = this.userState.get('currentNode') || '';
      this.isOpen = this.type[1].some(node => node.get('id') === this.currentNode);
    }
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
