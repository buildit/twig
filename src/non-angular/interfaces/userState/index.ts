export interface UserState {
  autoConnectivity?: ConnectType;
  autoScale?: ScaleType;
  bidirectionalLinks?: boolean;
  cascadingCollapse?: boolean;
  currentNode?: string;
  currentTwigletName?: string;
  currentViewName?: string;
  forceChargeStrength?: number;
  forceGravityX?: number;
  forceGravityY?: number;
  forceLinkDistance?: number;
  forceLinkStrength?: number;
  forceVelovityDecay?: number;
  isEditing?: boolean;
  linkType?: LinkType;
  nodeSizingAutomatic?: boolean;
  nodeTypeToBeAdded?: string;
  scale?: number;
  showNodeLabels?: boolean;
  sortNodesAscending?: boolean;
  sortNodesBy?: string;
  textToFilterOn?: string;
  treeMode?: boolean;
  traverseDepth?: number;
}

export type ConnectType = 'in' | 'out' | 'both';

export type ScaleType = 'linear' | 'sqrt' | 'power';

export type LinkType = 'path' | 'line';

export type Scale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
