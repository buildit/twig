import { Map } from 'immutable';

import { StateCatcher } from '../index';
import { NodesService } from './nodes.service';
import { D3Node } from '../../interfaces/twiglet';

describe('NodesService', () => {
  let nodeService: NodesService;
  beforeEach(() => {
    nodeService = new NodesService();
  });

  const initialNodes: D3Node[] = [
    {
      id: 'firstNode',
      name: 'firstNodeName',
      type: '@',
      x: 100,
      y: 150,
    },
    {
      id: 'secondNode',
      name: 'secondNodeName',
      type: '#',
      x: 200,
      y: 300,
    },
    {
      id: 'thirdNode',
      name: 'thirdNodeName',
      type: '$',
    }
  ];

  describe('Observables', () => {
    it('returns an observable with no Nodes at initiation', () => {
      nodeService.observable.subscribe(response => {
        expect(response.size).toEqual(0);
      });
    });
  });

  describe('Adding Nodes', () => {
    it('can add an array of Nodes as immutable maps', () => {
      nodeService.addNodes(initialNodes);
      nodeService.observable.subscribe(response => {
        expect(response.size).toEqual(3);
        const firstNode = response.get('firstNode');
        expect(Map.isMap(firstNode)).toEqual(true);
        expect(firstNode.get('id')).toEqual('firstNode');
        expect(firstNode.get('name')).toEqual('firstNodeName');
        expect(firstNode.get('type')).toEqual('@');
        expect(firstNode.get('x')).toEqual(100);
        expect(firstNode.get('y')).toEqual(150);
        const secondNode = response.get('secondNode');
        expect(Map.isMap(secondNode)).toEqual(true);
        expect(secondNode.get('id')).toEqual('secondNode');
        expect(secondNode.get('name')).toEqual('secondNodeName');
        expect(secondNode.get('type')).toEqual('#');
        expect(secondNode.get('x')).toEqual(200);
        expect(secondNode.get('y')).toEqual(300);
        const thirdNode = response.get('thirdNode');
        expect(Map.isMap(thirdNode)).toEqual(true);
        expect(thirdNode.get('id')).toEqual('thirdNode');
        expect(thirdNode.get('name')).toEqual('thirdNodeName');
        expect(thirdNode.get('type')).toEqual('$');
      });
    });

    it('can add a single Node as an immutable map', () => {
      nodeService.addNode({
        id: 'singleNode',
      });
      nodeService.observable.subscribe(response => {
        expect(response.size).toEqual(1);
        const firstNode = response.get('singleNode');
        expect(Map.isMap(firstNode)).toEqual(true);
        expect(firstNode.get('id')).toEqual('singleNode');
      });
    });
  });

  describe('updateNodes', () => {
    beforeEach(() => {
      nodeService.addNodes(initialNodes);
    });

    it('can update multiple Nodes at a time and still return immutables', () => {
      nodeService.updateNodes([
        {
          id: 'firstNode',
          name: 'new First Node',
        },
        {
          id: 'secondNode',
          type: '!!!',
        },
        {
          id: 'thirdNode',
          x: 1000,
          y: 1500,
        },
      ]);
      nodeService.observable.subscribe(response => {
        // No new nodes - DJ Khaled
        expect(response.size).toEqual(3);
        const firstNode = response.get('firstNode');
        expect(Map.isMap(firstNode)).toEqual(true);
        expect(firstNode.get('id')).toEqual('firstNode');
        expect(firstNode.get('name')).toEqual('new First Node');
        expect(firstNode.get('type')).toEqual('@');
        expect(firstNode.get('x')).toEqual(100);
        expect(firstNode.get('y')).toEqual(150);
        const secondNode = response.get('secondNode');
        expect(Map.isMap(secondNode)).toEqual(true);
        expect(secondNode.get('id')).toEqual('secondNode');
        expect(secondNode.get('name')).toEqual('secondNodeName');
        expect(secondNode.get('type')).toEqual('!!!');
        expect(secondNode.get('x')).toEqual(200);
        expect(secondNode.get('y')).toEqual(300);
        const thirdNode = response.get('thirdNode');
        expect(Map.isMap(thirdNode)).toEqual(true);
        expect(thirdNode.get('id')).toEqual('thirdNode');
        expect(thirdNode.get('name')).toEqual('thirdNodeName');
        expect(thirdNode.get('type')).toEqual('$');
        expect(thirdNode.get('x')).toEqual(1000);
        expect(thirdNode.get('y')).toEqual(1500);
      });
    });

    it('passes the new state to stateCatcher if one is passed in to updateNodes', () => {
      const state: StateCatcher = {
        data: null,
      };
      nodeService.updateNodes(initialNodes, state);
      nodeService.observable.subscribe(response => {
        expect(response).toBe(state.data);
      });
    });

    it('can update a single Node and leave the Node as an immutable', () => {
      nodeService.updateNode({
        id: 'firstNode',
        name: 'another new name',
        type: 'whatever',
        x: 1000,
        y: 1500,
      });
      nodeService.observable.subscribe(response => {
        // No new nodes
        expect(response.size).toEqual(3);

        const firstNode = response.get('firstNode');
        expect(Map.isMap(firstNode)).toEqual(true);
        expect(firstNode.get('name')).toEqual('another new name'); // updated
        expect(firstNode.get('type')).toEqual('whatever');
        expect(firstNode.get('x')).toEqual(1000);
        expect(firstNode.get('y')).toEqual(1500);
      });
    });

    it('passes the new state to stateCatcher if one is passed in to updateNodes', () => {
      const state: StateCatcher = {
        data: null,
      };
      nodeService.updateNode(initialNodes[0], state);
      nodeService.observable.subscribe(response => {
        expect(response).toBe(state.data);
      });
    });
  });

  describe('deleteNodes', () => {
    beforeEach(() => {
      nodeService.addNodes(initialNodes);
    });

    it('can delete multiple Nodes at a time and leave the remaining as immutables', () => {
      nodeService.removeNodes([
        {
          id: 'secondNode',
        },
        {
          id: 'thirdNode',
          name: 'thirdNodeName',
          type: '$',
        },
      ]);
      nodeService.observable.subscribe(response => {
        expect(response.size).toEqual(1);
        expect(Map.isMap(response.get('firstNode'))).toEqual(true);
      });
    });

    it('can delete a single Node and leave the remaining as immutable', () => {
      nodeService.removeNode({
        id: 'secondNode'
      });
      nodeService.observable.subscribe(response => {
        expect(response.size).toEqual(2);
        expect(Map.isMap(response.get('firstNode'))).toEqual(true);
        expect(Map.isMap(response.get('thirdNode'))).toEqual(true);
      });
    });
  });
});
