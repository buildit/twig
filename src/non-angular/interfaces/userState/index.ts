import { Attribute } from '../twiglet/attribute';

export interface UserState {
  activeModel?: boolean;
  activeTwiglet?: boolean;
  autoConnectivity?: ConnectType;
  autoScale?: ScaleType;
  bidirectionalLinks?: boolean;
  cascadingCollapse?: boolean;
  copiedNodeId?: string;
  currentNode?: string;
  currentViewName?: string;
  editTwigletModel?: boolean;
  filterEntities?: Array<String>;
  filters?: {
    attributes: Array<Attribute>,
    types: { [key: string]: string },
  };
  forceChargeStrength?: number;
  forceGravityX?: number;
  forceGravityY?: number;
  forceLinkDistance?: number;
  forceLinkStrength?: number;
  forceVelocityDecay?: number;
  formValid?: boolean;
  isEditing?: boolean;
  linkType?: LinkType;
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
