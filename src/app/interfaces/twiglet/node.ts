import { Attribute } from './attribute';

export class D3Node {
  x?: number;
  y?: number;
  id: String;
  type?: String;
  radius?: number;
  fixed?: number;
  attrs?: Array<Attribute>;
  depth?: number;
  connected?: number;
  name?: String;
  size?: String;
  location?: String;
  start_at?: String;
  end_at?: String;
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
