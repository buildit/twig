import { clone } from 'ramda';
import { Selection } from 'd3-ng2-service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';
import { D3Node, Link, UserState } from '../../non-angular/interfaces';
import { TwigletGraphComponent }  from './twiglet-graph.component';
// Event Handlers
import {
  dragEnded,
  dragged,
  dragStarted,
  mouseDownOnNode,
  mouseUpOnNode,
} from './inputHandlers';

/**
 * Handles all of the changes the user makes by clicking, toggling things, etc.
 *
 * @param {UserStateServiceResponse} response The immutable map of nodes
 *
 * @export
 */
export function handleUserStateChanges (this: TwigletGraphComponent, response: UserState) {
  const oldUserState: UserState = clone(this.userState);
  userStateServiceResponseToObject.bind(this)(response);
  console.log(this.userState);
  if (this.nodes) {
    if (oldUserState.isEditing !== this.userState.isEditing) {
      if (this.userState.isEditing) {
        this.currentNodes.forEach((node: D3Node) => {
          node.fx = node.x;
          node.fy = node.y;
        });
        // Remove the dragging ability
        this.nodes.on('mousedown.drag', null);
        // Add the linking ability
        addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
      } else {
        // Fix the nodes.
        this.currentNodes.forEach((node: D3Node) => {
          node.fx = null;
          node.fy = null;
        });
        // Clear the link making stuff.
        this.nodes.on('mousedown', null);
        // Reenable the dragging.
        addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
        // Recalculate node positions.
        if (this.simulation) {
          this.restart();
        }
      }
    }
    if (oldUserState.currentNode !== this.userState.currentNode) {
      if (this.userState.currentNode) {
        this.d3Svg.select(`#id-${oldUserState.currentNode}`).select('.node-image')
        .attr('filter', null);
        this.d3Svg.select(`#id-${this.userState.currentNode}`).select('.node-image')
        .attr('filter', 'url(#glow)');
      } else if (oldUserState.currentNode) {
        this.d3Svg.select(`#id-${oldUserState.currentNode}`).select('.node-image')
        .attr('filter', null);
      }
    }
    if (oldUserState.showNodeLabels !== this.userState.showNodeLabels) {
      this.d3.selectAll('.node-name').classed('hidden', !this.userState.showNodeLabels);
    }
  }
}

/**
 * Adds the correct mouse responses to the nodes passed in.
 *
 * @param {Selection} nodes D3's linked nodes/svg elements
 *
 * @export
 */
export function addAppropriateMouseActionsToNodes(this: TwigletGraphComponent,
              nodes: Selection<SVGLineElement, any, null, undefined>) {
  if (this.userState.isEditing) {
    nodes
      .on('mousedown', mouseDownOnNode.bind(this))
      .on('mouseup', mouseUpOnNode.bind(this));
  } else {
    nodes.call(this.d3.drag()
      .on('start', dragStarted.bind(this))
      .on('drag', dragged.bind(this))
      .on('end', dragEnded.bind(this)));
  }
}
