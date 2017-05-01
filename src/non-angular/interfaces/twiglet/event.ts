import { Map } from 'immutable';

import { D3Node } from './node';
import { Link } from './link';

export interface Event {
  description?: string;
  id: string;
  links: Map<string, Link> | Link[];
  name: string;
  nodes: Map<string, D3Node> | D3Node[];
}
