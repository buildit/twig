import { Subscription } from 'rxjs';
import { element } from 'protractor';
import { ActivatedRoute, Params } from '@angular/router';
import { AfterContentInit, Component, ChangeDetectionStrategy, HostListener, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { D3Service, D3, Selection, Simulation, ForceLink } from 'd3-ng2-service';
import { Map, OrderedMap } from 'immutable';
import { clone, merge } from 'ramda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// State related
import { StateService } from '../state.service';
import {
  StateCatcher,
  UserStateService,
} from '../../non-angular/services-helpers';

// Interfaces
import { D3Node, isD3Node, Model, ModelEntity, ModelNode, Link, UserState } from '../../non-angular/interfaces';

// Event Handlers
import {
  mouseMoveOnCanvas,
  mouseUpOnCanvas,
} from './inputHandlers';
import { addAppropriateMouseActionsToNodes, handleUserStateChanges } from './handleUserStateChanges';

// helpers
import { keepNodeInBounds } from './locationHelpers';
import { handleGraphMutations } from './handleGraphMutations';
import { getColorFor, getNodeImage, getRadius } from './nodeAttributesToDOMAttributes';
import { toggleNodeCollapsibility } from './collapseAndFlowerNodes';

@Component({
  providers: [D3Service],
  selector: 'app-twiglet-graph',
  styleUrls: ['./twiglet-graph.component.scss'],
  templateUrl: './twiglet-graph.component.html',
})
export class TwigletGraphComponent implements OnInit, AfterContentInit, OnDestroy {
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
   * The nodes that D3 is currently graphing (allNodes without the hiddens.)
   *
   * @type {D3Node[]}
   * @memberOf TwigletGraphComponent
   */
  currentlyGraphedNodes: D3Node[];
  /**
   * Since d3 makes changes to our nodes independent from the rest of angular, it should not be
   * making changes then reacting to it's own changes. This allows us to capture the state
   * before it is broadcast so comparisons can be made and this component does not double react
   * to everything it fires off. This shouldn't be added to any other component.
   *
   * @type {{ data: OrderedMap<string, Map<string, any>> }}
   * @memberOf TwigletGraphComponent
   */
  currentTwigletState: { data: OrderedMap<string, any> };
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
  /**
   * Holds the userStateSubscription so that we can unsubscribe on destroy
   *
   * @type {Subscription}
   * @memberOf TwigletGraphComponent
   */
  userStateSubscription: Subscription;
  /**
   * Holds the model service subscription so we can unsubscribe on destroy.
   *
   * @type {Subscription}
   * @memberOf TwigletGraphComponent
   */
  modelServiceSubscription: Subscription;
  /**
   * Holds the twiglet service subscription so we can unsubscribe on destroy
   *
   * @type {Subscription}
   * @memberOf TwigletGraphComponent
   */
  twigletServiceSubscription: Subscription;
  /**
   * Holds the route service subscription so we can unsubscribe on destroy.
   *
   * @type {Subscription}
   * @memberOf TwigletGraphComponent
   */
  routeSubscription: Subscription;

  constructor(
      private element: ElementRef,
      d3Service: D3Service,
      public stateService: StateService,
      public modalService: NgbModal,
      private route: ActivatedRoute,
    ) {
    this.allNodes = [];
    this.allLinks = [];
    this.currentTwigletState = {
      data: null
    };
    this.d3 = d3Service.getD3();
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
    this.userStateSubscription = this.stateService.userState.observable.subscribe(handleUserStateChanges.bind(this));
    this.modelServiceSubscription = this.stateService.twiglet.modelService.observable.subscribe((response) => {
      const entities = response.get('entities').reduce((object: { [key: string]: ModelEntity }, value: Map<string, any>, key: string) => {
        object[key] = value.toJS();
        return object;
      }, {});
      this.model = {
        entities,
      };
    });
    this.twigletServiceSubscription = this.stateService.twiglet.observable.subscribe((response) => {
      handleGraphMutations.bind(this)(response);
    });
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.stateService.twiglet.loadTwiglet(params['id']);
    });
  }

  ngOnDestroy() {
    this.userStateSubscription.unsubscribe();
    this.modelServiceSubscription.unsubscribe();
    this.twigletServiceSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  updateSimulation() {
    this.simulation
    .force('x', this.d3.forceX(this.width / 2).strength(this.userState.forceGravityX))
    .force('y', this.d3.forceY(this.height / 2).strength(this.userState.forceGravityY))
    .force('link', (this.simulation.force('link') as ForceLink<any, any> || this.d3.forceLink())
            .distance(this.userState.forceLinkDistance * this.userState.scale)
            .strength(this.userState.forceLinkStrength))
    .force('charge', this.d3.forceManyBody().strength(this.userState.forceChargeStrength * this.userState.scale))
    .force('collide', this.d3.forceCollide().radius((d3Node: D3Node) => d3Node.radius + 15).iterations(16));
    this.restart();
    if (this.simulation.alpha() < 0.5) {
      this.simulation.alpha(0.5).restart();
    }
  }

  ngAfterContentInit() {
    this.onResize();
  }

  /**
   * Adds and removes nodes/links from the DOM as needed .
   * @memberOf TwigletGraphComponent
   */
  restart() {
    if (this.d3Svg) {
      this.d3Svg.on('mouseup', null);
      this.allNodes.forEach(keepNodeInBounds.bind(this));
      this.stateService.twiglet.updateNodes(this.allNodes, this.currentTwigletState);

      this.currentlyGraphedNodes = this.allNodes.filter((d3Node: D3Node) => {
        return !d3Node.hidden;
      });

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
          .on('click', (d3Node: D3Node) => this.stateService.userState.setCurrentNode(d3Node.id));

      addAppropriateMouseActionsToNodes.bind(this)(nodeEnter);

      this.simulation.alpha(0.9);

      nodeEnter.append('text')
        .attr('class', 'node-image')
        .attr('y', 0)
        .attr('font-size', (d3Node: D3Node) => `${getRadius.bind(this)(d3Node)}px`)
        .attr('stroke', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
        .attr('fill', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
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

      const linkType = this.userState.linkType;

      const graphedLinks = this.allLinks.filter((link: Link) => {
        return !link.hidden;
      });

      this.links = this.linksG.selectAll('.link-group').data(graphedLinks, (l: Link) => l.id);

      this.links.exit().remove();

      const linkEnter = this.links
        .enter()
        .append('g')
        .attr('id', (link: Link) => `id-${link.id}`)
        .attr('class', 'link-group');

      linkEnter.append(linkType)
        .attr('class', 'link');

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
      (this.simulation.force('link') as ForceLink<any, any>).links(graphedLinks)
        .distance(this.userState.forceLinkDistance * this.userState.scale)
        .strength(this.userState.forceLinkStrength);
    }
  }

  linkArc (link: Link) {
    if (isD3Node(link.target) && isD3Node(link.source)) {
      const tx = Math.max(link.target.radius,
                        Math.min(this.width - link.target.radius, link.target.x));
      const ty = Math.max(link.target.radius + 25,
                      Math.min(this.height - link.target.radius, link.target.y));
      const sx = Math.max(link.source.radius,
                      Math.min(this.width - link.source.radius, link.source.x));
      const sy = Math.max(link.source.radius + 25,
                      Math.min(this.height - link.source.radius, link.source.y));
      const dx = tx - sx;
      const dy = ty - sy;

      const linksFromSource = this.linkSourceMap[link.source.id];
      const linksFromSourceToTarget = linksFromSource.filter((linkId) => {
        return this.allLinksObject[linkId].target === link.target;
      });

      const totalLinkNum = linksFromSourceToTarget.length;
      // work out how many unique links exist between the source and target nodes
      let dr = Math.sqrt(dx * dx + dy * dy);

      // if there are multiple links between these two nodes,
      // we need generate different dr for each path
      if (totalLinkNum > 1) {
        dr = dr / (1 + (1 / totalLinkNum) * ((linksFromSourceToTarget.indexOf(link.id) + 1) / 2));
      }

      return 'M'
        + `${sx},`
        + `${sy}A${dr},`
        + `${dr} 0 0,1 `
        + `${tx},${ty}`;
    }
    return '';
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
    this.links.select('path')
      .attr('d', this.linkArc.bind(this));
    this.links.select('line')
      .attr('x1', (link: Link) => (link.source as D3Node).x)
      .attr('y1', (link: Link) => (link.source as D3Node).y)
      .attr('x2', (link: Link) => (link.target as D3Node).x)
      .attr('y2', (link: Link) => (link.target as D3Node).y);

    if (this.userState.isEditing) {
      this.links.select('circle')
        .attr('cx', (link: Link) => ((link.source as D3Node).x + (link.target as D3Node).x) / 2)
        .attr('cy', (link: Link) => ((link.source as D3Node).y + (link.target as D3Node).y) / 2);
    }

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
    console.log('publishNewCoordinates');
    this.stateService.twiglet.updateNodes(this.currentlyGraphedNodes, this.currentTwigletState);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;
    this.simulation
    .force('x', this.d3.forceX(this.width / 2).strength(this.userState.forceGravityX))
    .force('y', this.d3.forceY(this.height / 2).strength(this.userState.forceGravityY));
  }

  @HostListener('document:mouseup', [])
  onMouseUp() {
    this.stateService.userState.clearNodeTypeToBeAdded();
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
