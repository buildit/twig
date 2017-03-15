import { ConnectType, D3Node, isD3Node, Link, UserState } from '../../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';
import { clone } from 'ramda';

function collapseNodes(twigletGraphComponent: TwigletGraphComponent, d3Node: D3Node) {
  console.log('here?');
  const [nodesArray, nodesObject, linksArray, linksObject, linkSourceMap] = getCopyOfData(twigletGraphComponent);
  d3Node.collapsedAutomatically = false;
  d3Node.collapsed = true;
  (linkSourceMap[d3Node.id] || []).forEach(link => {
    const target = linksObject[link.id].target as D3Node;
    target.collapsedAutomatically = true;
    target.hidden = true;
    (linkSourceMap[target.id] || []).forEach(targetLink => {
      targetLink.sourceOriginal = target.id;
      targetLink.source = d3Node;
    });
  });
  twigletGraphComponent.stateService.twiglet.replaceNodesAndLinks(nodesArray, linksArray);
}

function collapseNodesCascade(this: TwigletGraphComponent, d3Node: D3Node, initial = false) {

}

function mapOldSourceToParentNode(this: TwigletGraphComponent, currentSource: D3Node, parent: D3Node) {

}

function flowerNodes(this: TwigletGraphComponent, d3Node: D3Node, initial = false) {

}

function flowerNodesCascade(this: TwigletGraphComponent, d3Node: D3Node, initial = false) {

}

function getCopyOfData(twigletGraphComponent: TwigletGraphComponent): [D3Node[], Object, Link[], Object, Object] {
  const nodesArray = clone(twigletGraphComponent.allNodes);
  const nodesObject = nodesArray.reduce((object, node) => {
    object[node.id] = node;
    return object;
  }, {});
  const linksArray = clone(twigletGraphComponent.allLinks);
  const linkSourceMap = {};
  const linksObject = linksArray.reduce((object, link) => {
    // get a map of the links with source as the key
    if (linkSourceMap[(<D3Node>link.source).id]) {
      linkSourceMap[(<D3Node>link.source).id].push(link);
    } else {
      linkSourceMap[(<D3Node>link.source).id] = [link];
    }

    // update the references so the correst set of nodes.
    link.source = nodesObject[(<D3Node>link.source).id];
    link.target = nodesObject[(<D3Node>link.target).id];
    object[link.id] = link;
    return object;
  }, {});
  return [nodesArray, nodesObject, linksArray, linksObject, linkSourceMap];
}

export function toggleNodeCollapsibility(this: TwigletGraphComponent, d3Node: D3Node) {
  if (d3Node.collapsed) {
    if (this.userState.get('cascadingCollapse')) {
      flowerNodesCascade.bind(this)(d3Node, true);
    } else {
      flowerNodes.bind(this)(d3Node, true);
    }
  } else {
    if (this.userState.get('cascadingCollapse')) {
      collapseNodesCascade.bind(this)(d3Node, true);
    } else {
      collapseNodes(this, d3Node);
    }
  }
}
