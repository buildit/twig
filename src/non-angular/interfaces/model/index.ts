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
  key: string;
  value: string;
  required?: boolean;
  dataType?: string;
}

export interface ModelEntity {
  class: string;
  color: string;
  image: string;
  size: string;
  type: string;
}
