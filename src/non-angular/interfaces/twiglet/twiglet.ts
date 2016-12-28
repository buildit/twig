import { ChangeLog } from './changelog';
import { Link } from './link';
import { Model } from './model';
import { D3Node } from './node';

export interface Twiglet {
  changeLogs: ChangeLog[];
  links: Link[];
  model: Model;
  nodes: D3Node[];
};
