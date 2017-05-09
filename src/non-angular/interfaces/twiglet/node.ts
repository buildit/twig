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
  end_at?: string;
  fixed?: number;
  fx?: number;
  fy?: number;
  gravityPoint?: string;
  hidden?: boolean;
  hiddenByFilters?: boolean;
  iconClass?: string;
  id: string;
  index?: number;
  location?: string;
  name?: string;
  px?: number;
  py?: number;
  radius?: number;
  size?: number;
  start_at?: string;
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
