import { Attribute } from './attribute';
export interface View {
  _id: String;
  collapsed_nodes: Array<String>;
  description: String;
  display_name: String;
  fixed_nodes: FixedNodes;
  link_types: ViewType;
  name: String;
  nav: ViewNav;
  node_types: ViewType;
}

export interface ViewToSend {
  _rev?: string;
  description: string;
  name: string;
  userState: ViewUserState;
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
  filters: ViewUserStateFilters;
  cascadingCollapse: boolean;
  showNodeLabels: boolean;
}

export interface ViewUserStateFilters {
  attributes: Array<Attribute>;
  types: { [key: string]: boolean };
}

export interface ViewType {

}

export interface FixedNodes {

}

export interface ViewNav {
  'date-slider': Number;
  scale: String;
  'show-node-label': Boolean;
}

export interface Views {
  data: View[];
}
