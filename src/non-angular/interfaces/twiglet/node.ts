import { Attribute } from './attribute';

export class D3Node {
  attrs?: Array<Attribute>;
  color?: string;
  collapsed?: boolean;
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
