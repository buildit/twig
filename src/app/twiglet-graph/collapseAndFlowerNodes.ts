import { D3Node, isD3Node, Link, UserState, ConnectType } from '../../non-angular/interfaces';
import { TwigletGraphComponent }  from './twiglet-graph.component';


function collapseNodes(this: TwigletGraphComponent, d3Node: D3Node, initial = true) {
  // Don't touch nodes that have been specifically interacted with by the user.
  if (d3Node.collapsedAutomatically !== false) {
    d3Node.collapsed = true;
    if (initial) {
      d3Node.collapsedAutomatically = false;
    } else {
      // All of the child nodes are collapsed automatically so they should be flowered automatically.
      d3Node.collapsedAutomatically = true;
    }
    (this.linkSourceMap[d3Node.id] || []).forEach((linkId: string) => {
      const link = this.allLinksObject[linkId];
      link.hidden = true;
      let targetNodeId;
      if (isD3Node(link.target)) {
        targetNodeId = link.target.id;
      } else {
        targetNodeId = link.target;
      }
      const node = this.allNodesObject[targetNodeId];
      node.hidden = true;
      if (this.userState.cascadingCollapse) {
        collapseNodes.bind(this)(node, false);
      } else {
        mapOldSourceToParentNode.bind(this)(node, d3Node);
      }
    });
    if (initial) {
      this.stateService.twiglet.updateNodes(this.allNodes);
      this.stateService.twiglet.updateLinks(this.allLinks);
    }
  } else {
    d3Node.hidden = true;
  }
}

function mapOldSourceToParentNode(this: TwigletGraphComponent, currentSource: D3Node, parent: D3Node) {
  const linkIds = this.linkSourceMap[currentSource.id];
  linkIds.forEach((linkId: string) => {
    const link = this.allLinksObject[linkId];
    link.sourceOriginal = currentSource.id;
    link.source = parent;
  });
}

function mapLinksBackToOriginalSource(this: TwigletGraphComponent, link: Link) {
  link.source = this.allNodesObject[link.sourceOriginal];
  link.sourceOriginal = null;
}

function flowerNodes(this: TwigletGraphComponent, d3Node: D3Node, initial = true) {
  if (initial || d3Node.collapsedAutomatically) {
    d3Node.collapsed = false;
    (this.linkSourceMap[d3Node.id] || []).forEach((linkId: string) => {
      const link = this.allLinksObject[linkId];
      link.hidden = false;
      let targetNodeId;
      if (isD3Node(link.target)) {
        targetNodeId = link.target.id;
      } else {
        targetNodeId = link.target;
      }
      const node = this.allNodesObject[targetNodeId];
      node.hidden = false;
      if (this.userState.cascadingCollapse) {
        flowerNodes.bind(this)(node, false);
      } else if (link.sourceOriginal) {
        mapLinksBackToOriginalSource.bind(this)(link);
      }
    });
    if (initial) {
      this.stateService.twiglet.updateNodes(this.allNodes);
      this.stateService.twiglet.updateLinks(this.allLinks);
    }
  }
}

export function toggleNodeCollapsibility(this: TwigletGraphComponent, d3Node: D3Node) {
  if (d3Node.collapsed) {
    flowerNodes.bind(this)(d3Node);
  } else {
    collapseNodes.bind(this)(d3Node);
  }
}
