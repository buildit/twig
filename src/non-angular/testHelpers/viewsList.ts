import { fromJS } from 'immutable';

export function viewsList() {
    return fromJS([
      {
        description: '',
        links: {},
        name: 'view1',
        nodes: {},
        userState: {
          autoConnectivity: 'in',
          cascadingCollapse: false,
          currentNode: null,
          filters: [
            {
              attributes: [],
              types: {}
            }
          ],
          forceChargeStrength: 0.1,
          forceGravityX: 0.1,
          forceGravityY: 1,
          forceLinkDistance: 20,
          forceVelocityDelay: 0.9,
          linkType: 'path',
          scale: 3,
          showLinkLabels: false,
          showNodeLabels: false,
          traverseDepth: 3,
          treeMode: false
        }
      },
      {
        description: '',
        links: {},
        name: 'view2',
        nodes: {},
        userState: {
          autoConnectivity: 'in',
          cascadingCollapse: false,
          currentNode: null,
          filters: [
            {
              attributes: [],
              types: {}
            }
          ],
          forceChargeStrength: 0.1,
          forceGravityX: 0.1,
          forceGravityY: 1,
          forceLinkDistance: 20,
          forceVelocityDelay: 0.9,
          linkType: 'path',
          scale: 3,
          showLinkLabels: false,
          showNodeLabels: false,
          traverseDepth: 3,
          treeMode: false
        }
      }
    ]);
}
