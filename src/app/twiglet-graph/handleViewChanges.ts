import { clone } from 'ramda';
import { viewServiceResponseToObject } from '../../non-angular/services-helpers';
import { D3Node, Link } from '../../non-angular/interfaces';
import { TwigletGraphComponent }  from './twiglet-graph.component';
// Event Handlers
import {
  dragEnded,
  dragged,
  dragStarted,
  mouseDownOnNode,
  mouseUpOnNode,
} from './inputHandlers';

export function handleViewChanges (response) {
  const oldView = clone(this.view);
  viewServiceResponseToObject.bind(this)(response);
  if (this.nodes) {
    if (oldView.isEditing !== this.view.isEditing) {
      if (this.view.isEditing) {
        this.currentNodes.forEach((node: D3Node) => {
          node.fx = node.x;
          node.fy = node.y;
        });
        this.nodes.on('mousedown.drag', null);
        this.nodes
          .on('mousedown', mouseDownOnNode.bind(this))
          .on('mouseup', mouseUpOnNode.bind(this));
      } else {
        // Fix the nodes.
        this.currentNodes.forEach((node: D3Node) => {
          node.fx = null;
          node.fy = null;
        });
        // Clear the link making stuff.
        this.nodes.on('mousedown', null);
        // Reenable the dragging.
        this.nodes.call(this.d3.drag()
        .on('start', dragStarted.bind(this))
        .on('drag', dragged.bind(this))
        .on('end', dragEnded.bind(this)));
        // Recalculate node positions.
        if (this.simulation) {
          this.restart();
        }
      }
    }
    if (oldView.currentNode !== this.view.currentNode) {
      if (this.view.currentNode) {
        this.d3Svg.select(`#id-${oldView.currentNode}`).select('.node-image')
        .attr('filter', null);
        this.d3Svg.select(`#id-${this.view.currentNode}`).select('.node-image')
        .attr('filter', 'url(#glow)');
      } else if (oldView.currentNode) {
        this.d3Svg.select(`#id-${oldView.currentNode}`).select('.node-image')
        .attr('filter', null);
      }
    }
  }
}

export function addAppropriateMouseActionsToNodes(this: TwigletGraphComponent, nodeEnter) {
  if (this.view.isEditing) {
    nodeEnter
        .on('mousedown', mouseDownOnNode.bind(this))
        .on('mouseup', mouseUpOnNode.bind(this));
  } else {
    nodeEnter.call(this.d3.drag()
      .on('start', dragStarted.bind(this))
      .on('drag', dragged.bind(this))
      .on('end', dragEnded.bind(this)));
  }
}
