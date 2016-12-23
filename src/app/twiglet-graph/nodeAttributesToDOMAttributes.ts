import { D3Node } from '../../non-angular/interfaces';

/**
 * Returns the correct image given a node type.
 *
 * @export
 * @param {D3Node} node
 * @returns {string}
 */
export function getNodeImage (node: D3Node): string {
    return node.type.toString();
  }

/**
 * Return the correct color for a node depending on it's type.
 *
 * @export
 * @param {D3Node} node
 * @returns {string}
 */
export function getColorFor (node: D3Node): string {
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
  return 35;
}
