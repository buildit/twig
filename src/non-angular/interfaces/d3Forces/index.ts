import { GravityPoint, D3Node } from './..';
import { Map } from 'immutable';

export interface Force {
  (alpha): void;
  initialize?: Function;
  strength?: Function;
}


export interface MultipleGravities extends Force {
  initialize: (nodes: D3Node[]) => void;
  centerX(n: number): MultipleGravities;
  centerX(): number;
  centerY(n: number): MultipleGravities;
  centerY(): number;
  gravityPoints(g: { [key: string]: GravityPoint} | Map<string, GravityPoint>): MultipleGravities;
  gravityPoints(): { [key: string]: GravityPoint};
  strengthX(n: number): MultipleGravities;
  strengthX(): number;
  strengthY(n: number): MultipleGravities;
  strengthY(): number;
}
