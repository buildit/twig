import { D3Node, Link } from '../../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { getSizeFor } from './nodeAttributesToDOMAttributes';

/**
 * This keeps the node in bounds because D3 tries to throw them off the screen. Also assigns
 * and x and y to nodes that are initialized without one.
 *
 * @export
 * @param {D3Node} node
 * @returns {D3Node}
 */
export function keepNodeInBounds (this: TwigletGraphComponent, node: D3Node): D3Node {
  const left = this.margin;
  const right = this.width - this.margin;
  const top = this.margin;
  const bottom = this.height - this.margin;

  if (!node.x) {
    node.x = randomIntFromInterval(left, right);
  }
  if (!node.y) {
    node.y = randomIntFromInterval(top, bottom);
  }

  // Left and right.
  if (node.x < left) {
    node.x = left;
  } else if (node.x > right) {
    node.x = right;
  }

  // Top and bottom
  if (node.y < top) {
    node.y = top;
  } else if (node.y > bottom) {
    node.y = bottom;
  }

  if (this.userState.get('treeMode')) {
    this.simulation.nodes().forEach(d3Node => {
      d3Node.y = !isNaN(d3Node.depth) ? d3Node.depth * 100 + 100 : 100;
    });
  }

  return node;
}

/**
 * Convienience function to a get a random number between two numbers.
 *
 * @param {any} min
 * @param {any} max
 * @returns {number}
 */
function randomIntFromInterval (min, max): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function scaleNodes(this: TwigletGraphComponent, nodes: D3Node[]) {
  if (this.userState.get('nodeSizingAutomatic')) {
    nodes.forEach((node: D3Node) => {
      if (this.userState.get('autoConnectivity') === 'in') {
        node.connected = this.linkSourceMap[node.id] ? this.linkSourceMap[node.id].length : 0;
      } else if (this.userState.get('autoConnectivity') === 'out') {
        node.connected = this.linkTargetMap[node.id] ? this.linkTargetMap[node.id].length : 0;
      } else if (this.userState.get('autoConnectivity') === 'both') {
        node.connected = (this.linkSourceMap[node.id] ? this.linkSourceMap[node.id].length : 0) +
          (this.linkTargetMap[node.id] ? this.linkTargetMap[node.id].length : 0);
      }
    });
    const linkCountExtant = this.d3.extent(nodes, (node: D3Node) => node.connected);
    let nodeScale;
    switch (this.userState.get('autoScale')) {
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
    nodes.forEach((node: D3Node) => {
      node.radius = node._size ? node._size : Math.floor(nodeScale(node.connected) * this.userState.get('scale'));
    });
  } else {
    nodes.forEach((node: D3Node) => {
      node.radius = getSizeFor.bind(this)(node);
    });
  }
}

export function setDepths(twigletGraph: TwigletGraphComponent, graphedLinks: Link[]) {
  function followTargets(node: D3Node, currentDepth = 0) {
    (twigletGraph.linkSourceMap[node.id] || []).forEach(linkId => {
      const target = <D3Node>twigletGraph.allLinksObject[linkId].target;
      if (!target.depth) {
        target.depth = currentDepth + 1;
        followTargets(target, currentDepth + 1);
      }
    });
  }
  const topNodes = twigletGraph.allNodes.filter(node => !twigletGraph.linkTargetMap[node.id]);
  topNodes.forEach(followTargets);
}
