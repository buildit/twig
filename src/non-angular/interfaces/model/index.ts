export interface Model {
  nodes?: {
    [key: string]: ModelNode;
  };
  entities: {
    [key: string]: ModelEntity;
  };
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
  image: string;
  class: string;
  size: number;
  color: string;
}
