import { D3Node } from '../../../non-angular/interfaces';
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
 * Return the correct color for a node depending on it's type.
 *
 * @export
 * @param {D3Node} node
 * @returns {string}
 */
export function getColorFor (this: TwigletGraphComponent, node: D3Node): string {
  const entity = this.model.entities[node.type];
  if (entity) {
    return entity.color;
  }
  console.warn(`Unexpected node.type '${node.type}' not supported in model`);
  console.warn(`model ${JSON.stringify(this.model)}`);
  return defaultColors.bind(this)(node);
}

export function defaultColors(this: TwigletGraphComponent, node: D3Node) {
  return '#000000';
}

/**
 * Gets the radius of a node depending on the view.
 *
 * @export
 * @param {D3Node} node
 * @returns {number}
 */
export function getRadius (node: D3Node): number {
  return node.radius;
}
