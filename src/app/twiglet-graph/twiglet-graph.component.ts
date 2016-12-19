import { Component, ChangeDetectionStrategy, ElementRef, OnInit } from '@angular/core';
import { D3Service, D3, Selection, Simulation } from 'd3-ng2-service';
import { Map, OrderedMap } from 'immutable';
import { clone, merge } from 'ramda';

// State related
import { StateService } from '../state.service';
import { StateCatcher } from '../services-helpers';
import { NodesService } from '../services-helpers';

// Interfaces
import { D3Node } from '../interfaces';

// Event Handlers
import { dragStarted, dragged, dragEnded } from './twiglet-graph.inputHandlers';

// helpers
import { keepNodeInBounds } from './twiglet-graph.locationHelpers';
import { handleNodeMutations } from './handleNodeMutations';
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
  private element: ElementRef;
  /**
   * The d3 service
   */
  private d3: D3;
  /**
   * The state service from ./state.service
   */
  private state: StateService;
  /**
   * The force simulation that is moving the nodes and links around.
   */
  private force: Simulation<any, undefined>;
  /**
   * The svg that is part of the twiglet-graph.component.html.
   */
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  /**
   * The actual <g> elements that represent all of the nodes in this.currentNodes
   */
  private nodes: any;
  /**
   * The width of the svg element.
   */
  private width: number;
  /**
   * The height of the svg element.
   */
  private height: number;
  /**
   * An array that contains the same nodes (references) as this.currentNodesObject for feeding
   * to the force graph.
   */
  private currentNodes: D3Node[];
  /**
   * An object representing the same nodes (reference) as this.currentNodes so that no scanning
   * has to be done whenever a link is being added.
   */
  private currentNodesObject: any;
  /**
   * Since d3 makes changes to our nodes independent from the rest of angular, it should not be
   * making changes then reacting to it's own changes. This allows us to capture the state
   * before it is broadcast so comparisons can be made and this component does not double react
   * to everything it fires off. This shouldn't be added to any other component.
   */
  private currentNodeState: StateCatcher;
  /**
   * The distance from the border that the nodes are limited to.
   */
  private margin: number = 20;
  /**
   * The injected service from ./state.service
   */
  private nodesService: NodesService;

  constructor(element: ElementRef, d3Service: D3Service, state: StateService) {
    this.d3 = d3Service.getD3();
    this.element = element;
    this.nodesService = state.twiglet.nodes;
  }

  /**
   * Initializes the component once the component is mounted.
   * @memberOf TwigletGraphComponent
   */
  ngOnInit() {
    this.d3Svg = this.d3.select(this.element.nativeElement).select<SVGSVGElement>('svg');
    this.width = +this.d3Svg.attr('width');
    this.height = +this.d3Svg.attr('height');
    this.force = this.d3.forceSimulation([])
    .force('charge', this.d3.forceManyBody().strength(-1000))
    .force('link', this.d3.forceLink([]).distance(200))
    .force('collide', this.d3.forceCollide().radius(
      (d3Node: D3Node) => { return getRadius(d3Node) + 0.5; }).iterations(2))
    .alphaTarget(0)
    .on('tick', this.ticked.bind(this))
    .on('end', this.publishNewCoordinates.bind(this));

    this.nodes = this.d3Svg.append<SVGGElement>('g').attr('stroke', '#FFF').selectAll('.node');

    this.currentNodeState = {
      data: null
    };

    this.nodesService.observable.subscribe(handleNodeMutations.bind(this));
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
    this.currentNodes.forEach(keepNodeInBounds.bind(this));
    /**
     * select all of the nodes currently on our svg. Need to call this every time to
     * account for nodes added by enter()/exit() on the last call to restart.
     */
    this.nodes = this.d3Svg.selectAll('.node-group').data(this.currentNodes, (d: D3Node) => d.id);

    /**
     * Enter affects all of the nodes in our array (this.currentNodes) that do not already
     * have an existing <g> on the svg. This sets up all of the new elements
     */
    const enter = this.nodes
                .enter()
                .append('g')
                .attr('class', 'node-group')
                .attr('id', d3Node => d3Node.id)
                .attr('transform', d3Node => `translate(${d3Node.x},${d3Node.y})`)
                .attr('id', d3Node => `id-${d3Node.id}`)
                .attr('fill', 'white')
                .on('dblclick', (node: D3Node) => alert(node.id))
                .call(this.d3.drag()
                  .on('start', dragStarted.bind(this))
                  .on('drag', dragged.bind(this))
                  .on('end', dragEnded.bind(this)));

    enter.append('text')
      .attr('class', 'node-image')
      .attr('y', 0)
      .attr('font-size', d3Node => `${getRadius(d3Node)}px`)
      .attr('stroke', d3Node => colorFor(d3Node))
      .attr('text-anchor', 'middle')
      .text(d3Node => getNodeImage(d3Node));

    enter.append('text')
      .attr('class', 'node-name')
      .attr('y', 10)
      .attr('font-size', '15px')
      .attr('stroke', d3Node => colorFor(d3Node))
      .attr('text-anchor', 'middle')
      .text(node => node.name);

    /**
     * exit affects all of the elements on the svg that do not have a corresponding node in
     * this.currentNodes anymore. Remove them from the screen.
     */
    this.nodes.exit().remove();

    /**
     * Restart the simulation so that nodes can reposition themselves.
     */
    this.force.nodes(this.currentNodes).alpha(alpha).alphaTarget(0).restart();
  }

  updateNodeLocation (nodes: D3Node[]) {
    nodes.forEach(node => {
      this.d3.select(`#id-${node.id}`).attr('transform', `translate(${node.x},${node.y})`);
    });
  }

  ticked() {
    this.currentNodes.forEach(keepNodeInBounds.bind(this));
    this.updateNodeLocation(this.currentNodes);
  }

  publishNewCoordinates() {
    this.nodesService.updateNodes(this.currentNodes, this.currentNodeState);
  }
}
