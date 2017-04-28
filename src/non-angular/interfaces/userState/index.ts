import { Attribute } from '../twiglet/attribute';

export interface UserState {
  activeModel?: boolean;
  activeTwiglet?: boolean;
  addingGravityPoints?: boolean;
  autoConnectivity?: ConnectType;
  autoScale?: ScaleType;
  bidirectionalLinks?: boolean;
  cascadingCollapse?: boolean;
  copiedNodeId?: string;
  currentNode?: string;
  currentViewName?: string;
  editTwigletModel?: boolean;
  filters?: Object;
  forceChargeStrength?: number;
  forceGravityX?: number;
  forceGravityY?: number;
  forceLinkDistance?: number;
  forceLinkStrength?: number;
  forceVelocityDecay?: number;
  formValid?: boolean;
  gravityPoints?: {
    [key: string]: GravityPoint;
  };
  isEditing?: boolean;
  isEditingGravity?: boolean;
  linkType?: LinkType;
  ping?: Object;
  nodeSizingAutomatic?: boolean;
  nodeTypeToBeAdded?: string;
  scale?: number;
  showLinkLabels?: boolean;
  showNodeLabels?: boolean;
  sortNodesAscending?: boolean;
  sortNodesBy?: string;
  textToFilterOn?: string;
  treeMode?: boolean;
  traverseDepth?: number;
  user?: string;
}

export type ConnectType = 'in' | 'out' | 'both';

export type ScaleType = 'linear' | 'sqrt' | 'power';

export type LinkType = 'path' | 'line';

export type Scale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface GravityPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  sx?: number;
  sy?: number;
}
