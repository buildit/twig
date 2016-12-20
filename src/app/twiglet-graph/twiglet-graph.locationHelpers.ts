import { D3Node } from '../../non-angular/interfaces';

import { TwigletGraphComponent } from './twiglet-graph.component';

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

  // Keep the node still if we are editing.
  if (this.view.isEditing) {
    if (!node.fx) {
      node.fx = node.x;
    }
    if (!node.fy) {
      node.fy = node.y;
    }
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

function randomIntFromInterval (min, max): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
