import { D3Node } from './node';
import { Attribute } from './attribute';

export interface View {
  _rev?: string;
  description: string;
  links: { [key: string]: ViewLink };
  name: string;
  userState: ViewUserState;
  nodes: { [key: string]: ViewNode };
  url?: string;
}

export interface ViewUserState {
  forceChargeStrength: number;
  treeMode: boolean;
  forceLinkStrength: number;
  autoConnectivity: string;
  scale: number;
  nodeSizingAutomatic: boolean;
  traverseDepth: number;
  forceVelocityDecay: number;
  linkType: string;
  forceGravityX: number;
  bidirectionalLinks: boolean;
  showLinkLabels: boolean;
  forceGravityY: number;
  forceLinkDistance: number;
  autoScale: string;
  currentNode: boolean;
  filters: [ViewUserStateFilters];
  cascadingCollapse: boolean;
  showNodeLabels: boolean;
}

export interface ViewUserStateFilters {
  attributes: Array<Attribute>;
  types: { [key: string]: boolean };
}

export interface ViewNav {
  'date-slider': Number;
  scale: String;
  'show-node-label': Boolean;
}

export interface ViewNode {
  fx: number;
  fy: number;
  hidden: boolean;
  x: number;
  y: number;
}

export interface ViewLink {
  originalSource: string;
  originalTarget: string;
  source: string;
  target: string;
}

export interface Views {
  data: View[];
}
export interface ViewNav {
  'date-slider': Number;
  scale: String;
  'show-node-label': Boolean;
}

export interface Views {
  data: View[];
}
