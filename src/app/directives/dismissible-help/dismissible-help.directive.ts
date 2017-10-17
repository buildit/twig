import {
  Component,
  Directive,
  Input,
  HostListener,
  OnInit,
  OnDestroy,
  Injector,
  Renderer2,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgZone
} from '@angular/core';
import * as positioning from '@ng-bootstrap/ng-bootstrap/util/positioning';
import * as popup from '@ng-bootstrap/ng-bootstrap/util/popup';

import { DismissibleHelpDialogComponent } from '../../shared/dismissible-help-dialog/dismissible-help-dialog.component';

let nextId = 0;
@Directive({
  exportAs: 'appDismissibleHelp',
  selector: '[appDismissibleHelp]'
})
export class DismissibleHelpDirective implements OnDestroy {
  @Input() placement: positioning.Placement = 'top';
  @Input() helpTextWidth = '20rem';
  @Input() helpTextHeight = '30rem';
  @Input()
  set appDismissibleHelp(value: TemplateRef<any>) {
    this._appDismissibleHelp = value;
    if (!value && this.windowRef) {
      this.close();
    }
  }

  private _appDismissibleHelp: TemplateRef<any>;
  private ngbTooltipWindowId = `dismissible-help-${nextId++}`;
  private popupService: popup.PopupService<DismissibleHelpDialogComponent>;
  private windowRef: ComponentRef<DismissibleHelpDialogComponent>;
  private zoneSubscription: any;

  constructor(
    private elementRef: ElementRef, private renderer: Renderer2, injector: Injector,
    componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, ngZone: NgZone) {

    this.popupService = new popup.PopupService<DismissibleHelpDialogComponent>(
      DismissibleHelpDialogComponent, injector, viewContainerRef, renderer, componentFactoryResolver);

    this.zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this.windowRef) {
        this.windowRef.instance.applyPlacement(
            positioning.positionElements(this.elementRef.nativeElement, this.windowRef.location.nativeElement, this.placement, true));
      }
    });
  }

  ngOnDestroy() {
    this.close();
    this.zoneSubscription.unsubscribe();
  }

  /**
   * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   * The context is an optional value to be injected into the tooltip template when it is created.
   */
  open() {
    if (!this.windowRef && this._appDismissibleHelp) {
      this.windowRef = this.popupService.open(this._appDismissibleHelp);
      this.windowRef.instance.id = this.ngbTooltipWindowId;
      this.windowRef.instance.closeFunction = this.close.bind(this);
      this.windowRef.instance.contentBody = this._appDismissibleHelp;
      this.windowRef.instance.helpTextWidth = this.helpTextWidth;
      this.windowRef.instance.helpTextHeight = this.helpTextHeight;

      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', this.ngbTooltipWindowId);

      window.document.querySelector('body').appendChild(this.windowRef.location.nativeElement);

      this.windowRef.instance.placement = this.placement;

      // apply styling to set basic css-classes on target element, before going for positioning
      this.windowRef.changeDetectorRef.detectChanges();
      this.windowRef.changeDetectorRef.markForCheck();

      // position tooltip along the element
      this.windowRef.instance.applyPlacement(
          positioning.positionElements(this.elementRef.nativeElement, this.windowRef.location.nativeElement, this.placement, true));
    }
  }

  /**
   * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   */
  close(): void {
    if (this.windowRef != null) {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
      this.popupService.close();
      this.windowRef = null;
    }
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.open()
  }

  @HostListener('document:mouseup', ['$event.target'])
  onMouseUp(target) {
    if (this.windowRef && !this.windowRef.instance.isInside(target)) {
      this.close();
    }
  }
}
