import { Map } from 'immutable';

import { D3Node } from './node';
import { Link } from './link';
import { ModelNodeAttribute } from './../model/index';

export interface Event {
  description?: string;
  id: string;
  links: Map<string, EventLink> | EventLink[];
  name: string;
  nodes: Map<string, EventD3Node> | EventD3Node[];
}

export interface EventLink {
  association?: string;
  attrs?: any[];
  id: string;
  source: string;
  target: string;
}

export interface EventD3Node {
  attrs?: Array<ModelNodeAttribute>;
  id: string;
  location?: string;
  name: string;
  type: string;
  x: number;
  y: number;
}
