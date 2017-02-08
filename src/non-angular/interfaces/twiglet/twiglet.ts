import { Map } from 'immutable';
import { ChangeLog } from './changelog';
import { Link } from './link';
import { D3Node } from './node';

export interface Twiglet {
  _rev?: string;
  description?: string;
  links?: Map<string, Link> | Link[];
  model_url?: string;
  name?: string;
  nodes?: Map<string, D3Node> | D3Node[];
  url?: string;
}

export interface TwigletToSend extends Twiglet {
  commitMessage: string;
}
