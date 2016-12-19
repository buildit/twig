import { Attribute } from './attribute';

export class D3Node {
  x?: number;
  y?: number;
  id: string;
  type?: string;
  radius?: number;
  fixed?: number;
  attrs?: Array<Attribute>;
  depth?: number;
  connected?: number;
  name?: string;
  size?: string;
  location?: string;
  start_at?: string;
  end_at?: string;
  index?: number;
  weight?: number;
  px?: number;
  py?: number;
  fx?: number;
  fy?: number;
}

export class Nodes {
  data: D3Node[];
}
