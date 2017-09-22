import { Attribute } from './attribute';
import { D3Node } from './node';
import { GravityPoint } from '../';

export interface View {
  _rev?: string;
  description?: string;
  links?: { [key: string]: ViewLink };
  name?: string;
  userState?: ViewUserState;
  nodes?: { [key: string]: ViewNode };
  url?: string;
}

export interface ViewUserState {
  autoConnectivity?: string;
  cascadingCollapse?: boolean;
  filters?: ViewUserStateFilters[];
  forceChargeStrength?: number;
  forceGravityX?: number;
  forceGravityY?: number;
  forceLinkDistance?: number;
  forceLinkStrength?: number;
  forceVelocityDecay?: number;
  gravityPoints?: {
    [key: string]: GravityPoint;
  };
  linkType?: string;
  runSimulation?: boolean;
  scale?: number;
  showLinkLabels?: boolean;
  showNodeLabels?: boolean;
  traverseDepth?: number;
  treeMode?: boolean;
}

export interface ViewUserStateFilters {
  attributes?: Array<Attribute>;
  types?: { [key: string]: boolean };
}

export interface ViewNav {
  'date-slider': Number;
  scale: String;
  'show-node-label': Boolean;
}

export interface ViewNode {
  fx?: number;
  fy?: number;
  hidden?: boolean;
  x?: number;
  y?: number;
}

export interface ViewLink {
  originalSource?: string;
  originalTarget?: string;
  source?: string;
  target?: string;
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
