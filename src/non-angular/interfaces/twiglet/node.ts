import { Attribute } from './attribute';

export class D3Node {
  attrs?: Array<Attribute>;
  color?: string;
  collapsed?: boolean;
  collapsedAutomatically?: boolean;
  connected?: number;
  depth?: number;
  end_at?: string;
  fixed?: number;
  fx?: number;
  fy?: number;
  hidden?: boolean;
  iconClass?: string;
  id: string;
  index?: number;
  location?: string;
  name?: string;
  px?: number;
  py?: number;
  radius?: number;
  size?: string;
  start_at?: string;
  type?: string;
  weight?: number;
  x?: number;
  y?: number;
}

export function isD3Node(d3Node: D3Node | string): d3Node is D3Node {
  return d3Node && (<D3Node>d3Node).id !== undefined;
}
