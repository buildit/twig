import { clone } from 'ramda';

import { ConnectType, D3Node, isD3Node, Link, UserState } from '../../../non-angular/interfaces';
import { TwigletGraphComponent } from './twiglet-graph.component';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data';

function collapseNodes(twigletGraphComponent: TwigletGraphComponent, d3NodeId: string) {
  const [nodesArray, nodesObject, linksArray, linksObject, linkSourceMap] = getCopyOfData(twigletGraphComponent);
  const d3Node = nodesObject[d3NodeId];
  d3Node.collapsedAutomatically = false;
  d3Node.collapsed = true;
  (linkSourceMap[d3Node.id] || []).forEach(link => {
    const target = link.target as D3Node;
    (linkSourceMap[target.id] || []).forEach(targetLink => {
      const originalSource = targetLink.source as D3Node;
        targetLink.sourceOriginal = target.id;
        targetLink.source = d3Node;
    });
    target.collapsedAutomatically = true;
    target.hidden = true;
  });
  twigletGraphComponent.stateService.twiglet.replaceNodesAndLinks(nodesArray, linksArray);
}

function flowerNodes(twigletGraphComponent: TwigletGraphComponent, d3NodeId: string) {
  const [nodesArray, nodesObject, linksArray, linksObject, linkSourceMap] = getCopyOfData(twigletGraphComponent);
  const d3Node = nodesObject[d3NodeId];
  delete d3Node.collapsedAutomatically;
  d3Node.collapsed = false;
  (linkSourceMap[d3Node.id] || []).forEach(link => {
    if (link.sourceOriginal) {
      const source = nodesObject[link.sourceOriginal];
      delete link.sourceOriginal;
      link.source = source;
      delete source.collapsedAutomatically;
      source.hidden = false;
    } else {
      const target = link.target as D3Node;
      if (target.collapsedAutomatically) {
        delete target.collapsedAutomatically;
        target.hidden = false;
      }
    }
  });
  twigletGraphComponent.stateService.twiglet.replaceNodesAndLinks(nodesArray, linksArray);
}

function collapseNodesCascade(twigletGraphComponent: TwigletGraphComponent, d3NodeId: string, initial = true, copyOfData?) {
  copyOfData = copyOfData ? copyOfData : getCopyOfData(twigletGraphComponent);
  const [nodesArray, nodesObject, linksArray, linksObject, linkSourceMap] = copyOfData;
  const d3Node = nodesObject[d3NodeId];
  d3Node.collapsed = true;
  (linkSourceMap[d3Node.id] || []).forEach(link => {
    const target = link.target as D3Node;
    if (target.collapsedAutomatically !== false) {
      target.collapsedAutomatically = true;
    }
    target.hidden = true;
    collapseNodesCascade(twigletGraphComponent, target.id, false, copyOfData);
  });
  if (initial) {
    d3Node.collapsedAutomatically = false;
    twigletGraphComponent.stateService.twiglet.replaceNodesAndLinks(nodesArray, linksArray);
  } else {
    d3Node.collapsedAutomatically = true;
  }
}

function flowerNodesCascade(twigletGraphComponent: TwigletGraphComponent, d3NodeId: string, initial = true, copyOfData?) {
  copyOfData = copyOfData ? copyOfData : getCopyOfData(twigletGraphComponent);
  const [nodesArray, nodesObject, linksArray, linksObject, linkSourceMap] = copyOfData;
  const d3Node = nodesObject[d3NodeId];
  delete d3Node.collapsedAutomatically;
  d3Node.collapsed = false;
  (linkSourceMap[d3Node.id] || []).forEach(link => {
    const target = link.target as D3Node;
    if (target.collapsedAutomatically) {
      delete target.collapsedAutomatically;
    }
    target.hidden = false;
    flowerNodesCascade(twigletGraphComponent, target.id, false, copyOfData);
  });
  if (initial) {
    twigletGraphComponent.stateService.twiglet.replaceNodesAndLinks(nodesArray, linksArray);
  }
}

function getCopyOfData(twigletGraphComponent: TwigletGraphComponent): [D3Node[],
                                                                      { [key: string]: D3Node },
                                                                      Link[],
                                                                      { [key: string]: Link },
                                                                      { [key: string]: Link[] }] {
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
    if (this.viewData.get(VIEW_DATA.CASCADING_COLLAPSE)) {
      flowerNodesCascade(this, d3Node.id);
    } else {
      flowerNodes(this, d3Node.id);
    }
  } else {
    if (this.viewData.get(VIEW_DATA.CASCADING_COLLAPSE)) {
      collapseNodesCascade(this, d3Node.id);
    } else {
      collapseNodes(this, d3Node.id);
    }
  }
}
