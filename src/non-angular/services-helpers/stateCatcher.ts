import { List } from 'immutable';

export interface StateCatcher {
  data: any;
  action?: string;
  payload?: any;
}
