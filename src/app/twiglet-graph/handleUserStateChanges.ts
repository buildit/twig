import { clone, equals } from 'ramda';
import { Selection, D3 } from 'd3-ng2-service';
import { Map } from 'immutable';
import { D3Node, Link, UserState, ConnectType } from '../../non-angular/interfaces';
import { TwigletGraphComponent }  from './twiglet-graph.component';
import { NodeSearchPipe } from '../node-search.pipe';
import { scaleNodes } from './locationHelpers';
// Event Handlers
import {
  clickLink,
  dblClickNode,
  dragEnded,
  dragged,
  dragStarted,
  mouseDownOnNode,
  mouseUpOnNode,
  nodeClicked,
} from './inputHandlers';

/**
 * Handles all of the changes the user makes by clicking, toggling things, etc.
 *
 * @param {UserState} response The immutable map of nodes
 *
 * @export
 */
export function handleUserStateChanges (this: TwigletGraphComponent, response: Map<string, any>) {
  const oldUserState = this.userState;
  this.userState = response;
  if (this.nodes) {
    let needToUpdateD3 = false;
    if (oldUserState.get('isEditing') !== this.userState.get('isEditing')) {
      if (this.userState.get('isEditing')) {
        this.simulation.stop();
        // Remove the dragging ability
        this.nodes.on('mousedown.drag', null);
        // Add the linking ability
        addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
        if (this.links) {
          this.d3.selectAll('.circle').classed('invisible', !this.userState.get('isEditing'));
          this.updateCircleLocation();
          addAppropriateMouseActionsToLinks.bind(this)(this.links);
        }
      } else {
        // Fix the nodes.
        this.simulation.restart();
        // Clear the link making stuff.
        this.nodes.on('mousedown', null);
        // Remove the circles
        this.d3.selectAll('.circle').classed('invisible', !this.userState.get('isEditing'));
        // Reenable the dragging.
        addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
        // Recalculate node positions.
        if (this.simulation) {
          this.restart();
        }
      }
    }
    if (oldUserState.get('currentNode') !== this.userState.get('currentNode')) {
      if (this.userState.get('currentNode')) {
        this.d3Svg.select(`#id-${oldUserState.get('currentNode')}`).select('.node-image')
        .attr('filter', null);
        this.d3Svg.select(`#id-${this.userState.get('currentNode')}`).select('.node-image')
        .attr('filter', 'url(#glow)');
      } else if (oldUserState.get('currentNode')) {
        this.d3Svg.select(`#id-${oldUserState.get('currentNode')}`).select('.node-image')
        .attr('filter', null);
      }
    }
    if (oldUserState.get('showNodeLabels') !== this.userState.get('showNodeLabels')) {
      this.d3.selectAll('.node-name').classed('invisible', !this.userState.get('showNodeLabels'));
    }
    if (oldUserState.get('showLinkLabels') !== this.userState.get('showLinkLabels')) {
      this.d3.selectAll('.link-name').classed('invisible', !this.userState.get('showLinkLabels'));
    }
    if (!equals(oldUserState.get('filters').toJS(), this.userState.get('filters').toJS())) {
      needToUpdateD3 = true;
    }
    if (oldUserState.get('textToFilterOn') !== this.userState.get('textToFilterOn')) {
      if (!this.userState.get('textToFilterOn')) {
        this.nodes.style('opacity', 1.0);
      } else {
        const nodeSearchPipe = new NodeSearchPipe();
        this.nodes.style('opacity', (d3Node: D3Node) => {
          return nodeSearchPipe.transform([d3Node], this.userState.get('textToFilterOn')).length === 1 ? 1.0 : 0.1;
        });
      }
    }
    if (oldUserState.get('linkType') !== this.userState.get('linkType')) {
      this.linksG.selectAll('.link-group').remove();
      this.restart();
      this.updateLinkLocation();
      if (this.userState.get('linkType') === 'line') {
        this.links.attr('marker-end', 'url(#relation)');
      } else {
        this.links.attr('marker-end', null);
      }
    }
    if (oldUserState.get('scale') !== this.userState.get('scale')) {
      scaleNodes.bind(this)(this.currentlyGraphedNodes);
      this.nodes
      .select('text.node-image')
        .attr('font-size', (d3Node: D3Node) => `${d3Node.radius}px`);
      this.nodes
      .select('text.node-name')
        .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12);
      needToUpdateD3 = true;
    }
    if (oldUserState.get('forceChargeStrength') !== this.userState.get('forceChargeStrength')
      || oldUserState.get('forceGravityX') !== this.userState.get('forceGravityX')
      || oldUserState.get('forceGravityY') !== this.userState.get('forceGravityY')
      || oldUserState.get('forceLinkDistance') !== this.userState.get('forceLinkDistance')
      || oldUserState.get('forceLinkStrength') !== this.userState.get('forceLinkStrength')
      || oldUserState.get('forceVelocityDecay') !== this.userState.get('forceVelocityDecay')) {
      needToUpdateD3 = true;
    }
    if (needToUpdateD3) {
      this.updateSimulation();
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
  nodes
    .on('dblclick', dblClickNode.bind(this))
    .on('click', nodeClicked.bind(this));
  if (this.userState.get('isEditing')) {
    nodes
      .on('mousedown', mouseDownOnNode.bind(this))
      .on('mouseup', mouseUpOnNode.bind(this))
      .on('dblclick', dblClickNode.bind(this));
  } else {
    nodes
    .call(this.d3.drag()
      .on('start', dragStarted.bind(this))
      .on('drag', dragged.bind(this))
      .on('end', dragEnded.bind(this)));
  }
}

export function addAppropriateMouseActionsToLinks(this: TwigletGraphComponent,
              links: Selection<SVGLineElement, any, null, undefined>) {
  if (this.userState.get('isEditing')) {
    links.on('click', clickLink.bind(this));
  }
}
