import { D3Node } from '../interfaces';
import { D3DragEvent } from 'd3-ng2-service';

export function dragStarted (node: D3Node) {
  let e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  node.fx = node.x;
  node.fy = node.y;
  this.nodesService.updateNode(node, this.currentNodeState);
  if (!e.active) {
    this.force.alpha(0.1).restart();
  }
}

export function dragged(node: D3Node) {
  let e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  node.fx = e.x;
  node.fy = e.y;
  this.nodesService.updateNode(node, this.currentNodeState);
}

export function dragEnded(node: D3Node) {
  let e: D3DragEvent<SVGTextElement, D3Node, D3Node> = this.d3.event;
  if (!e.active) {
    this.force.alphaTarget(0).restart();
  }
  node.fx = null;
  node.fy = null;
  this.nodesService.updateNode(node, this.currentNodeState);
}
