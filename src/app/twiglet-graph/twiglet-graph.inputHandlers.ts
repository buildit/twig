import { D3, Selection } from 'd3-ng2-service';
import { UUID } from 'angular2-uuid';

import { TwigletGraphComponent } from './twiglet-graph.component';
import { D3Node } from '../interfaces';
import { D3DragEvent } from 'd3-ng2-service';

export function dragStarted (this: TwigletGraphComponent, node: D3Node) {
  let e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  node.fx = node.x;
  node.fy = node.y;
  this.nodesService.updateNode(node, this.currentNodeState);
  if (!e.active) {
    this.simulation.alpha(0.1).restart();
  }
}

export function dragged(this: TwigletGraphComponent, node: D3Node) {
  let e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  node.fx = e.x;
  node.fy = e.y;
  this.nodesService.updateNode(node, this.currentNodeState);
}

export function dragEnded(this: TwigletGraphComponent, node: D3Node) {
  let e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  if (!e.active) {
    this.simulation.alphaTarget(0).restart();
  }
  node.x = node.fx;
  node.y = node.fy;
  node.fx = null;
  node.fy = null;
  this.nodesService.updateNode(node, this.currentNodeState);
}

export function mouseDownOnNode(this: TwigletGraphComponent, node: D3Node) {
  this.tempLink = {
    id: UUID.UUID(),
    source: node.id,
    target: null,
  };
  this.tempLinkLine = this.d3Svg.append<SVGLineElement>('line')
  .attr('x1', node.x)
  .attr('y1', node.y)
  .attr('x2', node.x)
  .attr('y2', node.y)
  .attr('style', 'stroke:rgb(255,0,0);stroke-width:2');
}

export function mouseMoveOnCanvas(parent: TwigletGraphComponent): () => void {
  return function () {
    if (parent.tempLink) {
      const mouse = parent.d3.mouse(this);
      parent.tempLinkLine.attr('x2', mouse[0] + 1).attr('y2', mouse[1] + 1);
    }
  };
}

export function mouseUpOnCanvas(parent: TwigletGraphComponent): () => void {
  console.log('wtf?!');
  return function () {
    console.log('here?!');
    if (parent.tempLink) {
      parent.tempLink = null;
      parent.tempLinkLine.remove();
      parent.tempLinkLine = null;
    }
  };
}

export function mouseUpOnNode(this: TwigletGraphComponent, node: D3Node) {
  if (this.tempLink) {
    console.log('here???');
    this.tempLink.target = node.id;
    this.linksServices.addLink(this.tempLink);
    this.tempLink = null;
    this.tempLinkLine.remove();
    this.tempLinkLine = null;
  }
}
