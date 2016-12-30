import { AfterViewInit, AfterContentInit, Component, ChangeDetectionStrategy, HostListener, ElementRef, OnInit } from '@angular/core';
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
} from '../../non-angular/services-helpers';

// Interfaces
import { D3Node, Model, ModelEntity, ModelNode, Link, UserState } from '../../non-angular/interfaces';

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
  providers: [D3Service],
  selector: 'app-twiglet-graph',
  styleUrls: ['./twiglet-graph.component.scss'],
  templateUrl: './twiglet-graph.component.html',
})
export class TwigletGraphComponent implements OnInit, AfterViewInit, AfterContentInit {
  /**
   * The width of the svg so it can be dynamically resized.
   *
   * @type {number}
   * @memberOf TwigletGraphComponent
   */
  width: number = 800;
  /**
   * The height of the svg so it can be dynamically resized.
   *
   * @type {number}
   * @memberOf TwigletGraphComponent
   */
  height: number = 500;
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

  nodesG: Selection<SVGGElement, any, null, undefined>;

  linksG: Selection<SVGGElement, any, null, undefined>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentNodes
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  nodes: Selection<any, {}, SVGGElement, any>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentNodes
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  links: Selection<any, {}, SVGGElement, any>;
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
   * The model currently being used on the twiglet.
   *
   * @type {Model}
   * @memberOf TwigletGraphComponent
   */
  model: Model;
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
   * @type {UserState}
   * @memberOf TwigletGraphComponent
   */
  userState: UserState = {};

  constructor(element: ElementRef, d3Service: D3Service, state: StateService) {
    this.currentNodes = [];
    this.currentLinks = [];
    this.currentNodeState = {
      data: null
    };
    this.d3 = d3Service.getD3();
    this.element = element;
    this.state = state;
  }

  /**
   * Initializes the component once the component is mounted.
   * @memberOf TwigletGraphComponent
   */
  ngOnInit() {
    this.d3Svg = this.d3.select(this.element.nativeElement).select<SVGSVGElement>('svg');
    this.nodesG = this.d3Svg.select<SVGGElement>('#nodesG');
    this.linksG = this.d3Svg.select<SVGGElement>('#linksG');
    this.nodes = this.nodesG.selectAll('.node-group');
    this.links = this.linksG.selectAll('.link-group');
    this.d3Svg.on('mousemove', mouseMoveOnCanvas(this));
    this.simulation = this.d3.forceSimulation([])
      .force('link', this.d3.forceLink().distance(75).strength(1))
      .force('charge', this.d3.forceManyBody().strength(5))
      .force('center', this.d3.forceCenter(this.width / 2, this.height / 2))
      .force('collide', this.d3.forceCollide().radius((d3Node: D3Node) => d3Node.radius + 15).iterations(16))
      .alphaTarget(0)
      .on('tick', this.ticked.bind(this))
      .on('end', this.publishNewCoordinates.bind(this));
    // Shouldn't be often but these need to be after everything else is initialized
    // So that pre-loaded nodes can be rendered.
    this.state.userState.observable.subscribe(handleUserStateChanges.bind(this));
    this.state.twiglet.nodes.observable.subscribe(handleNodeMutations.bind(this));
    this.state.twiglet.links.observable.subscribe(handleLinkMutations.bind(this));
    this.state.twiglet.model.observable.subscribe((response) => {
      const nodes = response.get('nodes').reduce((object: { [key: string]: ModelNode }, value: Map<string, any>, key: string) => {
        object[key] = value.toJS();
        return object;
      }, {});
      const entities = response.get('entities').reduce((object: { [key: string]: ModelEntity }, value: Map<string, any>, key: string) => {
        object[key] = value.toJS();
        return object;
      }, {});
      this.model = {
        nodes,
        entities,
      };
    });
  }

  ngAfterContentInit() {
    this.onResize();
  }

  ngAfterViewInit() {
    this.state.loadTwiget('whatever');
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
      this.state.twiglet.nodes.updateNodes(this.currentNodes, this.currentNodeState);

      this.nodes = this.nodesG.selectAll('.node-group').data(this.currentNodes, (d: D3Node) => d.id);

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
          .on('click', (d3Node: D3Node) => this.state.userState.setCurrentNode(d3Node.id));

      addAppropriateMouseActionsToNodes.bind(this)(nodeEnter);

      nodeEnter.append('text')
        .attr('class', 'node-image')
        .attr('y', 0)
        .attr('font-size', (d3Node: D3Node) => `${getRadius.bind(this)(d3Node)}px`)
        .attr('stroke', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((d3Node: D3Node) => getNodeImage.bind(this)(d3Node));

      nodeEnter.append('text')
        .attr('class', 'node-name')
        .classed('invisible', !this.userState.showNodeLabels)
        .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12)
        .attr('stroke', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
        .attr('text-anchor', 'middle')
        .text((d3Node: D3Node) => d3Node.name);

      this.nodes = nodeEnter.merge(this.nodes);

      this.d3Svg.on('mouseup', mouseUpOnCanvas(this));

      this.links = this.linksG.selectAll('.link-group').data(this.currentLinks, (l: Link) => l.id);

      this.links.exit().remove();

      this.links = this.links
        .enter()
        .append('line')
        .attr('class', 'link-group')
        .attr('style', 'stroke: #dddddd; stroke-opacity: 0.6;')
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
    this.state.twiglet.nodes.updateNodes(this.currentNodes, this.currentNodeState);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;
  }

  @HostListener('document:mouseup', [])
  onMouseUp() {
    this.state.userState.clearNodeTypeToBeAdded();
  }
}
