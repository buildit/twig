import { D3Node, Link } from '../../../non-angular/interfaces';
import { getSizeFor } from './nodeAttributesToDOMAttributes';
import { TwigletGraphComponent } from './twiglet-graph.component';

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
    const padding = 50;
    const gap = (this.height - (2 * padding)) / this.userState.get('levelFilterMax');
    node.y = !isNaN(node.depth) ? node.depth * gap + padding : padding;
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
  const nodeScale = this.d3.scaleLinear().range([3, 12]).domain(linkCountExtant);
  nodes.forEach((node: D3Node) => {
    node.radius = node._size ? node._size : Math.floor(nodeScale(node.connected) * this.userState.get('scale'));
  });
}
