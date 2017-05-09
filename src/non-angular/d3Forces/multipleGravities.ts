import { Map } from 'immutable';
import { D3Node, MultipleGravities, GravityPoint } from './../interfaces';

/**
 * Pulls the nodes towards multiple foci.
 *
 * @param {any} gravityPoints the centers to pull this towards.
 * @returns
 */
function multipleGravities () {

  let nodes: D3Node[];
  let gravityPoints: { [key: string]: GravityPoint } = {};
  let strengthX = 0.1;
  let strengthY = 0.1;
  const center = { x: 0, y: 0, };

  const force = <MultipleGravities>function(alpha) {
    nodes.forEach(node => {
      if (node.gravityPoint && gravityPoints[node.gravityPoint]) {
        node.x += (gravityPoints[node.gravityPoint].x - node.x) * alpha * strengthX;
        node.y += (gravityPoints[node.gravityPoint].y - node.y) * alpha * strengthY;
      } else {
        node.x += ((center.x || 0) - node.x) * alpha * strengthX;
        node.y += ((center.y || 0) - node.y) * alpha * strengthY;
      }
    });
  };

  force.initialize = _nodes => {
    nodes = _nodes;
  };

  function assignCenterX(): number;
  function assignCenterX(_centerX: number): MultipleGravities;
  function assignCenterX(_centerX?: number) {
    return _centerX === undefined ? center.x : ( center.x = _centerX, force );
  }
  force.centerX = assignCenterX;

  function assignCenterY(): number;
  function assignCenterY(_centerY: number): MultipleGravities;
  function assignCenterY(_centerY?: number) {
    return _centerY === undefined ? center.y : ( center.y = _centerY, force );
  }
  force.centerY = assignCenterY;

  function assignGravityPoints(): { [key: string]: GravityPoint};
  function assignGravityPoints(_gp: { [key: string]: GravityPoint}): MultipleGravities;
  function assignGravityPoints(_gp?: { [key: string]: GravityPoint} | Map<string, any>) {
    if (_gp === undefined) {
      return gravityPoints;
    }
    if (Map.isMap(_gp)) {
      gravityPoints = (<Map<string, any>>_gp).toJS();
    } else {
      gravityPoints = <{ [key: string]: GravityPoint}>_gp;
    }
    return force;
  }
  force.gravityPoints = assignGravityPoints;

  function assignStrengthX(): number;
  function assignStrengthX(_strengthX: number): MultipleGravities;
  function assignStrengthX(_strengthX?: number) {
    return _strengthX === undefined ? strengthX : ( strengthX = _strengthX, force );
  }
  force.strengthX = assignStrengthX;

  function assignStrengthY(): number;
  function assignStrengthY(_strengthY: number): MultipleGravities;
  function assignStrengthY(_strengthY?: number) {
    return _strengthY === undefined ? strengthY : ( strengthY = _strengthY, force );
  }
  force.strengthY = assignStrengthY;

  return force;
}

export {
  multipleGravities,
}
