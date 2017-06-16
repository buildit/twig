import { Attribute } from './attribute';
import { D3Node } from './node';

export interface Link {
  _color?: string;
  _size?: number;
  association?: string;
  attrs?: Array<Attribute>;
  central?: boolean;
  hidden?: boolean;
  id: string;
  source: string | D3Node;
  sourceOriginal?: string;
  target: string | D3Node;
  targetOriginal?: string;
}

export interface Links {
  data: Link[];
};
