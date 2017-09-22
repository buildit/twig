import { Attribute } from '../twiglet/attribute';

export interface UserState {
  addingGravityPoints?: boolean;
  copiedNodeId?: string;
  currentNode?: string;
  currentViewName?: string;
  editTwigletModel?: boolean;
  formValid?: boolean;
  isEditing?: boolean;
  isEditingGravity?: boolean;
  ping?: Object;
  nodeTypeToBeAdded?: string;
  textToFilterOn?: string;
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
