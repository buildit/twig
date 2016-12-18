import { Component, ChangeDetectionStrategy, ElementRef, OnInit } from '@angular/core';
import { D3Service, D3, Selection, Simulation } from 'd3-ng2-service';
import { Map, OrderedMap } from 'immutable';
import { clone, merge } from 'ramda';
import { UUID } from 'angular2-uuid';

// State related
import { StateService } from '../state.service';
import { StateCatcher } from '../services-helpers';
import { NodesService } from '../services-helpers';

// Interfaces
import { D3Node } from '../interfaces';

// Event Handlers
import { dragStarted, dragged, dragEnded } from './twiglet-graph.dragHandlers';

// helpers
import { keepNodeInBounds } from './twiglet-graph.locationHelpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [D3Service],
  selector: 'app-twiglet-graph',
  styleUrls: ['./twiglet-graph.component.css'],
  templateUrl: './twiglet-graph.component.html',

})
export class TwigletGraphComponent implements OnInit {
  private element: ElementRef;
  private d3: D3;
  private d3Service: D3Service;
  private state: StateService;

  private force: Simulation<any, undefined>;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private g: Selection<SVGGElement, any, null, undefined>;
  private node: any;
  private width: number;
  private height: number;
  private currentNodes: D3Node[];
  private currentNodeState: StateCatcher;
  private margin: number = 20;

  nodesService: NodesService;
  formNode: D3Node;

  constructor(element: ElementRef, d3Service: D3Service, state: StateService) {
    this.d3 = d3Service.getD3();
    this.d3Service = d3Service;
    this.element = element;
    this.nodesService = state.twiglet.nodes;
  }

  ngOnInit() {
    this.d3Svg = this.d3.select(this.element.nativeElement).select<SVGSVGElement>('svg');
    this.width = +this.d3Svg.attr('width');
    this.height = +this.d3Svg.attr('height');
    this.force = this.d3.forceSimulation([])
    .force('charge', this.d3.forceManyBody().strength(-1000))
    .force('link', this.d3.forceLink([]).distance(200))
    .alphaTarget(0)
    .on('tick', this.ticked.bind(this))
    .on('end', this.publishNewCoordinates.bind(this));

    this.g = this.d3Svg.append<SVGGElement>('g');
    this.node = this.g.append('g').attr('stroke', '#FFF').selectAll('.node');

    this.currentNodeState = {
      data: null
    };

    this.formNode = {
      id: UUID.UUID(),
      name: (Math.random().toString(36) + '00000000000000000').slice(2, 6),
      type: (Math.random().toString(36) + '00000000000000000').slice(2, 3),
    };

    this.nodesService.observable.subscribe(response => {
      // Just add the node to our array and update d3
      if (response.action === 'initial') {
        this.currentNodes = this.mapImmutableMapToArrayOfNodes(response.data);
      } else if (response.action === 'addNodes') {
        // Most performant way to clear the array without losing the reference and making
        // d3 do a lot of extra work.
        this.currentNodes.length = 0;
        this.mapImmutableMapToArrayOfNodes(response.data).forEach(node =>
          this.currentNodes.push(node)
        );
        this.restart();
      } else if (response.action === 'updateNodes') {
        // This means the update was caused by d3 and that only updates the x and y, so only
        // the node locations need to be updated.  Otherwise, the only other paramaters that d3
        // needs to know about is the type and the name of the node.
        if (response.data !== this.currentNodeState.data) {
          this.currentNodes.forEach(node => {
            const nodesToUpdate = response.data as OrderedMap<string, Map<string, any>>;
            if (nodesToUpdate.has(node.id)) {
              const group = this.d3.select(`#id-${node.id}`);
              // I believe it is faster to just reassign than to check and then assign?
              group.select('.image').text(nodesToUpdate.get('id').get('type'));
              group.select('.name').text(nodesToUpdate.get('id').get('name'));
            }
          });
        }
      } else if (response.action === 'removeNodes') {
        this.currentNodes.length = 0;
        this.mapImmutableMapToArrayOfNodes(response.data).forEach(node =>
          this.currentNodes.push(node)
        );
        this.restart();
      }
    });
  }

  mapImmutableMapToArrayOfNodes(nodesMap: OrderedMap<string, Map<string, any>>) {
    return nodesMap.reduce((array: D3Node[], node: Map<string, any>) => {
      array.push(node.toJS());
      return array;
    }, []);
  }

  restart (alpha = 1) {
    this.currentNodes.forEach(keepNodeInBounds.bind(this));
    this.node = this.g.selectAll('.node').data(this.currentNodes, (d: D3Node) => d.id);
    const enter = this.node
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('id', d3Node => d3Node.id)
                .attr('transform', d3Node => `translate(${d3Node.x},${d3Node.y})`)
                .attr('id', d3Node => `id-${d3Node.id}`)
                .attr('fill', 'white')
                .call(this.d3.drag()
                  .on('start', dragStarted.bind(this))
                  .on('drag', dragged.bind(this))
                  .on('end', dragEnded.bind(this)));

    enter.append('text')
      .attr('class', 'node-image')
      .attr('y', 0)
      .attr('font-size', d3Node => `${this.getRadius(d3Node)}px`)
      .attr('stroke', d3Node => this.colorFor(d3Node))
      .attr('text-anchor', 'middle')
      .text(d3Node => this.getNodeImage(d3Node));

    enter.append('text')
      .attr('class', 'node-name')
      .attr('y', 10)
      .attr('font-size', '15px')
      .attr('stroke', d3Node => this.colorFor(d3Node))
      .attr('text-anchor', 'middle')
      .text(node => node.name);

    this.node.exit().remove();

    this.force.nodes(this.currentNodes).alpha(alpha).alphaTarget(0).restart();
  }

  getNodeImage (node: D3Node): string {
    return node.type.toString();
  }

  colorFor (node: D3Node): string {
    return '#000000';
  }

  getRadius (node: D3Node): number {
    return 35;
  }

  updateNodeLocation (nodes: D3Node[]) {
    nodes.forEach(node => {
      this.d3.select(`#id-${node.id}`).attr('transform', `translate(${node.x},${node.y})`);
    });
  }

  addNode () {
    this.nodesService.addNode(clone(this.formNode));
    this.formNode = {
      id: UUID.UUID(),
      name: (Math.random().toString(36) + '00000000000000000').slice(2, 6),
      type: (Math.random().toString(36) + '00000000000000000').slice(2, 3),
    };
  }

  removeNode (node: D3Node) {
    this.nodesService.removeNode(node);
  }

  ticked() {
    this.currentNodes.forEach(keepNodeInBounds.bind(this));
    this.updateNodeLocation(this.currentNodes);
  }

  publishNewCoordinates() {
    this.nodesService.updateNodes(this.currentNodes, this.currentNodeState);
  }
}
