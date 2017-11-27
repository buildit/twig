import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener,
  NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { D3, D3Service, ForceLink, Selection, Simulation } from 'd3-ng2-service';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { clone, merge } from 'ramda';
import { Subscription } from 'rxjs/Subscription';
import MODEL_CONSTANTS from '../../../non-angular/services-helpers/models/constants';
import TWIGLET_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants';
import VIEW_DATA_CONSTANTS from '../../../non-angular/services-helpers/twiglet/constants/view/data';
import USERSTATE_CONSTANTS from '../../../non-angular/services-helpers/userState/constants';

// State related
import {
  StateCatcher,
  UserStateService,
} from '../../../non-angular/services-helpers';
import { StateService } from '../../state.service';

// Interfaces
import { D3Node, GravityPoint, isD3Node, Link, Model, ModelEntity,
  MultipleGravities, UserState } from '../../../non-angular/interfaces';
import { multipleGravities } from '../../../non-angular/d3Forces';

// Event Handlers
import {
  addAppropriateMouseActionsToGravityPoints,
  addAppropriateMouseActionsToLinks,
  addAppropriateMouseActionsToNodes,
  handleUserStateChanges, } from './handleUserStateChanges';

  // Event Handlers
import { handleViewDataChanges, } from './handleViewDataChanges';

import {
  mouseMoveOnCanvas,
  mouseUpOnCanvas,
} from './inputHandlers';

// helpers
import { getColorFor, getColorForLink, getNodeImage, getSizeFor, getSizeForLink } from './nodeAttributesToDOMAttributes';
import { handleGraphMutations } from './handleGraphMutations';
import { keepNodeInBounds, scaleNodes } from './locationHelpers';

@Component({
  providers: [D3Service],
  selector: 'app-twiglet-graph',
  styleUrls: ['./twiglet-graph.component.scss'],
  templateUrl: './twiglet-graph.component.html',
})
export class TwigletGraphComponent implements OnInit, OnDestroy {
  MODEL = MODEL_CONSTANTS;
  TWIGLET = TWIGLET_CONSTANTS;
  USERSTATE = USERSTATE_CONSTANTS;
  VIEW_DATA = VIEW_DATA_CONSTANTS;
  distance = 1;
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
  width = 800;
  /**
   * The height of the svg so it can be dynamically resized.
   *
   * @type {number}
   * @memberOf TwigletGraphComponent
   */
  height = 500;
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
   * The svg grouping that contains all of the gravity points (that way gravity points are always below links )
   *
   * @type {Selection<SVGGElement, any,}
   * @memberOf TwigletGraphComponent
   */
  gravityPointsG: Selection<SVGGElement, any, null, undefined>;

  // The directional arrows that appear on line links
  arrows;

  /**
   * The actual <g> elements that represent all of the nodes in this.currentlyGraphedNodes
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  nodes: Selection<any, {}, SVGGElement, any>;

  /**
   * The actual <g> elements that represent all of the links
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  links: Selection<any, {}, SVGGElement, any>;

  /**
   * The actual <g> elements that represent all of the gravity points
   *
   * @type {Selection<any, {}, SVGSVGElement, any>}
   * @memberOf TwigletGraphComponent
   */
  gravityPoints: Selection<any, {}, SVGGElement, any>;

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

  // array of all the gravity points
  allGravityPoints = [];

  margin = 20;

  /**
   * The model currently being used on the twiglet.
   *
   * @type {Model}
   * @memberOf TwigletGraphComponent
   */
  model: Model;

  /**
   * The Model as it's raw map.
   *
   * @type {Map<string, any>}
   * @memberOf TwigletGraphComponent
   */
  modelMap: Map<string, any>;

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
   * the currently selected node for linking
   *
   * @type {D3Node}
   * @memberOf TwigletGraphComponent
   */
  tempNode: D3Node;

  /**
   * If a node is being dragged.
   *
   *
   * @memberof TwigletGraphComponent
   */
  isDragging = false;

  /**
   * The current User State of our app
   *
   * @type {Map<string, any>}
   * @memberOf TwigletGraphComponent
   */
  viewData: Map<string, any> = Map({
    filters: Map({
        attributes: List([]),
        types: Map({}),
      }),
    gravityPoints: Map({})
  });

  userState: Map<string, any> = Map({});

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
   * The current twiglet id so we can bring the alpha back up to reset everything.
   *
   * @type {string}
   * @memberOf TwigletGraphComponent
   */
  currentTwigletId: string;

  /**
   * Holds the userStateSubscription so that we can unsubscribe on destroy
   *
   * @type {Subscription}
   * @memberOf TwigletGraphComponent
   */
  userStateSubscription: Subscription;

  /**
   * Holds the viewDataSubscription so that we can unsubscribe on destroy
   *
   * @type {Subscription}
   * @memberOf TwigletGraphComponent
   */
  viewDataSubscription: Subscription;

  /**
   * Holds the model service subscription so we can unsubscribe on destroy.
   *
   * @type {Subscription}
   * @memberOf TwigletGraphComponent
   */
  modelServiceSubscription: Subscription;

  /**
   * The raw twiglet for passing to other components as needed.
   *
   * @type {Map<string, any>}
   * @memberOf TwigletGraphComponent
   */
  twiglet: Map<string, any> = Map({});
  twigletModel: Map<string, any> = Map({});
  twiglets: List<Object>;

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
  toBeHighlighted = { nodes: {}, links: {} };
  currentTwiglet;
  originalTwiglet;

  constructor(
      private element: ElementRef,
      d3Service: D3Service,
      public stateService: StateService,
      public modalService: NgbModal,
      private route: ActivatedRoute,
      public ngZone: NgZone,
      public toastr: ToastsManager,
      private cd: ChangeDetectorRef
    ) {
    this.allNodes = [];
    this.allLinks = [];
    this.d3 = d3Service.getD3();
    stateService.twiglet.twiglets.subscribe(twiglets => {
      this.twiglets = twiglets;
      this.cd.markForCheck();
    });
    stateService.twiglet.modelService.observable.subscribe(model => {
      this.twigletModel = model;
      this.cd.markForCheck();
    });
  }

  /**
   * Initializes the component once the component is mounted.
   * @memberOf TwigletGraphComponent
   */
  ngOnInit() {
    this.d3Svg = this.d3.select(this.element.nativeElement).select<SVGSVGElement>('svg');
    this.nodesG = this.d3Svg.select<SVGGElement>('#nodesG');
    this.linksG = this.d3Svg.select<SVGGElement>('#linksG');
    this.gravityPointsG = this.d3Svg.select<SVGGElement>('#gravityPointsG');
    this.arrows = this.d3Svg.append('defs');
    this.nodes = this.nodesG.selectAll('.node-group');
    this.links = this.linksG.selectAll('.link-group');
    this.gravityPoints = this.gravityPointsG.selectAll('.gravity-point-group');
    this.d3Svg.on('mousemove', mouseMoveOnCanvas(this));
    this.ngZone.runOutsideAngular(() => {
      this.simulation = this.d3.forceSimulation([])
        .on('end', this.simulationEnded.bind(this))
        .on('tick', this.ticked.bind(this));
    });
    this.updateSimulation();
    // Shouldn't be often but these need to be after everything else is initialized
    // So that pre-loaded nodes can be rendered.
    this.userStateSubscription = this.stateService.userState.observable.subscribe(response => {
      setTimeout(handleUserStateChanges.bind(this)(response), 0);
    });

    this.viewDataSubscription = this.stateService.twiglet.viewService.observable.subscribe(response => {
      setTimeout(handleViewDataChanges.bind(this)(response), 0);
    });
    this.modelServiceSubscription = this.stateService.twiglet.modelService.observable.subscribe((response) => {
      this.modelMap = response;
      const entities = response.get(this.MODEL.ENTITIES)
      .reduce((object: { [key: string]: ModelEntity }, value: Map<string, any>, key: string) => {
        object[key] = value.toJS();
        return object;
      }, {});
      this.model = {
        entities,
      };
    });
    this.twigletServiceSubscription = this.stateService.twiglet.observable.subscribe((response) => {
      setTimeout(handleGraphMutations.bind(this)(response), 0);
    });
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.currentTwiglet = params['name'];
      if ((this.currentTwiglet !== this.originalTwiglet) && !params['view']) {
        this.originalTwiglet = this.currentTwiglet;
        this.stateService.userState.clearCurrentView();
      }
      if (params['view']) {
        this.stateService.userState.setCurrentView(params['view']);
      }
      if (params['name']) {
        this.stateService.twiglet.loadTwiglet(params['name'], params['view']).subscribe(() => undefined);
      }
    });
  }

  ngOnDestroy() {
    this.userStateSubscription.unsubscribe();
    this.viewDataSubscription.unsubscribe();
    this.modelServiceSubscription.unsubscribe();
    this.twigletServiceSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  updateSimulation() {
    this.ngZone.runOutsideAngular(() => {
      const distance = +this.viewData.get(this.VIEW_DATA.SEPARATION_DISTANCE);
      this.simulation.restart()
      .force('multipleGravities', multipleGravities().centerX(this.width / 2).centerY(this.height / 2)
        .strengthX(isNaN(this.viewData.get(this.VIEW_DATA.FORCE_GRAVITY_X)) ? 0.1 : this.viewData.get(this.VIEW_DATA.FORCE_GRAVITY_X))
        .strengthY(isNaN(this.viewData.get(this.VIEW_DATA.FORCE_GRAVITY_Y)) ? 0.1 : this.viewData.get(this.VIEW_DATA.FORCE_GRAVITY_Y))
        .gravityPoints(this.viewData.get(this.VIEW_DATA.GRAVITY_POINTS) || {}))
      .force('link', (this.simulation.force('link') as ForceLink<any, any> || this.d3.forceLink())
              .distance(this.viewData.get(this.VIEW_DATA.FORCE_LINK_DISTANCE) * this.viewData.get(this.VIEW_DATA.SCALE))
              .strength(this.viewData.get(this.VIEW_DATA.FORCE_LINK_STRENGTH)))
      .force('charge', this.d3.forceManyBody()
        .strength(this.viewData.get(this.VIEW_DATA.FORCE_CHARGE_STRENGTH) * this.viewData.get(this.VIEW_DATA.SCALE)))
      .force('collide', this.d3.forceCollide()
        .radius((d3Node: D3Node) => {
          return d3Node.radius + distance;
        }).iterations(2));
      this.restart();
    });
  }

  /**
   * Adds and removes nodes/links from the DOM as needed .
   * @memberOf TwigletGraphComponent
   */
  restart() {
    if (this.d3Svg && this.viewData.get(this.VIEW_DATA.RUN_SIMULATION)) {
      this.d3Svg.on('mouseup', null);

      scaleNodes.bind(this)(this.allNodes);

      this.nodes.each((node: D3Node) => {
        const existingNode = this.allNodesObject[node.id];
        if (existingNode) {
          const group = this.d3.select(`#id-${cleanId(node.id)}`);
          if (node.type !== existingNode.type) {
            group.select('.node-image')
            .text(getNodeImage.bind(this)(existingNode));
          }
          if (node.radius !== existingNode.radius) {
            group.select('.node-image').attr('font-size', `${getSizeFor.bind(this)(existingNode)}px`);
            group.select('.node-name').attr('dy', existingNode.radius / 2 + 12);
          }
          if (node.name !== existingNode.name) {
            group.select('.node-name').text(existingNode.name);
          }
          group.select('.node-image')
            .attr('stroke', getColorFor.bind(this)(existingNode))
            .attr('fill', getColorFor.bind(this)(existingNode));
          group.select('.node-name')
            .attr('stroke', getColorFor.bind(this)(existingNode));
        }
      });

      const linkType = this.viewData.get(this.VIEW_DATA.LINK_TYPE);

      this.links.each((link: Link) => {
        const existingLink = this.allLinksObject[link.id];
        if (existingLink) {
          const group = this.d3.select(`#id-${cleanId(link.id)}`);
          if (link._size !== existingLink._size) {
            group.select(linkType)
            .style('stroke-width', getSizeForLink.bind(this)(existingLink));
          }
          if (link._color !== existingLink._color) {
            group.select(linkType)
            .style('stroke', getColorForLink.bind(this)(existingLink));
          }
          if (link.association !== existingLink.association) {
            group.select('.link-name').text(existingLink.association);
          }
        }
      });

      this.nodes = this.nodesG.selectAll('.node-group').data(this.allNodes, (d: D3Node) => d.id);

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
          .attr('transform', (d3Node: D3Node) => `translate(${d3Node.x || 0},${d3Node.y || 0})`)
          .attr('fill', 'white')
          .on('click', (d3Node: D3Node) => this.stateService.userState.setCurrentNode(d3Node.id));

      addAppropriateMouseActionsToNodes.bind(this)(nodeEnter);

      nodeEnter.append('text')
        .attr('class', 'node-image')
        .attr('y', 0)
        .attr('font-size', (d3Node: D3Node) => `${getSizeFor.bind(this)(d3Node)}px`)
        .attr('stroke', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
        .attr('fill', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
        .attr('text-anchor', 'middle')
        .text((d3Node: D3Node) => getNodeImage.bind(this)(d3Node));

      nodeEnter.append('text')
        .attr('class', 'node-name')
        .classed('invisible', !this.viewData.get(this.VIEW_DATA.SHOW_NODE_LABELS))
        .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12)
        .attr('stroke', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
        .attr('text-anchor', 'middle')
        .text((d3Node: D3Node) => d3Node.name);

      this.nodes = nodeEnter.merge(this.nodes);

      this.d3Svg.on('mouseup', mouseUpOnCanvas(this));

      this.links = this.linksG.selectAll('.link-group').data(this.allLinks, (l: Link) => l.id);

      this.links.exit().remove();

      const linkEnter = this.links
        .enter()
        .append('g')
        .attr('id', (link: Link) => `id-${link.id}`)
        .attr('class', 'link-group');

      linkEnter.append(linkType)
        .attr('class', 'link')
        .style('stroke', (link: Link) => getColorForLink.bind(this)(link))
        .style('stroke-width', (link: Link) => getSizeForLink.bind(this)(link));

      linkEnter.append('circle')
        .attr('class', 'circle')
        .classed('invisible', !this.userState.get(this.USERSTATE.IS_EDITING))
        .attr('r', 10)
        .style('stroke', (link: Link) => getColorForLink.bind(this)(link));

      addAppropriateMouseActionsToLinks.bind(this)(linkEnter);

      linkEnter.append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'link-name')
        .classed('invisible', !this.viewData.get(this.VIEW_DATA.SHOW_LINK_LABELS))
        .attr('stroke', (link: Link) => getColorForLink.bind(this)(link))
        .text((link: Link) => link.association);

      this.links = linkEnter.merge(this.links);

      if (this.viewData.get(this.VIEW_DATA.LINK_TYPE) === 'line') {
        this.addArrows();
      }

      this.gravityPoints = this.gravityPointsG.selectAll('.gravity-point-group')
        .data([], (gravityPoint: GravityPoint) => gravityPoint.name);

      this.gravityPoints.exit().remove();

      if (this.viewData.get(this.VIEW_DATA.GRAVITY_POINTS).size) {
        const gravityPointsArray = this.viewData.get(this.VIEW_DATA.GRAVITY_POINTS).valueSeq().toJS();

        this.gravityPoints = this.gravityPointsG.selectAll('.gravity-point-group')
          .data(gravityPointsArray, (gravityPoint: GravityPoint) => gravityPoint.id);

        this.gravityPoints.exit().remove();

        const gravityPointsEnter = this.gravityPoints
          .enter()
          .append('g')
          .attr('id', (gravityPoint: GravityPoint) => `id-${gravityPoint.id}`)
          .attr('class', 'gravity-point-group')
          .attr('transform', (gravityPoint: GravityPoint) => `translate(${gravityPoint.x || 0},${gravityPoint.y || 0})`);

        gravityPointsEnter.append('circle')
          .attr('class', 'gravity-circle')
          .attr('r', 30);

        addAppropriateMouseActionsToGravityPoints.bind(this)(gravityPointsEnter);

        gravityPointsEnter.append('text')
          .attr('class', 'gravity-point-name')
          .attr('text-anchor', 'middle')
          .text((gravityPoint: GravityPoint) => gravityPoint.name);

        this.gravityPoints = gravityPointsEnter.merge(this.gravityPoints);

      }

      /**
       * Restart the simulation so that nodes can reposition themselves.
       */
      this.ngZone.runOutsideAngular(() => {
        if (!this.userState.get(this.USERSTATE.IS_EDITING) && this.viewData.get(this.VIEW_DATA.RUN_SIMULATION)) {
          this.stateService.userState.setSimulating(true);
          this.simulation.alpha(0.5).alphaTarget(this.viewData.get(this.VIEW_DATA.ALPHA_TARGET)).restart();
          this.simulation.nodes(this.allNodes);
          (this.simulation.force('link') as ForceLink<any, any>).links(this.allLinks)
            .distance(this.viewData.get(this.VIEW_DATA.FORCE_LINK_DISTANCE) * this.viewData.get(this.VIEW_DATA.SCALE))
            .strength(this.viewData.get(this.VIEW_DATA.FORCE_LINK_STRENGTH));
        } else {
          this.updateLinkLocation();
          this.updateCircleLocation();
        }
      });
    }
  }

  linkArc (link: Link) {
    if (isD3Node(link.target) && isD3Node(link.source)) {
      const tx = Math.max(link.target.radius,
                        Math.min(this.width - link.target.radius, link.target.x));
      const ty = Math.max(link.target.radius,
                      Math.min(this.height - link.target.radius, link.target.y));
      const sx = Math.max(link.source.radius,
                      Math.min(this.width - link.source.radius, link.source.x));
      const sy = Math.max(link.source.radius,
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

      if (sx && sy && dr && tx && ty) {
        return 'M'
          + `${sx},`
          + `${sy}A${dr},`
          + `${dr} 0 0,1 `
          + `${tx},${ty}`;
      }
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

    if (this.viewData.get(this.VIEW_DATA.LINK_TYPE) === 'line') {
      this.links.select('text')
      .attr('x', (link: Link) => ((link.source as D3Node).x + (link.target as D3Node).x) / 2)
      .attr('y', (link: Link) => ((link.source as D3Node).y + (link.target as D3Node).y) / 2);
    } else {
       const self = this;
        this.links.each(function(l) {
          const link = self.d3.select(this);
          if (link) {
            const pathEl = link.select('path').node() as any;
            const midPoint = pathEl.getPointAtLength(pathEl.getTotalLength() / 2);
            link.select('text')
            .attr('x', midPoint.x)
            .attr('y', midPoint.y);
          }
        });
    }
  }

  updateCircleLocation() {
    if (this.viewData.get(this.VIEW_DATA.LINK_TYPE) === 'line') {
        this.links.select('circle')
        .attr('cx', (link: Link) => ((link.source as D3Node).x + (link.target as D3Node).x) / 2)
        .attr('cy', (link: Link) => ((link.source as D3Node).y + (link.target as D3Node).y) / 2);
      } else {
        const self = this;
        this.links.each(function(l) {
          const link = self.d3.select(this);
          if (link) {
            const pathEl = link.select('path').node() as any;
            const midPoint = pathEl.getPointAtLength(pathEl.getTotalLength() / 2);
            link.select('circle')
            .attr('cx', midPoint.x)
            .attr('cy', midPoint.y);
          }
        });
      }
  }

  /**
   * Adds the markers/directional arrows to the links.
   * @memberOf TwigletGraphComponent
   */
  addArrows () {
    this.arrows.selectAll('marker')
      .data(() => [`relation`])
    .enter()
    .append('marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 40)
      .attr('refY', 0)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('orient', 'auto')
    .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .style('stroke', '#46798D')
      .style('opacity', '1');
  }

  /**
   * Updates the locations of the gravity points on the svg. Called to sync the simulation with the display.
   * @memberOf TwigletGraphComponent
   */
  updateGravityPointLocation() {
    this.gravityPoints.attr('transform', (gp: GravityPoint) => `translate(${gp.x},${gp.y})`);
  }

  /**
   * Handles the tick events from d3.
   * @memberOf TwigletGraphComponent
   */
  ticked() {
    this.ngZone.runOutsideAngular(() => {
      this.allNodes.forEach(keepNodeInBounds.bind(this));
      this.publishNewCoordinates();
      if (this.viewData.get(this.VIEW_DATA.RENDER_ON_EVERY_TICK) || this.isDragging) {
        this.updateNodeLocation();
        this.updateLinkLocation();
      }
    });
  }

  simulationEnded() {
    this.ngZone.runOutsideAngular(() => {
      this.stateService.userState.setSimulating(false);
      this.updateNodeLocation();
      this.updateLinkLocation();
      this.publishNewCoordinates();
    });
  }

  /**
   * Publishes coordinates of the nodes to the rest of the app.
   * @memberOf TwigletGraphComponent
   */
  publishNewCoordinates() {
    this.stateService.twiglet.updateNodeCoordinates(this.allNodes);
  }

  @HostListener('resize', ['$event'])
  onResize(event: Event) {
    this.width = (<HTMLElement>event.target).clientWidth;
    this.height = (<HTMLElement>event.target).clientHeight;
    this.ngZone.runOutsideAngular(() => {
      const mg = <MultipleGravities>this.simulation.force('multipleGravities');
      if (mg && mg.centerX) {
        mg.centerX(this.width / 2).centerY(this.height / 2);
        this.restart();
      }
    });
  }

  @HostListener('document:mouseup', [])
  onMouseUp() {
    this.stateService.userState.setNodeTypeToBeAdded(null);
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

function cleanId(id: string) {
  if (id) {
    return id.split('.').join('\\.').split('#').join('\\#');
  }
  return null;
}

