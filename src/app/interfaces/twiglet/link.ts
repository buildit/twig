import { Attribute } from './attribute';

export interface Link {
  id: string;
  association: string;
  source: string;
  target: string;
  central: Boolean;
  start_at: string;
  end_at: string;
  attrs: Array<Attribute>;
}

export interface Links {
  data: Link[];
};
