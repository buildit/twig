import { Links } from './../../non-angular/interfaces/twiglet/link';
import { element } from 'protractor';
import { AfterViewInit, AfterContentInit, Component, ChangeDetectionStrategy, HostListener, ElementRef, OnInit } from '@angular/core';
import { D3Service, D3, Selection, Simulation, ForceLink } from 'd3-ng2-service';
import { Map, OrderedMap } from 'immutable';
import { clone, merge } from 'ramda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
   * Need to keep track of if the alt-key is currently depressed for collapsibility.
   *
   * @type {boolean}
   * @memberOf TwigletGraphComponent
   */
  altPressed: boolean;
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
   * The svg grouping that contains all of the nodes (that way nodes are always above links)
   *
   * @type {Selection<SVGGElement, any,}
   * @memberOf TwigletGraphComponent
   */
  nodesG: Selection<SVGGElement, any, null, undefined>;

  /**
   * The svg grouping that contains all of the links (that way links are always below nodes)
   *
   * @type {Selection<SVGGElement, any,}
   * @memberOf TwigletGraphComponent
   */
  linksG: Selection<SVGGElement, any, null, undefined>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentlyGraphedNodes
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  nodes: Selection<any, {}, SVGGElement, any>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentlyGraphedNodes
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  links: Selection<any, {}, SVGGElement, any>;
  /**
   * All of the nodes, regardless of whether they are graphed or not.
   *
   * @type {D3Node[]}
   * @memberOf TwigletGraphComponent
   */
  allNodes: D3Node[];
  /**
   * Same as all nodes except in object form for easy lookup.
   *
   * @type {{ [key: string]: D3Node }}
   * @memberOf TwigletGraphComponent
   */
  allNodesObject: { [key: string]: D3Node };
  /**
   * All of the nodes that should be graphed in array style to feed to force graph.
   *
   * @type {D3Node[]}
   * @memberOf TwigletGraphComponent
   */
  currentlyGraphedNodes: D3Node[];
  /**
   * An object representing the same nodes as currentlyGraphedNodes (same reference) so linking nodes is
   * very fast.
   *
   * @type {{ [key: string]: D3Node }}
   * @memberOf TwigletGraphComponent
   */
  currentlyGraphedNodesObject: { [key: string]: D3Node } = {};
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
   * All of the links, ragardless of whether they are graphed or not.
   *
   * @type {Link[]}
   * @memberOf TwigletGraphComponent
   */
  allLinks: Link[];
  /**
   * Same as above but in object form.
   *
   * @type {{ [key: string]: Link }}
   * @memberOf TwigletGraphComponent
   */
  allLinksObject: { [key: string]: Link };
  /**
   * All of the links that should be graphed in array style to feed to force graph.
   *
   * @type {Link[]}
   * @memberOf TwigletGraphComponent
   */
  currentlyGraphedLinks: Link[];
  /**
   * An object representation of this.currentlyGraphedLinks so no scanning has to be done.
   *
   * @type {{ [key: string]: Link }}
   * @memberOf TwigletGraphComponent
   */
  currentlyGraphedLinksObject: { [key: string]: Link } = {};
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
  /**
   * Where the keys are D3Node.ids and the values are an array of link ids. For fast backwards lookup
   * this is the map of sources to Links.
   *
   * @type {{ [key: string]: string[] }}
   * @memberOf TwigletGraphComponent
   */
  linkSourceMap: { [key: string]: string[] } = {};
  /**
   * Where the keys are D3Node.ids and hte values are an array of link ids. For fast backwards lookup
   * this is a map of the targets to Links.
   *
   * @type {{ [key: string]: string[] }}
   * @memberOf TwigletGraphComponent
   */
  linkTargetMap: { [key: string]: string[] } = {};

  constructor(private element: ElementRef, d3Service: D3Service, state: StateService, public modalService: NgbModal) {
    this.currentlyGraphedNodes = [];
    this.currentlyGraphedLinks = [];
    this.currentNodeState = {
      data: null
    };
    this.d3 = d3Service.getD3();
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
      .on('tick', this.ticked.bind(this))
      .on('end', this.publishNewCoordinates.bind(this));
    this.updateSimulation();
    // Shouldn't be often but these need to be after everything else is initialized
    // So that pre-loaded nodes can be rendered.
    this.state.userState.observable.subscribe(handleUserStateChanges.bind(this));
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
    this.state.twiglet.nodes.observable.subscribe(handleNodeMutations.bind(this));
    this.state.twiglet.links.observable.subscribe(handleLinkMutations.bind(this));
  }

  updateSimulation() {
    this.simulation
    .force('link', this.d3.forceLink().distance(10).strength(0.5))
    .force('charge', this.d3.forceManyBody().strength(0.5 * this.userState.scale))
    .force('collide', this.d3.forceCollide().radius((d3Node: D3Node) => d3Node.radius + 15).iterations(16));
    this.restart();
    if (this.simulation.alpha() < 0.5) {
      this.simulation.alpha(0.5).restart();
    }
  }

  ngAfterContentInit() {
    this.onResize();
  }

  ngAfterViewInit() {
    this.state.loadTwiglet('whatever');
  }

  /**
   * Adds and removes nodes from the DOM as needed based on this.currentlyGraphedNodes.
   * @memberOf TwigletGraphComponent
   */
  restart() {
    if (this.d3Svg) {
      this.d3Svg.on('mouseup', null);
      this.currentlyGraphedNodes.forEach(keepNodeInBounds.bind(this));
      this.state.twiglet.nodes.updateNodes(this.currentlyGraphedNodes, this.currentNodeState);

      this.nodes = this.nodesG.selectAll('.node-group').data(this.currentlyGraphedNodes, (d: D3Node) => d.id);

      /**
       * exit affects all of the elements on the svg that do not have a corresponding node in
       * this.currentlyGraphedNodes anymore. Remove them from the screen.
       */
      this.nodes.exit().remove();

      /**
       * Enter affects all of the nodes in our array (this.currentlyGraphedNodes) that do not already
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

      this.links = this.linksG.selectAll('.link-group').data(this.currentlyGraphedLinks, (l: Link) => l.id);

      this.links.exit().remove();

      const linkEnter = this.links
        .enter()
        .append('g')
        .attr('id', (link: Link) => `id-${link.id}`)
        .attr('class', 'link-group');

      linkEnter.append('line')
        .attr('style', 'stroke: #dddddd; stroke-opacity: 0.6;');

      linkEnter.append('circle')
        .attr('class', 'circle invisible')
        .attr('r', 10);

      linkEnter.append('text')
        .attr('text-anchor', 'middle')
        .text((link: Link) => link.association);

      this.links = linkEnter.merge(this.links);

      /**
       * Restart the simulation so that nodes can reposition themselves.
       */
      this.simulation.nodes(this.currentlyGraphedNodes);
      (this.simulation.force('link') as ForceLink<any, any>).links(this.currentlyGraphedLinks).distance(5 * this.userState.scale);
    }
  }

  toggleNodeCollapsibility(d3Node: D3Node, initial = true) {
    d3Node.collapsed = !d3Node.collapsed;
    const hidden = d3Node.collapsed;
    (this.linkSourceMap[d3Node.id] || []).forEach((linkId: string) => {
      this.allLinksObject[linkId].hidden = hidden;
      const targetNodeId = (this.allLinksObject[linkId].target as D3Node).id;
      const node = this.allNodesObject[targetNodeId];
      node.hidden = hidden;
      if (this.userState.cascadingCollapse) {
        this.toggleNodeCollapsibility(node, false);
      }
    });
    if (initial) {
      this.state.twiglet.nodes.updateNodes(this.allNodes);
      this.state.twiglet.links.updateLinks(this.allLinks);
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
    this.links.select('line')
      .attr('x1', (link: Link) => (link.source as D3Node).x)
      .attr('y1', (link: Link) => (link.source as D3Node).y)
      .attr('x2', (link: Link) => (link.target as D3Node).x)
      .attr('y2', (link: Link) => (link.target as D3Node).y);

    this.links.select('circle')
      .attr('cx', (link: Link) => ((link.source as D3Node).x + (link.target as D3Node).x) / 2)
      .attr('cy', (link: Link) => ((link.source as D3Node).y + (link.target as D3Node).y) / 2);

    this.links.select('text')
      .attr('x', (link: Link) => ((link.source as D3Node).x + (link.target as D3Node).x) / 2)
      .attr('y', (link: Link) => ((link.source as D3Node).y + (link.target as D3Node).y) / 2);
  }


  /**
   * Handles the tick events from d3.
   * @memberOf TwigletGraphComponent
   */
  ticked() {
    this.currentlyGraphedNodes.forEach(keepNodeInBounds.bind(this));
    this.updateNodeLocation();
    this.updateLinkLocation();
  }

  /**
   * Publishes coordinates of the nodes to the rest of the app.
   * @memberOf TwigletGraphComponent
   */
  publishNewCoordinates() {
    this.state.twiglet.nodes.updateNodes(this.currentlyGraphedNodes, this.currentNodeState);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;
    this.simulation
    .force('x', this.d3.forceX(this.width / 2))
    .force('y', this.d3.forceY(this.height / 2));
  }

  @HostListener('document:mouseup', [])
  onMouseUp() {
    this.state.userState.clearNodeTypeToBeAdded();
  }

  @HostListener('window:keydown', ['$event'])
  keyboardDown(event: KeyboardEvent) {
    if (event.altKey) {
      this.altPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    this.altPressed = false;
  }
}
