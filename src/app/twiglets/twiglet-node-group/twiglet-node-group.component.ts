import { NodeInfoComponent } from './../node-info/node-info.component';
import { PageScrollConfig, PageScrollInstance, PageScrollService } from 'ng2-page-scroll';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from './../../state.service';
import { D3Node } from './../../../non-angular/interfaces/twiglet/node';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, AfterViewChecked, Inject } from '@angular/core';

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

  constructor(private stateService: StateService, private pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userState.currentValue.get('currentNode') && this.currentNode !== changes.userState.currentValue.get('currentNode')) {
      this.currentNode = this.userState.get('currentNode') || '';
      this.currentNodeCard = `node-card-${this.currentNode}`;
      this.isOpen = this.type[1].some(node => node.get('id') === this.currentNode);
      if (this.isOpen) {
        if (changes.userState.previousValue && changes.userState.previousValue.get('currentNode')) {
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
      this.elementRef.nativeElement.querySelector(`#node-card-${this.currentNode}-header`).scrollIntoView();
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
      this.stateService.userState.setCurrentNode($event.panelId.replace('node-card-', ''));
    }
  };
}
