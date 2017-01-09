import { D3Node } from '../../non-angular/interfaces';

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
