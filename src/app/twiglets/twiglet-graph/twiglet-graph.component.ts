import { AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { D3, D3Service, ForceLink, Selection, Simulation } from 'd3-ng2-service';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { element } from 'protractor';
import { clone, merge } from 'ramda';
import { Subscription } from 'rxjs/Subscription';

// State related
import {
  StateCatcher,
  UserStateService,
} from '../../../non-angular/services-helpers';
import { StateService } from '../../state.service';

// Interfaces
import { D3Node, GravityPoint, isD3Node, Link, Model, ModelEntity,
  ModelNode, MultipleGravities, UserState } from '../../../non-angular/interfaces';

import { multipleGravities } from '../../../non-angular/d3Forces';

// Event Handlers
import {
  addAppropriateMouseActionsToGravityPoints,
  addAppropriateMouseActionsToLinks,
  addAppropriateMouseActionsToNodes,
  handleUserStateChanges } from './handleUserStateChanges';

import {
  mouseMoveOnCanvas,
  mouseUpOnCanvas,
} from './inputHandlers';

// helpers
import { FilterByObjectPipe } from './../../shared/pipes/filter-by-object.pipe';
import { FilterNodesPipe } from './../../shared/pipes/filter-nodes.pipe';
import { getColorFor, getNodeImage, getSizeFor } from './nodeAttributesToDOMAttributes';
import { handleGraphMutations } from './handleGraphMutations';
import { keepNodeInBounds, scaleNodes, setDepths } from './locationHelpers';
import { toggleNodeCollapsibility } from './collapseAndFlowerNodes';

@Component({
  providers: [D3Service],
  selector: 'app-twiglet-graph',
  styleUrls: ['./twiglet-graph.component.scss'],
  templateUrl: './twiglet-graph.component.html',
})
export class TwigletGraphComponent implements OnInit, AfterContentInit, OnDestroy {
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
   * The nodes that D3 is currently graphing (allNodes without the hiddens.)
   *
   * @type {D3Node[]}
   * @memberOf TwigletGraphComponent
   */
  currentlyGraphedNodes: D3Node[] = [];

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
  userState: Map<string, any> = Map({
    filters: Map({
        attributes: List([]),
        types: Map({}),
      }),
    gravityPoints: Map({})
  });

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
    ) {
    this.allNodes = [];
    this.allLinks = [];
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
    this.modelServiceSubscription = this.stateService.twiglet.modelService.observable.subscribe((response) => {
      this.modelMap = response;
      const entities = response.get('entities').reduce((object: { [key: string]: ModelEntity }, value: Map<string, any>, key: string) => {
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
        this.stateService.userState.resetAllDefaults();
        this.stateService.userState.clearCurrentView();
      }
      if (params['view']) {
        this.stateService.userState.setCurrentView(params['view']);
      }
      this.stateService.twiglet.loadTwiglet(params['name'], params['view']).subscribe(() => undefined);
    });
  }

  ngOnDestroy() {
    this.userStateSubscription.unsubscribe();
    this.modelServiceSubscription.unsubscribe();
    this.twigletServiceSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  updateSimulation() {
    this.ngZone.runOutsideAngular(() => {
      const distance = +this.userState.get('separationDistance');
      this.simulation.restart()
      .force('multipleGravities', multipleGravities().centerX(this.width / 2).centerY(this.height / 2)
        .strengthX(isNaN(this.userState.get('forceGravityX')) ? 0.1 : this.userState.get('forceGravityX'))
        .strengthY(isNaN(this.userState.get('forceGravityY')) ? 0.1 : this.userState.get('forceGravityY'))
        .gravityPoints(this.userState.get('gravityPoints') || {}))
      .force('link', (this.simulation.force('link') as ForceLink<any, any> || this.d3.forceLink())
              .distance(this.userState.get('forceLinkDistance') * this.userState.get('scale'))
              .strength(this.userState.get('forceLinkStrength')))
      .force('charge', this.d3.forceManyBody().strength(this.userState.get('forceChargeStrength') * this.userState.get('scale')))
      .force('collide', this.d3.forceCollide()
        .radius((d3Node: D3Node) => {
          return d3Node.radius + distance;
        }).iterations(4));
      this.restart();
    });
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

      const filterByObject = new FilterByObjectPipe();
      this.currentlyGraphedNodes = filterByObject.transform(this.allNodes, this.twiglet.get('links'), this.userState.get('filters'))
      .filter((d3Node: D3Node) => {
        return !d3Node.hidden;
      });
      scaleNodes.bind(this)(this.currentlyGraphedNodes);

      this.nodes.each((node: D3Node) => {
        const existingNode = this.allNodesObject[node.id];
        if (existingNode) {
          let group;
          if (node.type !== existingNode.type) {
            group = this.d3.select(`#id-${node.id}`);
            group.select('.node-image')
            .text(getNodeImage.bind(this)(existingNode));
          }
          group = group || this.d3.select(`#id-${node.id}`);
          group.select('.node-image').attr('font-size', `${getSizeFor.bind(this)(existingNode)}px`);
          if (node.name !== existingNode.name) {
            group = group || this.d3.select(`#id-${node.id}`);
            group.select('.node-name').text(existingNode.name);
          }
          group = group || this.d3.select(`#id-${node.id}`);
          group.select('.node-image')
            .attr('stroke', getColorFor.bind(this)(existingNode))
            .attr('fill', getColorFor.bind(this)(existingNode));
          group.select('.node-name')
            .attr('stroke', getColorFor.bind(this)(existingNode));
        }
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
        .classed('invisible', !this.userState.get('showNodeLabels'))
        .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12)
        .attr('stroke', (d3Node: D3Node) => getColorFor.bind(this)(d3Node))
        .attr('text-anchor', 'middle')
        .text((d3Node: D3Node) => d3Node.name);

      this.nodes = nodeEnter.merge(this.nodes);

      this.d3Svg.on('mouseup', mouseUpOnCanvas(this));

      const linkType = this.userState.get('linkType');

      // Need to make this a hashset for node lookup.
      const graphedLinks = this.allLinks.filter((link: Link) => {
        return !link.hidden
          && this.currentlyGraphedNodes.includes(link.source as D3Node)
          && this.currentlyGraphedNodes.includes(link.target as D3Node);
      });

      setDepths(this, graphedLinks);

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
        .attr('class', 'circle')
        .classed('invisible', !this.userState.get('isEditing'))
        .attr('r', 10);

      addAppropriateMouseActionsToLinks.bind(this)(linkEnter);

      linkEnter.append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'link-name')
        .classed('invisible', !this.userState.get('showLinkLabels'))
        .text((link: Link) => link.association);

      this.links = linkEnter.merge(this.links);

      if (this.userState.get('linkType') === 'line') {
        this.addArrows();
        this.links.attr('marker-end', 'url(#relation)');
      }

      this.gravityPoints = this.gravityPointsG.selectAll('.gravity-point-group')
        .data([], (gravityPoint: GravityPoint) => gravityPoint.name);

      this.gravityPoints.exit().remove();

      if (this.userState.get('gravityPoints').size) {
        const gravityPointsArray = this.userState.get('gravityPoints').valueSeq().toJS();

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
        if (!this.userState.get('isEditing')) {
          this.stateService.userState.setSimulating(true);
          this.simulation.alpha(0.5).alphaTarget(this.userState.get('alphaTarget')).restart();
          this.simulation.nodes(this.currentlyGraphedNodes);
          (this.simulation.force('link') as ForceLink<any, any>).links(graphedLinks)
            .distance(this.userState.get('forceLinkDistance') * this.userState.get('scale'))
            .strength(this.userState.get('forceLinkStrength'));
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

    if (this.userState.get('linkType') === 'line') {
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
    if (this.userState.get('linkType') === 'line') {
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

  addArrows () {
    this.arrows.selectAll('marker')
      .data(() => ['relation'])
    .enter()
    .append('marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 50)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
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
      if (this.userState.get('renderOnEveryTick') || this.isDragging) {
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
    this.stateService.twiglet.updateNodeViewInfo(this.allNodes);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;
    this.ngZone.runOutsideAngular(() => {
      const mg = <MultipleGravities>this.simulation.force('multipleGravities');
      if (mg.centerX) {
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
