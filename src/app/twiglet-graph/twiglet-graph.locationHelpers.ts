import { D3Node } from '../interfaces';

export function keepNodeInBounds (node: D3Node): D3Node {
  const left = this.margin;
  const right = this.width - this.margin;
  const top = this.margin;
  const bottom = this.height - this.margin;

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
