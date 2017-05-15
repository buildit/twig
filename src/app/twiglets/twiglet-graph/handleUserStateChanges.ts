import { D3, D3Service, Selection, Force } from 'd3-ng2-service';
import { Map } from 'immutable';
import { clone, equals } from 'ramda';

import { ConnectType, D3Node, Link, UserState } from '../../../non-angular/interfaces';
import { getSizeFor } from './nodeAttributesToDOMAttributes';
import { NodeSearchPipe } from '../../shared/pipes/node-search.pipe';
import { scaleNodes } from './locationHelpers';
import { TwigletGraphComponent } from './twiglet-graph.component';

// Event Handlers
import {
  clickLink,
  dblClickNode,
  dragEnded,
  dragged,
  dragStarted,
  gravityPointDragEnded,
  gravityPointDragged,
  gravityPointDragStart,
  mouseDownOnNode,
  mouseUpOnGravityPoint,
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
  this.ngZone.runOutsideAngular(() => {
    const oldUserState = this.userState;
    this.userState = response;
    if (this.nodes) {
      const needToUpdateD3 = {};
      if (oldUserState.get('isEditing') !== this.userState.get('isEditing')
          || oldUserState.get('isEditingGravity') !== this.userState.get('isEditingGravity')) {
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
          this.nodes.on('mousedown.drag', null);
          // Remove the circles
          this.d3.selectAll('.circle').classed('invisible', !this.userState.get('isEditing'));
          // Reenable the dragging.
          addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
          addAppropriateMouseActionsToGravityPoints.bind(this)(this.gravityPoints);
          // Recalculate node positions.
          if (this.simulation) {
            this.restart();
          }
        }
      }
      if (oldUserState.get('currentNode') !== this.userState.get('currentNode')) {
        if (this.userState.get('currentNode')) {
          const oldNode = this.d3Svg.select(`#id-${oldUserState.get('currentNode')}`).select('.node-image');
          oldNode.attr('filter', null);
          const newNode = this.d3Svg.select(`#id-${this.userState.get('currentNode')}`).select('.node-image');
          newNode.attr('filter', 'url(#glow)');
        } else if (oldUserState.get('currentNode')) {
          this.d3Svg.select(`#id-${oldUserState.get('currentNode')}`).select('.node-image')
          .attr('filter', null);
        }
      }
      if (oldUserState.get('alphaTarget') !== this.userState.get('alphaTarget')) {
        this.simulation.alphaTarget(this.userState.get('alphaTarget'));
        needToUpdateD3['alphaTarget'] = true;
      }
      if (oldUserState.get('separationDistance') !== this.userState.get('separationDistance')) {
        needToUpdateD3['separationDistance'] = true;
      }
      if (oldUserState.get('highlightedNode') !== this.userState.get('highlightedNode')) {
        const currentNode = this.userState.get('currentNode');
        Reflect.ownKeys(this.toBeHighlighted.nodes).forEach(nodeId => {
          if (currentNode !== nodeId) {
            this.d3Svg.select(`#id-${nodeId}`).select('.node-image').attr('filter', null);
          }
        });
        Reflect.ownKeys(this.toBeHighlighted.links).forEach(linkId => {
          this.d3Svg.select(`#id-${linkId}`).select('path.link').attr('filter', null);
        });
        this.toBeHighlighted.nodes = {};
        this.toBeHighlighted.links = {};
        if (this.userState.get('highlightedNode')) {
          this.d3Svg.select(`#id-${this.userState.get('highlightedNode')}`).select('.node-image').attr('filter', 'url(#glow)');
          getNodesAndLinksToBeHighlighted.bind(this)(this.userState.get('highlightedNode'));
          Reflect.ownKeys(this.toBeHighlighted.nodes).forEach(nodeId => {
            this.d3Svg.select(`#id-${nodeId}`).select('.node-image').attr('filter', 'url(#nodetree)');
          });
          Reflect.ownKeys(this.toBeHighlighted.links).forEach(linkId => {
            this.d3Svg.select(`#id-${linkId}`).select('path.link').attr('filter', 'url(#nodetree)');
          });
          this.toBeHighlighted.nodes[this.userState.get('highlightedNode')] = true;
        }
      }
      if (oldUserState.get('showNodeLabels') !== this.userState.get('showNodeLabels')) {
        this.d3.selectAll('.node-name').classed('invisible', !this.userState.get('showNodeLabels'));
      }
      if (oldUserState.get('showLinkLabels') !== this.userState.get('showLinkLabels')) {
        this.d3.selectAll('.link-name').classed('invisible', !this.userState.get('showLinkLabels'));
      }
      if (oldUserState.get('filters') !== this.userState.get('filters')) {
        needToUpdateD3['filters'] = true;
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
      if (oldUserState.get('nodeSizingAutomatic') !== this.userState.get('nodeSizingAutomatic')) {
        this.nodes
        .select('.node-image')
          .attr('font-size', (d3Node: D3Node) => `${getSizeFor.bind(this)(d3Node)}px`);
      }
      if (oldUserState.get('scale') !== this.userState.get('scale')
          || oldUserState.get('autoConnectivity') !== this.userState.get('autoConnectivity')) {
        scaleNodes.bind(this)(this.currentlyGraphedNodes);
        this.nodes
        .select('text.node-image')
          .attr('font-size', (d3Node: D3Node) => `${d3Node.radius}px`);
        this.nodes
        .select('text.node-name')
          .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12);
        needToUpdateD3['scale'] = true;
      }
      if (oldUserState.get('forceChargeStrength') !== this.userState.get('forceChargeStrength')
        || oldUserState.get('forceGravityX') !== this.userState.get('forceGravityX')
        || oldUserState.get('forceGravityY') !== this.userState.get('forceGravityY')
        || oldUserState.get('forceLinkDistance') !== this.userState.get('forceLinkDistance')
        || oldUserState.get('forceLinkStrength') !== this.userState.get('forceLinkStrength')
        || oldUserState.get('forceVelocityDecay') !== this.userState.get('forceVelocityDecay')) {
        needToUpdateD3['force'] = true;
      }
      if (oldUserState.get('isEditingGravity') !== this.userState.get('isEditingGravity')) {
        needToUpdateD3['gravityPoints'] = true;
      }
      if (oldUserState.get('gravityPoints') !== this.userState.get('gravityPoints')) {
        needToUpdateD3['gravityPoints'] = true;
      }
      if (Reflect.ownKeys(needToUpdateD3).length) {
        this.updateSimulation();
      }
    }
  });
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
  this.ngZone.run(() => {
    nodes
      .on('dblclick', dblClickNode.bind(this))
      .on('click', nodeClicked.bind(this));
    if (this.userState.get('isEditing')) {
      nodes
        .on('mousedown', mouseDownOnNode.bind(this))
        .on('mouseup', mouseUpOnNode.bind(this))
        .on('dblclick', dblClickNode.bind(this));
    } else if (this.userState.get('isEditingGravity')) {
      nodes
        .on('mousedown', mouseDownOnNode.bind(this))
        .on('mousedown.drag', null);
    } else {
      nodes
      .call(this.d3.drag()
        .on('start', dragStarted.bind(this))
        .on('drag', dragged.bind(this))
        .on('end', dragEnded.bind(this)));
    }
  });
}

export function addAppropriateMouseActionsToLinks(this: TwigletGraphComponent,
              links: Selection<SVGLineElement, any, null, undefined>) {
  this.ngZone.run(() => {
    if (this.userState.get('isEditing')) {
      links.on('click', clickLink.bind(this));
    }
  });
}

export function addAppropriateMouseActionsToGravityPoints(this: TwigletGraphComponent,
              gravityPoints: Selection<SVGLineElement, any, null, undefined>) {
  this.ngZone.run(() => {
    if (this.userState.get('isEditingGravity')) {
      gravityPoints
        .on('mouseup', mouseUpOnGravityPoint.bind(this))
        .call(this.d3.drag()
          .on('start', gravityPointDragStart.bind(this))
          .on('drag', gravityPointDragged.bind(this))
          .on('end', gravityPointDragEnded.bind(this)));
    }
  });
}

function getNodesAndLinksToBeHighlighted(this: TwigletGraphComponent, d3NodeId) {
  const d3Node = this.allNodesObject[d3NodeId];
  (this.linkSourceMap[d3Node.id] || []).forEach(linkId => {
    this.toBeHighlighted.links[linkId] = true;
    const target = this.allLinksObject[linkId].target as D3Node;
    if (!this.toBeHighlighted.nodes[target.id]) {
      this.toBeHighlighted.nodes[target.id] = true;
      getNodesAndLinksToBeHighlighted.bind(this)(target.id);
    }
  });
}
