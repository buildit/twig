import { Nodes } from './node';
import { Links } from './link';
import { Views } from './view';
import { ChangeLogs } from './changelog';

export interface Twiglet {
  links: Links;
  nodes: Nodes;
  views: Views;
  changelogs: ChangeLogs;
}
