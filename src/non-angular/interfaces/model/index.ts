export interface Model {
  _rev?: string;
  changelog_url?: string;
  nodes?: {
    [key: string]: ModelNode;
  };
  entities: {
    [key: string]: ModelEntity;
  };
  name?: string;
  url?: string;
}

export interface ModelChangelog {
  message: string;
  user: string;
  timestamp: string;
}

export interface ModelNode {
  attributes: {
    [key: string]: ModelNodeAttribute;
  };
  uniqueness: string[];
  image: string;
}

export interface ModelNodeAttribute {
  default: string;
  emum: string[];
  mandatory: boolean;
  source: string;
  type: string;
  uniqueness: boolean;
}

export interface ModelEntity {
  class: string;
  color: string;
  image: string;
  size: string;
  type: string;
}
