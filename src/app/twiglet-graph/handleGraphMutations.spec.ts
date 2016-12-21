import { fromJS } from 'immutable';
import { TwigletGraphComponentStub } from './twiglet-graph.component';
import { D3Node, Link } from '../../non-angular/interfaces';

describe('handleGraphMutations', () => {

  let twigletGraph: TwigletGraphComponentStub;

  beforeEach(() => {
    twigletGraph = new TwigletGraphComponentStub();
  });
  describe('handleNodeMutations', () => {
    const currentNodes = [
      {
        id: 'staticNode',
        name: 'static Node',
        type: '#',
      },
      {
        id: 'updatedNode',
        name: 'Updated Node',
        type: '@',
      },
      {
        id: 'deletedNode',
        name: 'Deleted Node',
        type: '@',
      }
    ];
    const currentNodesObject = currentNodes.reduce((object, node: D3Node) => {
      object[node.id] = node;
      return object;
    }, {});
    const response = fromJS({
      addedNode: {
        id: 'addedNode',
        name: 'Added Node',
        type: '+'
      },
      updatedNode: {
        id: 'updatedNode',
        name: 'A new name!',
        type: '&'
      },
    });
  });
});
