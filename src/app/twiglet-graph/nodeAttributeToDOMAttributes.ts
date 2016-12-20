import { D3Node } from '../../non-angular/interfaces';

export function getNodeImage (node: D3Node): string {
    return node.type.toString();
  }

export function colorFor (node: D3Node): string {
  return '#000000';
}

export function getRadius (node: D3Node): number {
  return 35;
}
