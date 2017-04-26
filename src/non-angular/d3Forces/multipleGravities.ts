import { Map } from 'immutable';
import { D3Node, Force } from './../interfaces';
interface MultipleGravities extends Force {
  centerX: Function;
  centerY: Function;
  centersOfGravity: Function;
  strengthX: Function;
  strengthY: Function;
}
/**
 * Pulls the nodes towards multiple foci.
 *
 * @param {any} gravityPoints the centers to pull this towards.
 * @returns
 */
function multipleGravities () {

  let nodes: D3Node[];
  let centersOfGravity = {};
  let strength = 0.1;
  let strengthX = 0.1;
  let strengthY = 0.1;
  const center = { x: 0, y: 0, };

  const force = <MultipleGravities>function(alpha) {
    nodes.forEach(node => {
      if (node.centerOfGravity && centersOfGravity[node.centerOfGravity]) {
        node.x += (centersOfGravity[node.centerOfGravity].x - node.x) * alpha * strength;
        node.y += (centersOfGravity[node.centerOfGravity].y - node.y) * alpha * strength;
      } else {
        node.x += ((center.x || 0) - node.x) * alpha * strengthX;
        node.y += ((center.y || 0) - node.y) * alpha * strengthY;
      }
    });
  };

  force.initialize = _ => {
    nodes = _;
  };

  force.centerX = _ => {
    return _ == null ? center.x : ( center.x = _, force );
  };
  force.centerY = _ => {
    return _ == null ? center.y : ( center.y = _, force );
  };

  force.centersOfGravity = _ => {
    if (_ == null) {
      return centersOfGravity;
    }
    if (Map.isMap(_)) {
      centersOfGravity = _.toJS();
    } else {
      centersOfGravity = _;
    }
    return force;
  };

  force.strength = _ => {
    return _ == null ? strength : (strength = +_, force);
  };

  force.strengthX = _ => {
    return _ == null ? strengthX : (strengthX = +_, force);
  };

  force.strengthY = _ => {
    return _ == null ? strengthY : (strengthY = +_, force);
  };

  return force;
}

export {
  multipleGravities,
  MultipleGravities,
}
