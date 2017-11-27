import { Component, OnInit, ChangeDetectionStrategy, Input, TemplateRef, ElementRef, Renderer2, HostBinding } from '@angular/core';
import * as positioning from '@ng-bootstrap/ng-bootstrap/util/positioning';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dismissible-help-dialog',
  styleUrls: ['./dismissible-help-dialog.component.scss'],
  templateUrl: './dismissible-help-dialog.component.html',
})
export class DismissibleHelpDialogComponent implements OnInit {
  @HostBinding('attr.class') className = 'tooltip show';
  @HostBinding('style.max-width') helpTextWidth;
  @HostBinding('style.max-height') helpTextHeight;
  placement: positioning.Placement = 'top';
  closeFunction: () => void;
  contentBody: TemplateRef<any>;
  id: string;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
  }

  close() {
    if (this.closeFunction) {
      this.closeFunction();
    }
  }

  applyPlacement(placement: positioning.Placement) {
    // remove the current placement classes
    this.renderer.removeClass(this.element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
    this.renderer.removeClass(this.element.nativeElement, 'bs-tooltip-' + this.placement.toString());

    // set the new placement classes
    this.placement = placement;

    // apply the new placement
    this.renderer.addClass(this.element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
    this.renderer.addClass(this.element.nativeElement, 'bs-tooltip-' + this.placement.toString());
  }

  isInside(target: HTMLElement) {
    return this.element.nativeElement.contains(target);
  }
}
