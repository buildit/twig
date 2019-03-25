import { D3, D3Service, Selection, Force } from 'd3-ng2-service';
import { Map } from 'immutable';
import { clone, equals } from 'ramda';

import { ConnectType, D3Node, Link, UserState } from '../../../non-angular/interfaces';
import { getSizeFor } from './nodeAttributesToDOMAttributes';
import { NodeSearchPipe } from '../../shared/pipes/node-search.pipe';
import { TwigletGraphComponent } from './twiglet-graph.component';
import USERSTATE from '../../../non-angular/services-helpers/userState/constants';

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
      if (oldUserState.get(USERSTATE.IS_EDITING) !== this.userState.get(USERSTATE.IS_EDITING)
          || oldUserState.get(USERSTATE.IS_EDITING_GRAVITY) !== this.userState.get(USERSTATE.IS_EDITING_GRAVITY)) {
        if (this.userState.get(USERSTATE.IS_EDITING)) {
          this.restart();
          this.simulation.stop();
          // Remove the dragging ability
          this.nodes.on('mousedown.drag', null);
          // Add the linking ability
          addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
          if (this.links) {
            this.d3.selectAll('.circle').classed('invisible', !this.userState.get(USERSTATE.IS_EDITING));
            this.ticked();
            addAppropriateMouseActionsToLinks.bind(this)(this.links);
          }
        } else {
          // Fix the nodes.
          this.simulation.restart();
          // Clear the link making stuff.
          this.nodes.on('mousedown', null);
          this.nodes.on('mousedown.drag', null);
          // Remove the circles
          this.d3.selectAll('.circle').classed('invisible', !this.userState.get(USERSTATE.IS_EDITING));
          // Reenable the dragging.
          addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
          addAppropriateMouseActionsToGravityPoints.bind(this)(this.gravityPoints);
          // Recalculate node positions.
          if (this.simulation) {
            this.restart();
          }
        }
      }
      if (oldUserState.get(USERSTATE.CURRENT_NODE) !== this.userState.get(USERSTATE.CURRENT_NODE)) {
        if (this.userState.get(USERSTATE.CURRENT_NODE)) {
          const oldNode = this.d3Svg.select(`#id-${cleanId(oldUserState.get(USERSTATE.CURRENT_NODE))}`).select('.node-image');
          oldNode.attr('filter', null);
          const newNode = this.d3Svg.select(`#id-${cleanId(this.userState.get(USERSTATE.CURRENT_NODE))}`).select('.node-image');
          newNode.attr('filter', 'url(#glow)');
        } else if (oldUserState.get(USERSTATE.CURRENT_NODE)) {
          this.d3Svg.select(`#id-${cleanId(oldUserState.get(USERSTATE.CURRENT_NODE))}`).select('.node-image')
          .attr('filter', null);
        }
      }
      if (oldUserState.get(USERSTATE.HIGHLIGHTED_NODE) !== this.userState.get(USERSTATE.HIGHLIGHTED_NODE)) {
        const currentNode = this.userState.get(USERSTATE.CURRENT_NODE);
        Reflect.ownKeys(this.toBeHighlighted.nodes).forEach(nodeId => {
          if (currentNode !== nodeId) {
            this.d3Svg.select(`#id-${cleanId(nodeId as string)}`).select('.node-image').attr('filter', null);
          }
        });
        Reflect.ownKeys(this.toBeHighlighted.links).forEach(linkId => {
          this.d3Svg.select(`#id-${cleanId(linkId as string)}`).select('path.link').attr('filter', null);
        });
        this.toBeHighlighted.nodes = {};
        this.toBeHighlighted.links = {};
        if (this.userState.get(USERSTATE.HIGHLIGHTED_NODE)) {
          this.d3Svg.select(`#id-${cleanId(this.userState.get(USERSTATE.HIGHLIGHTED_NODE))}`)
          .select('.node-image').attr('filter', 'url(#glow)');
          getNodesAndLinksToBeHighlighted.bind(this)(this.userState.get(USERSTATE.HIGHLIGHTED_NODE));
          Reflect.ownKeys(this.toBeHighlighted.nodes).forEach(nodeId => {
            this.d3Svg.select(`#id-${cleanId(nodeId as string)}`).select('.node-image').attr('filter', 'url(#nodetree)');
          });
          Reflect.ownKeys(this.toBeHighlighted.links).forEach(linkId => {
            this.d3Svg.select(`#id-${cleanId(linkId as string)}`).select('path.link').attr('filter', 'url(#nodetree)');
          });
          this.toBeHighlighted.nodes[this.userState.get(USERSTATE.HIGHLIGHTED_NODE)] = true;
        }
      }
      if (oldUserState.get(USERSTATE.TEXT_TO_FILTER_ON) !== this.userState.get(USERSTATE.TEXT_TO_FILTER_ON)) {
        if (!this.userState.get(USERSTATE.TEXT_TO_FILTER_ON)) {
          this.nodes.style('opacity', 1.0);
        } else {
          const nodeSearchPipe = new NodeSearchPipe();
          this.nodes.style('opacity', (d3Node: D3Node) => {
            return nodeSearchPipe.transform([d3Node], this.userState.get(USERSTATE.TEXT_TO_FILTER_ON)).length === 1 ? 1.0 : 0.1;
          });
        }
      }
      if (oldUserState.get(USERSTATE.IS_EDITING_GRAVITY) !== this.userState.get(USERSTATE.IS_EDITING_GRAVITY)) {
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
    if (this.userState.get(USERSTATE.IS_EDITING)) {
      nodes
        .on('mousedown', mouseDownOnNode.bind(this))
        .on('mouseup', mouseUpOnNode.bind(this))
        .on('dblclick', dblClickNode.bind(this));
    } else if (this.userState.get(USERSTATE.IS_EDITING_GRAVITY)) {
      nodes
        .on('mousedown', mouseDownOnNode.bind(this))
        .on('mousedown.drag', null);
    } else {
      nodes
      .call(this.d3.drag()
        .on('start', dragStarted.bind(this))
        .on('drag', dragged.bind(this))
        .on('end', dragEnded.bind(this)) as any);
    }
  });
}

export function addAppropriateMouseActionsToLinks(this: TwigletGraphComponent,
              links: Selection<SVGLineElement, any, null, undefined>) {
  this.ngZone.run(() => {
    if (this.userState.get(USERSTATE.IS_EDITING)) {
      links.on('click', clickLink.bind(this));
    }
  });
}

export function addAppropriateMouseActionsToGravityPoints(this: TwigletGraphComponent,
              gravityPoints: Selection<SVGLineElement, any, null, undefined>) {
  this.ngZone.run(() => {
    if (this.userState.get(USERSTATE.IS_EDITING_GRAVITY)) {
      gravityPoints
        .on('mouseup', mouseUpOnGravityPoint.bind(this))
        .call(this.d3.drag()
          .on('start', gravityPointDragStart.bind(this))
          .on('drag', gravityPointDragged.bind(this))
          .on('end', gravityPointDragEnded.bind(this)) as any);
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

function cleanId(id: string) {
  if (id) {
    return id.split('.').join('\\.').split('#').join('\\#');
  }
  return null;
}
