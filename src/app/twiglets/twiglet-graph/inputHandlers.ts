import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { D3, D3DragEvent, Selection } from 'd3-ng2-service';

import { D3Node, GravityPoint, Link } from '../../../non-angular/interfaces';
import { EditGravityPointModalComponent } from './../edit-gravity-point-modal/edit-gravity-point-modal.component';
import { EditLinkModalComponent } from '../edit-link-modal/edit-link-modal.component';
import { EditNodeModalComponent } from '../edit-node-modal/edit-node-modal.component';
import { toggleNodeCollapsibility } from './collapseAndFlowerNodes';
import { TwigletGraphComponent } from './twiglet-graph.component';

/**
 * Starts the dragging process on a node by fixing the node's location.
 *
 * @export
 * @param {D3Node} node
 */
export function dragStarted (this: TwigletGraphComponent, node: D3Node) {
  if (!this.altPressed) {
    this.isDragging = true;
    node.fx = node.x;
    node.fy = node.y;
    node.sx = node.fx;
    node.sy = node.fy;
  }
}

/**
 * Moves a node around by settings the node fixed x and y to the mouse x and y.
 *
 * @export
 * @param {D3Node} node
 */
export function dragged(this: TwigletGraphComponent, node: D3Node) {
  const e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  this.ngZone.runOutsideAngular(() => {
    this.simulation.alpha(0.5).restart();
    node.fx = e.x;
    node.fy = e.y;
  });
}

/**
 * Ends the drag process by removing the fixing on a node so D3 can take controll of it's position.
 *
 * @export
 * @param {D3Node} node
 */
export function dragEnded(this: TwigletGraphComponent, node: D3Node) {
  this.isDragging = false;
  const minimumPixelMovement = 10;
  const x = Math.pow((node.fx - node.sx), 2);
  const y = Math.pow((node.fy - node.sy), 2);
  if (Math.sqrt(x + y) > minimumPixelMovement) {
    this.stateService.twiglet.updateNode(node);
  }
}

export function nodeClicked(this: TwigletGraphComponent, node: D3Node) {
  if (this.altPressed) {
    toggleNodeCollapsibility.bind(this)(node);
  } else {
    this.stateService.userState.setCurrentNode(node.id);
  }
}

/**
 * When the user presses down on a node, this starts the linking process by creating a line and
 * a temp node.
 *
 * @export
 * @param {D3Node} node
 */
export function mouseDownOnNode(this: TwigletGraphComponent, node: D3Node) {
  this.tempLink = {
    id: UUID.UUID(),
    source: node.id,
    target: null,
  };
  this.tempLinkLine = this.d3Svg.append<SVGLineElement>('line')
  .attr('id', 'temp-draggable-link-line')
  .attr('x1', node.x)
  .attr('y1', node.y)
  .attr('x2', node.x)
  .attr('y2', node.y)
  .attr('style', 'stroke:rgb(255,0,0);stroke-width:2; pointer-events: none;');
}

/**
 * Tracks movement on a canvas but only if there is a link waiting to be completed.
 *
 * @export
 * @param {TwigletGraphComponent} parent
 * @returns {() => void}
 */
export function mouseMoveOnCanvas(parent: TwigletGraphComponent): () => void {
  return function () {
    if (parent.tempLink) {
      const mouse = parent.d3.mouse(this);
      parent.tempLinkLine.attr('x2', mouse[0]).attr('y2', mouse[1]);
    }
  };
}

/**
 * This clears everything because the user mouse'd up but NOT on a node. That is, unless
 * the user is in the process of adding a new node.
 *
 * @export
 * @param {TwigletGraphComponent} parent
 * @returns {() => void}
 */
export function mouseUpOnCanvas(parent: TwigletGraphComponent): () => void {
  return function () {
    if (parent.tempLink) {
      parent.tempLink = undefined;
      parent.tempLinkLine.remove();
      parent.tempLinkLine = undefined;
    } else if (parent.userState.get('nodeTypeToBeAdded')) {
      const mouse = parent.d3.mouse(this);
      const node: D3Node = {
        attrs: [],
        id: UUID.UUID(),
        type: parent.userState.get('nodeTypeToBeAdded'),
        x: mouse[0],
        y: mouse[1],
      };
      parent.stateService.twiglet.addNode(node);
      parent.stateService.userState.setCurrentNode(node.id);
      const modelRef = parent.modalService.open(EditNodeModalComponent);
      const component = <EditNodeModalComponent>modelRef.componentInstance;
      component.userState = parent.userState;
      component.id = node.id;
      component.twiglet = parent.twiglet;
      component.twigletModel = parent.modelMap;
    } else if (parent.userState.get('currentNode')) {
      parent.stateService.userState.clearCurrentNode();
    } else if (parent.userState.get('isEditingGravity') && parent.userState.get('addingGravityPoints')
                && parent.tempLink === undefined) {
      const mouse = parent.d3.mouse(this);
      const gravityPoint = {
        id: UUID.UUID(),
        name: '',
        x: mouse[0],
        y: mouse[1]
      };
      const modelRef = parent.modalService.open(EditGravityPointModalComponent);
      const component = <EditGravityPointModalComponent>modelRef.componentInstance;
      component.gravityPoint = gravityPoint;
    }
  };
}

/**
 * When the user completes a link by mouse-upping on a node, This completes that link, calls
 * addLink on the service and then removes the temp link.
 *
 * @export
 * @param {D3Node} node
 */
export function mouseUpOnNode(this: TwigletGraphComponent, node: D3Node) {
  if (this.tempLink && this.tempLink.source !== node.id) {
    this.tempLink.target = node.id;
    this.stateService.twiglet.addLink(this.tempLink);
    this.updateLinkLocation();
    mouseUpOnCanvas(this)();
    this.updateCircleLocation();
  }
}

export function dblClickNode(this: TwigletGraphComponent, node: D3Node) {
  if (this.userState.get('isEditing')) {
    const modelRef = this.modalService.open(EditNodeModalComponent);
    const component = <EditNodeModalComponent>modelRef.componentInstance;
    component.id = node.id;
    component.twiglet = this.twiglet;
    component.twigletModel = this.modelMap;
    component.userState = this.userState;
  } else {
    if (node.fx !== null) {
      node.fx = null;
    } else {
      node.fx = node.x;
    }
    if (node.fy !== null) {
      node.fy = null;
    } else {
      node.fy = node.x;
    }
    this.stateService.twiglet.updateNode(node);
  }
}

export function clickLink(this: TwigletGraphComponent, link: Link) {
  if (this.userState.get('isEditing')) {
    const modelRef = this.modalService.open(EditLinkModalComponent);
    const component = <EditLinkModalComponent>modelRef.componentInstance;
    component.id = link.id;
    component.twiglet = this.twiglet;
  }
}

export function mouseUpOnGravityPoint(this: TwigletGraphComponent, gp: GravityPoint) {
  if (this.tempLink) {
    const nodeId = this.tempLink.source as string;
    this.stateService.twiglet.updateNodeParam(nodeId, 'gravityPoint', gp.id);
  }
}

export function gravityPointDragStart(this: TwigletGraphComponent, gp: GravityPoint) {
  const e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  gp.sx = e.x;
  gp.sy = e.y;
}

/**
 * Moves a node around by settings the node fixed x and y to the mouse x and y.
 *
 * @export
 * @param {D3Node} node
 */
export function gravityPointDragged(this: TwigletGraphComponent, gp: GravityPoint) {
  const e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  gp.x = e.x;
  gp.y = e.y;
  this.updateGravityPointLocation();
}

/**
 * Ends the drag process by removing the fixing on a node so D3 can take controll of it's position.
 *
 * @export
 * @param {D3Node} node
 */
export function gravityPointDragEnded(this: TwigletGraphComponent, gp: GravityPoint) {
  const minimumPixelMovement = 10;
  const x = Math.pow((gp.x - gp.sx), 2);
  const y = Math.pow((gp.y - gp.sy), 2);
  if (Math.sqrt(x + y) > minimumPixelMovement) {
    this.stateService.userState.setGravityPoint(gp);
  } else {
    if (this.userState.get('isEditingGravity') && !this.userState.get('addingGravityPoints')) {
      const modelRef = this.modalService.open(EditGravityPointModalComponent);
      const component = <EditGravityPointModalComponent>modelRef.componentInstance;
      component.gravityPoint = gp;
    }
  }
}
