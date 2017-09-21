import { D3, D3Service, Selection, Force } from 'd3-ng2-service';
import { Map } from 'immutable';
import { clone, equals } from 'ramda';

import { ConnectType, D3Node, Link, UserState } from '../../../non-angular/interfaces';
import { getSizeFor } from './nodeAttributesToDOMAttributes';
import { NodeSearchPipe } from '../../shared/pipes/node-search.pipe';
import { scaleNodes } from './locationHelpers';
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
      if (oldUserState.get(USERSTATE.TREE_MODE) !== this.userState.get(USERSTATE.TREE_MODE)) {
        needToUpdateD3[USERSTATE.TREE_MODE] = true;
      }
      if (oldUserState.get(USERSTATE.ALPHA_TARGET) !== this.userState.get(USERSTATE.ALPHA_TARGET)) {
        this.simulation.alphaTarget(this.userState.get(USERSTATE.ALPHA_TARGET));
        needToUpdateD3[USERSTATE.ALPHA_TARGET] = true;
      }
      if (oldUserState.get(USERSTATE.SEPARATION_DISTANCE) !== this.userState.get(USERSTATE.SEPARATION_DISTANCE)) {
        needToUpdateD3[USERSTATE.SEPARATION_DISTANCE] = true;
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
      if (oldUserState.get(USERSTATE.RUN_SIMULATION) !== this.userState.get(USERSTATE.RUN_SIMULATION)) {
        if (this.userState.get(USERSTATE.RUN_SIMULATION)) {
          needToUpdateD3[USERSTATE.RUN_SIMULATION] = true;
        } else {
          this.stateService.userState.setSimulating(false);
          this.simulation.stop();
        }
      }
      if (oldUserState.get(USERSTATE.SHOW_NODE_LABELS) !== this.userState.get(USERSTATE.SHOW_NODE_LABELS)) {
        this.d3.selectAll('.node-name').classed('invisible', !this.userState.get(USERSTATE.SHOW_NODE_LABELS));
      }
      if (oldUserState.get(USERSTATE.SHOW_LINK_LABELS) !== this.userState.get(USERSTATE.SHOW_LINK_LABELS)) {
        this.d3.selectAll('.link-name').classed('invisible', !this.userState.get(USERSTATE.SHOW_LINK_LABELS));
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
      if (oldUserState.get(USERSTATE.LINK_TYPE) !== this.userState.get(USERSTATE.LINK_TYPE)) {
      this.linksG.selectAll('.link-group').remove();
        this.restart();
        this.updateLinkLocation();
        if (this.userState.get(USERSTATE.LINK_TYPE) === 'line') {
          this.links.attr('marker-end', 'url(#relation)');
        } else {
          this.links.attr('marker-end', null);
        }
      }
      if (oldUserState.get(USERSTATE.SCALE) !== this.userState.get(USERSTATE.SCALE)
          || oldUserState.get(USERSTATE.AUTO_CONNECTIVITY) !== this.userState.get(USERSTATE.AUTO_CONNECTIVITY)) {
        scaleNodes.bind(this)(this.allNodes);
        this.nodes
        .select('text.node-image')
          .attr('font-size', (d3Node: D3Node) => `${d3Node.radius}px`);
        this.nodes
        .select('text.node-name')
          .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12);
        needToUpdateD3[USERSTATE.SCALE] = true;
      }
      if (oldUserState.get(USERSTATE.FORCE_CHARGE_STRENGTH) !== this.userState.get(USERSTATE.FORCE_CHARGE_STRENGTH)
        || oldUserState.get(USERSTATE.FORCE_GRAVITY_X) !== this.userState.get(USERSTATE.FORCE_GRAVITY_X)
        || oldUserState.get(USERSTATE.FORCE_GRAVITY_Y) !== this.userState.get(USERSTATE.FORCE_GRAVITY_Y)
        || oldUserState.get(USERSTATE.FORCE_LINK_DISTANCE) !== this.userState.get(USERSTATE.FORCE_LINK_DISTANCE)
        || oldUserState.get(USERSTATE.FORCE_LINK_STRENGTH) !== this.userState.get(USERSTATE.FORCE_LINK_STRENGTH)
        || oldUserState.get(USERSTATE.FORCE_VELOCITY_DECAY) !== this.userState.get(USERSTATE.FORCE_VELOCITY_DECAY)) {
        needToUpdateD3['force'] = true;
      }
      if (oldUserState.get(USERSTATE.IS_EDITING_GRAVITY) !== this.userState.get(USERSTATE.IS_EDITING_GRAVITY)) {
        needToUpdateD3[USERSTATE.GRAVITY_POINTS] = true;
      }
      if (oldUserState.get(USERSTATE.GRAVITY_POINTS) !== this.userState.get(USERSTATE.GRAVITY_POINTS)) {
        needToUpdateD3[USERSTATE.GRAVITY_POINTS] = true;
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
        .on('end', dragEnded.bind(this)));
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

function cleanId(id: string) {
  if (id) {
    return id.split('.').join('\\.').split('#').join('\\#');
  }
  return null;
}
