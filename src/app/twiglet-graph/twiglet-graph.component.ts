import { Component, ChangeDetectionStrategy, ElementRef, OnInit } from '@angular/core';
import { D3Service, D3, Selection, Simulation, ForceLink } from 'd3-ng2-service';
import { Map, OrderedMap } from 'immutable';
import { clone, merge } from 'ramda';

// State related
import { StateService } from '../state.service';
import {
  LinksService,
  NodesService,
  StateCatcher,
  ViewService,
  ViewServiceResponse,
  viewServiceResponseToObject
} from '../../non-angular/services-helpers';

// Interfaces
import { D3Node, Link } from '../../non-angular/interfaces';

// Event Handlers
import {
  dragEnded,
  dragged,
  dragStarted,
  mouseDownOnNode,
  mouseMoveOnCanvas,
  mouseUpOnNode,
  mouseUpOnCanvas,
} from './twiglet-graph.inputHandlers';

// helpers
import { keepNodeInBounds } from './twiglet-graph.locationHelpers';
import { handleLinkMutations, handleNodeMutations } from './handleGraphMutations';
import { colorFor, getNodeImage, getRadius } from './nodeAttributeToDOMAttributes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [D3Service],
  selector: 'app-twiglet-graph',
  styleUrls: ['./twiglet-graph.component.css'],
  templateUrl: './twiglet-graph.component.html',

})
export class TwigletGraphComponent implements OnInit {
  /**
   * A reference to the element that contains this <twiglet-graph>
   */
  element: ElementRef;
  /**
   * The d3 service
   */
  d3: D3;
  /**
   * The state service from ./state.service
   */
  state: StateService;
  /**
   * The force simulation that is moving the nodes and links around.
   */
  simulation: Simulation<any, undefined>;
  /**
   * The svg that is part of the twiglet-graph.component.html.
   */
  d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentNodes
   */
  nodes: any;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentNodes
   */
  links: any;
  /**
   * The width of the svg element.
   */
  width: number;
  /**
   * The height of the svg element.
   */
  height: number;
  /**
   * All of the nodes in array style to feed to force graph.
   */
  currentNodes: D3Node[];
  /**
   * An object representing the same nodes as currentNodes (same reference) so linking nodes is
   * very fast.
   */
  currentNodesObject: any = {};
  /**
   * Since d3 makes changes to our nodes independent from the rest of angular, it should not be
   * making changes then reacting to it's own changes. This allows us to capture the state
   * before it is broadcast so comparisons can be made and this component does not double react
   * to everything it fires off. This shouldn't be added to any other component.
   */
  currentNodeState: StateCatcher;
  /**
   * All of the links in array style to feed to force graph.
   */
  currentLinks: Link[];
  /**
   * An object representation of this.currentLinks so no scanning has to be done.
   */
  currentLinksObject: any = {};
  /**
   * The distance from the border that the nodes are limited to.
   */
  margin: number = 20;
  /**
   * The injected service from ./state.service
   */
  nodesService: NodesService;
  /**
   * The links service.
   */
  linksServices: LinksService;
  /**
   * View object which contains everything the user
   */
  viewService: ViewService;
  /**
   * The link that we are in the middle of creating.
   */
  tempLink: Link;
  /**
   * A reference to the temp-link so we don't have to keep on selecting it.
   */
  tempLinkLine: Selection<SVGLineElement, any, null, undefined>;
  /**
   * the currently selected node for dragging and linking
   */
  tempNode: D3Node;
  /**
   * The current view of our app
   */
  view: ViewServiceResponse;

  constructor(element: ElementRef, d3Service: D3Service, state: StateService) {
    this.currentNodes = [];
    this.currentNodeState = {
      data: null
    };
    this.currentLinks = [];
    this.d3 = d3Service.getD3();
    this.element = element;
    this.nodesService = state.twiglet.nodes;
    this.linksServices = state.twiglet.links;
    this.nodesService.observable.subscribe(handleNodeMutations.bind(this));
    this.linksServices.observable.subscribe(handleLinkMutations.bind(this));
    state.view.observable.subscribe(response => {
      viewServiceResponseToObject.bind(this)(response);
      if (this.nodes) {
        if (this.view.isEditing) {
          this.currentNodes.forEach((node: D3Node) => {
            node.fx = node.x;
            node.fy = node.y;
          });
          this.nodes.on('mousedown.drag', null);
          this.nodes
            .on('mousedown', mouseDownOnNode.bind(this))
            .on('mouseup', mouseUpOnNode.bind(this));
        } else {
          // Fix the nodes.
          this.currentNodes.forEach((node: D3Node) => {
            node.fx = null;
            node.fy = null;
          });
          // Clear the link making stuff.
          this.nodes.on('mousedown', null);
          // Reenable the dragging.
          this.nodes.call(this.d3.drag()
          .on('start', dragStarted.bind(this))
          .on('drag', dragged.bind(this))
          .on('end', dragEnded.bind(this)));
          // Recalculate node positions.
          if (this.simulation) {
            this.restart();
          }
        }
      }
    });
  }

  /**
   * Initializes the component once the component is mounted.
   * @memberOf TwigletGraphComponent
   */
  ngOnInit() {
    this.d3Svg = this.d3.select(this.element.nativeElement).select<SVGSVGElement>('svg');
    this.nodes = this.d3Svg.selectAll('.node-group');
    this.links = this.d3Svg.selectAll('.link-group');
    this.d3Svg.on('mousemove', mouseMoveOnCanvas(this));
    this.width = +this.d3Svg.attr('width');
    this.height = +this.d3Svg.attr('height');
    this.simulation = this.d3.forceSimulation([])
    .force('charge', this.d3.forceManyBody().strength(-1000))
    .force('link', this.d3.forceLink([]).distance(75))
    .force('linkStrength', this.d3.forceLink([]).strength(1000))
    .force('collide', this.d3.forceCollide().radius(
      (d3Node: D3Node) => { return getRadius(d3Node) + 0.5; }).iterations(2))
    .alphaTarget(0)
    .on('tick', this.ticked.bind(this))
    .on('end', this.publishNewCoordinates.bind(this));
  }

  /**
   * Adds and removes nodes from the DOM as needed based on this.currentNodes.
   *
   * @param {number} [alpha=1] between 0 and 1, higher numbers means force has more time
   * to recalculate node positions.
   *
   * @memberOf TwigletGraphComponent
   */
  restart (alpha = 1) {
    if (this.d3Svg) {
      this.d3Svg.on('mouseup', null);
      this.currentNodes.forEach(keepNodeInBounds.bind(this));
      this.nodesService.updateNodes(this.currentNodes, this.currentNodeState);

      this.nodes = this.d3Svg.selectAll('.node-group').data(this.currentNodes, (d: D3Node) => d.id);

      /**
       * exit affects all of the elements on the svg that do not have a corresponding node in
       * this.currentNodes anymore. Remove them from the screen.
       */
      this.nodes.exit().remove();

      /**
       * Enter affects all of the nodes in our array (this.currentNodes) that do not already
       * have an existing <g> on the svg. This sets up all of the new elements
       */
      const nodeEnter =
        this.nodes
        .enter()
        .append('g')
        .attr('class', 'node-group')
        .attr('transform', d3Node => `translate(${d3Node.x},${d3Node.y})`)
        .attr('fill', 'white');

      if (this.view.isEditing) {
        nodeEnter
            .on('mousedown', mouseDownOnNode.bind(this))
            .on('mouseup', mouseUpOnNode.bind(this));
      } else {
        nodeEnter.call(this.d3.drag()
          .on('start', dragStarted.bind(this))
          .on('drag', dragged.bind(this))
          .on('end', dragEnded.bind(this)));
      }

      nodeEnter.append('text')
        .attr('class', 'node-image')
        .attr('y', 0)
        .attr('font-size', d3Node => `${getRadius(d3Node)}px`)
        .attr('stroke', d3Node => colorFor(d3Node))
        .attr('text-anchor', 'middle')
        .text(d3Node => getNodeImage(d3Node));

      nodeEnter.append('text')
        .attr('class', 'node-name')
        .attr('y', 10)
        .attr('font-size', '15px')
        .attr('stroke', d3Node => colorFor(d3Node))
        .attr('text-anchor', 'middle')
        .text(node => node.name);

      this.nodes = nodeEnter.merge(this.nodes);

      this.d3Svg.on('mouseup', mouseUpOnCanvas(this));

      this.links = this.d3Svg.selectAll('.link-group').data(this.currentLinks, (l: Link) => l.id);

      this.links.exit().remove();

      this.links = this.links
        .enter()
        .append('line')
        .attr('class', 'link-group')
        .attr('style', 'stroke: #999; stroke-opacity: 0.6;')
        .merge(this.links);

      /**
       * Restart the simulation so that nodes can reposition themselves.
       */
      this.simulation.nodes(this.currentNodes);
      (this.simulation.force('link') as ForceLink<any, any>).links(this.currentLinks);
      this.simulation.alpha(alpha).alphaTarget(0).restart();
    }
  }

  updateNodeLocation () {
    this.nodes.attr('transform', (node: D3Node) => `translate(${node.x},${node.y})`);
  }

  updateLinkLocation () {
    this.links
      .attr('x1', (link: Link) =>  link.source.x)
      .attr('y1', (link: Link) =>  link.source.y)
      .attr('x2', (link: Link) =>  link.target.x)
      .attr('y2', (link: Link) =>  link.target.y);
  }

  ticked() {
    this.currentNodes.forEach(keepNodeInBounds.bind(this));
    this.updateNodeLocation();
    this.updateLinkLocation();
  }

  publishNewCoordinates() {
    this.nodesService.updateNodes(this.currentNodes, this.currentNodeState);
  }
}
