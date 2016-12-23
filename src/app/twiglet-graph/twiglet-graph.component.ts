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
  UserStateService,
  UserStateServiceResponse,
} from '../../non-angular/services-helpers';

// Interfaces
import { D3Node, Link } from '../../non-angular/interfaces';

// Event Handlers
import {
  mouseMoveOnCanvas,
  mouseUpOnCanvas,
} from './inputHandlers';
import { addAppropriateMouseActionsToNodes, handleUserStateChanges } from './handleUserStateChanges';

// helpers
import { keepNodeInBounds } from './locationHelpers';
import { handleLinkMutations, handleNodeMutations } from './handleGraphMutations';
import { getColorFor, getNodeImage, getRadius } from './nodeAttributesToDOMAttributes';

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
   *
   * @type {ElementRef}
   * @memberOf TwigletGraphComponent
   */
  element: ElementRef;
  /**
   * The d3 service
   *
   * @type {D3}
   * @memberOf TwigletGraphComponent
   */
  d3: D3;
  /**
   * The state service from ./state.service
   *
   * @type {StateService}
   * @memberOf TwigletGraphComponent
   */
  state: StateService;
  /**
   * The force simulation that is moving the nodes and links around.
   *
   * @type {Simulation<any, undefined>}
   * @memberOf TwigletGraphComponent
   */
  simulation: Simulation<any, undefined>;
  /**
   * The svg that is part of the twiglet-graph.component.html.
   *
   * @type {Selection<SVGSVGElement, any,}
   * @memberOf TwigletGraphComponent
   */
  d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentNodes
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  nodes: Selection<any, {}, SVGSVGElement, any>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentNodes
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  links: Selection<any, {}, SVGSVGElement, any>;
  /**
   * The width of the svg element.
   *
   * @type {number}
   * @memberOf TwigletGraphComponent
   */
  width: number;
  /**
   * The height of the svg element.
   *
   * @type {number}
   * @memberOf TwigletGraphComponent
   */
  height: number;
  /**
   * All of the nodes in array style to feed to force graph.
   *
   * @type {D3Node[]}
   * @memberOf TwigletGraphComponent
   */
  currentNodes: D3Node[];
  /**
   * An object representing the same nodes as currentNodes (same reference) so linking nodes is
   * very fast.
   *
   * @type {{ [key: string]: D3Node }}
   * @memberOf TwigletGraphComponent
   */
  currentNodesObject: { [key: string]: D3Node } = {};
  /**
   * Since d3 makes changes to our nodes independent from the rest of angular, it should not be
   * making changes then reacting to it's own changes. This allows us to capture the state
   * before it is broadcast so comparisons can be made and this component does not double react
   * to everything it fires off. This shouldn't be added to any other component.
   *
   * @type {{ data: OrderedMap<string, Map<string, any>> }}
   * @memberOf TwigletGraphComponent
   */
  currentNodeState: { data: OrderedMap<string, Map<string, any>> };
  /**
   * All of the links in array style to feed to force graph.
   *
   * @type {Link[]}
   * @memberOf TwigletGraphComponent
   */
  currentLinks: Link[];
  /**
   * An object representation of this.currentLinks so no scanning has to be done.
   *
   * @type {{ [key: string]: Link }}
   * @memberOf TwigletGraphComponent
   */
  currentLinksObject: { [key: string]: Link } = {};
  /**
   * The distance from the border that the nodes are limited to.
   *
   * @type {number}
   * @memberOf TwigletGraphComponent
   */
  margin: number = 20;
  /**
   * The injected service from ./state.service
   *
   * @type {NodesService}
   * @memberOf TwigletGraphComponent
   */
  nodesService: NodesService;
  /**
   * The links service.
   *
   * @type {LinksService}
   * @memberOf TwigletGraphComponent
   */
  linksServices: LinksService;
  /**
   * The injected User State service.
   *
   * @type {UserStateService}
   * @memberOf TwigletGraphComponent
   */
  userStateService: UserStateService;
  /**
   * The link that we are in the middle of creating.
   *
   * @type {Link}
   * @memberOf TwigletGraphComponent
   */
  tempLink: Link;
  /**
   * A reference to the temp-link so we don't have to keep on selecting it.
   *
   * @type {Selection<SVGLineElement, any,}
   * @memberOf TwigletGraphComponent
   */
  tempLinkLine: Selection<SVGLineElement, any, null, undefined>;
  /**
   * the currently selected node for dragging and linking
   *
   * @type {D3Node}
   * @memberOf TwigletGraphComponent
   */
  tempNode: D3Node;
  /**
   * The current User State of our app
   *
   * @type {UserStateServiceResponse}
   * @memberOf TwigletGraphComponent
   */
  userState: UserStateServiceResponse = {};

  constructor(element: ElementRef, d3Service: D3Service, state: StateService) {
    this.currentNodes = [];
    this.currentLinks = [];
    this.currentNodeState = {
      data: null
    };
    this.d3 = d3Service.getD3();
    this.element = element;
    this.nodesService = state.twiglet.nodes;
    this.linksServices = state.twiglet.links;
    this.userStateService = state.userState;
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
    // Shouldn't be often but these need to be after everything else is initialized
    // So that pre-loaded nodes can be rendered.
    this.userStateService.observable.subscribe(handleUserStateChanges.bind(this));
    this.nodesService.observable.subscribe(handleNodeMutations.bind(this));
    this.linksServices.observable.subscribe(handleLinkMutations.bind(this));
  }

  /**
   * Adds and removes nodes from the DOM as needed based on this.currentNodes.
   * @param {number} [alpha=1] between 0 and 1, higher numbers means force has more time
   * to recalculate node positions.
   * @memberOf TwigletGraphComponent
   */
  restart(alpha = 1) {
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
          .attr('id', (d3Node: D3Node) => `id-${d3Node.id}`)
          .attr('class', 'node-group')
          .attr('transform', (d3Node: D3Node) => `translate(${d3Node.x},${d3Node.y})`)
          .attr('fill', 'white')
          .on('click', (d3Node: D3Node) => this.userStateService.setCurrentNode(d3Node.id));

      addAppropriateMouseActionsToNodes.bind(this)(nodeEnter);

      nodeEnter.append('text')
        .attr('class', 'node-image')
        .attr('y', 0)
        .attr('font-size', (d3Node: D3Node) => `${getRadius(d3Node)}px`)
        .attr('stroke', (d3Node: D3Node) => getColorFor(d3Node))
        .attr('text-anchor', 'middle')
        .text((d3Node: D3Node) => getNodeImage(d3Node));

      nodeEnter.append('text')
        .attr('class', 'node-name')
        .attr('y', 10)
        .attr('font-size', '15px')
        .attr('stroke', (d3Node: D3Node) => getColorFor(d3Node))
        .attr('text-anchor', 'middle')
        .text((d3Node: D3Node) => d3Node.name);

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


  /**
   * Updates the locations of the nodes on the svg. Called to sync the simulation with the display.
   * @memberOf TwigletGraphComponent
   */
  updateNodeLocation() {
    this.nodes.attr('transform', (node: D3Node) => `translate(${node.x},${node.y})`);
  }

  /**
   * Updates the locations of the links on the svg. Called to sync the simulation with the display.
   * @memberOf TwigletGraphComponent
   */
  updateLinkLocation() {
    this.links
      .attr('x1', (link: Link) => link.source.x)
      .attr('y1', (link: Link) => link.source.y)
      .attr('x2', (link: Link) => link.target.x)
      .attr('y2', (link: Link) => link.target.y);
  }


  /**
   * Handles the tick events from d3.
   * @memberOf TwigletGraphComponent
   */
  ticked() {
    this.currentNodes.forEach(keepNodeInBounds.bind(this));
    this.updateNodeLocation();
    this.updateLinkLocation();
  }

  /**
   * Publishes coordinates of the nodes to the rest of the app.
   * @memberOf TwigletGraphComponent
   */
  publishNewCoordinates() {
    this.nodesService.updateNodes(this.currentNodes, this.currentNodeState);
  }
}
