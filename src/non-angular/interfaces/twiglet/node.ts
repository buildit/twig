import { ModelNodeAttribute } from './../model/index';

export class D3Node {
  _color?: string;
  _size?: number;
  attrs?: Array<ModelNodeAttribute>;
  color?: string;
  collapsed?: boolean;
  collapsedAutomatically?: boolean;
  connected?: number;
  depth?: number;
  fixed?: number;
  fx?: number;
  fy?: number;
  gravityPoint?: string;
  hidden?: boolean;
  hiddenByFilters?: boolean;
  id: string;
  index?: number;
  name?: string;
  radius?: number;
  size?: number;
  type?: string;
  sx?: number;
  sy?: number;
  weight?: number;
  x?: number;
  y?: number;
}

export function isD3Node(d3Node: D3Node | string): d3Node is D3Node {
  return d3Node && (<D3Node>d3Node).id !== undefined;
}
