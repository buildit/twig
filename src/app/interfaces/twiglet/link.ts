import { Attribute } from './attribute';

export interface Link {
  id: String;
  association: String;
  source: String;
  target: String;
  central: Boolean;
  start_at: String;
  end_at: String;
  attrs: Array<Attribute>;
}

export interface Links {
  data: Link[];
};
