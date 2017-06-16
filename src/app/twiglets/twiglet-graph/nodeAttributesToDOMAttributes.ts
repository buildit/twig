import { D3Node, Link } from '../../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';

/**
 * Returns the correct image given a node type.
 *
 * @export
 * @param {D3Node} node
 * @returns {string}
 */
export function getNodeImage (this: TwigletGraphComponent, node: D3Node) {
  const nodeImageErrorText = '';
  if (node.type in this.model.entities) {
    return this.model.entities[node.type].image;
  }

  console.warn(`getNodeImage. No image for: ${node.type}`);

  return nodeImageErrorText;
}

/**
 * Return the correct color for a node depending on it's type. If node has _color property, applies that color,
 * or just applies the default entity color for that type
 *
 * @export
 * @param {D3Node} node
 * @returns {string}
 */
export function getColorFor (this: TwigletGraphComponent, node: D3Node): string {
  const entity = this.model.entities[node.type];
  if (node._color) {
    return node._color;
  }
  if (entity) {
    if (!entity.color) {
      return '#000000';
    }
    return entity.color;
  }
  console.warn('node', node);
  console.warn(`Unexpected node.type '${node.type}' not supported in model`);
  console.warn(`model ${JSON.stringify(this.model)}`);
  return defaultColors.bind(this)(node);
}

export function getColorForLink (this: TwigletGraphComponent, link: Link): string {
  if (link._color) {
    return link._color;
  }
  return '#999999';
}

export function getSizeFor (this: TwigletGraphComponent, node: D3Node): number {
  const entity = this.model.entities[node.type];
  if (node._size) {
    return node._size;
  }
  if (entity) {
    if (entity.size && !this.userState.get('nodeSizingAutomatic')) {
      return +entity.size;
    }
    return node.radius || 20;
  }
}

export function getSizeForLink (this: TwigletGraphComponent, link: Link): number {
  if (link._size) {
    return link._size;
  }
  return 1;
}

export function defaultColors(this: TwigletGraphComponent, node: D3Node) {
  return '#000000';
}
