import { clone } from 'ramda';
import { Selection, D3 } from 'd3-ng2-service';
import { userStateServiceResponseToObject } from '../../non-angular/services-helpers';
import { D3Node, Link, UserState, ConnectType } from '../../non-angular/interfaces';
import { TwigletGraphComponent }  from './twiglet-graph.component';
import { NodeSearchPipe } from '../node-search.pipe';
import { FilterEntitiesPipe } from '../filter-entities.pipe';
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
export function handleUserStateChanges (this: TwigletGraphComponent, response: UserState) {
  const oldUserState: UserState = clone(this.userState);
  userStateServiceResponseToObject.bind(this)(response);
  if (this.nodes) {
    let needToUpdateD3 = false;
    if (oldUserState.isEditing !== this.userState.isEditing) {
      if (this.userState.isEditing) {
        this.simulation.stop();
        // Remove the dragging ability
        this.nodes.on('mousedown.drag', null);
        // Add the linking ability
        addAppropriateMouseActionsToNodes.bind(this)(this.nodes);
        if (this.links) {
          this.d3.selectAll('.circle').classed('invisible', !this.userState.isEditing);
          console.log(this.links);
          addAppropriateMouseActionsToLinks.bind(this)(this.links);
        }
      } else {
        // Fix the nodes.
        this.simulation.restart();
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
      this.d3.selectAll('.node-name').classed('invisible', !this.userState.showNodeLabels);
    }
    if (oldUserState.showLinkLabels !== this.userState.showLinkLabels) {
      this.d3.selectAll('.link-name').classed('invisible', !this.userState.showLinkLabels);
    }
    if (oldUserState.filterEntities !== this.userState.filterEntities) {
      if (!this.userState.filterEntities.length) {
        this.nodes.style('opacity', 1.0);
        this.links.style('opacity', 1.0);
      } else {
        const filterEntitiesPipe = new FilterEntitiesPipe();
        this.nodes.style('opacity', (d3Node: D3Node) => {
          this.links.style('opacity', 0);
          return filterEntitiesPipe.transform([d3Node], this.userState.filterEntities).length === 1 ? 1.0 : 0;
        });
      }
    }
    if (oldUserState.textToFilterOn !== this.userState.textToFilterOn) {
      if (!this.userState.textToFilterOn) {
        this.nodes.style('opacity', 1.0);
      } else {
        const nodeSearchPipe = new NodeSearchPipe();
        this.nodes.style('opacity', (d3Node: D3Node) => {
          return nodeSearchPipe.transform([d3Node], this.userState.textToFilterOn).length === 1 ? 1.0 : 0.1;
        });
      }
    }
    if (oldUserState.linkType !== this.userState.linkType) {
      this.linksG.selectAll('.link-group').remove();
      this.restart();
      this.updateLinkLocation();
    }
    if (oldUserState.scale !== this.userState.scale) {
      scaleNodes.bind(this)();
      this.nodes
      .select('text.node-image')
        .attr('font-size', (d3Node: D3Node) => `${d3Node.radius}px`);
      this.nodes
      .select('text.node-name')
        .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12);
      needToUpdateD3 = true;
    }
    if (oldUserState.forceChargeStrength !== this.userState.forceChargeStrength
      || oldUserState.forceGravityX !== this.userState.forceGravityX
      || oldUserState.forceGravityY !== this.userState.forceGravityY
      || oldUserState.forceLinkDistance !== this.userState.forceLinkDistance
      || oldUserState.forceLinkStrength !== this.userState.forceLinkStrength
      || oldUserState.forceVelocityDecay !== this.userState.forceVelocityDecay) {
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
  if (this.userState.isEditing) {
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
  if (this.userState.isEditing) {
    console.log('mouse actions applied');
    console.log(links);
    links.on('click', clickLink.bind(this));
  }
}

export function scaleNodes(this: TwigletGraphComponent) {
  if (this.userState.nodeSizingAutomatic) {
    this.currentlyGraphedNodes.forEach((node: D3Node) => {
      if (this.userState.autoConnectivity === 'in') {
        node.connected = this.linkSourceMap[node.id] ? this.linkSourceMap[node.id].length : 0;
      } else if (this.userState.autoConnectivity === 'out') {
        node.connected = this.linkTargetMap[node.id] ? this.linkTargetMap[node.id].length : 0;
      } else if (this.userState.autoConnectivity === 'both') {
        node.connected = (this.linkSourceMap[node.id] ? this.linkSourceMap[node.id].length : 0) +
          (this.linkTargetMap[node.id] ? this.linkTargetMap[node.id].length : 0);
      }
    });
  }
  const linkCountExtant = this.d3.extent(this.currentlyGraphedNodes, (node: D3Node) => node.connected);
  let nodeScale;
  switch (this.userState.autoScale) {
    case 'sqrt':
      nodeScale = this.d3.scaleSqrt().range([3, 12]).domain(linkCountExtant);
      break;
    case 'power':
      nodeScale = this.d3.scalePow().range([3, 12]).domain(linkCountExtant);
      break;
    default: // 'linear'
      nodeScale = this.d3.scaleLinear().range([3, 12]).domain(linkCountExtant);
      break;
  }
  this.currentlyGraphedNodes.forEach((node: D3Node) => {
    node.radius = Math.floor(nodeScale(node.connected) * this.userState.scale);
  });
}
