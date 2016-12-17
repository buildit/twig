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

  private force: Simulation<any, undefined>; //tslint:disable-line
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>; //tslint:disable-line
  private nodesG: Selection<SVGGElement, any, null, undefined>; //tslint:disable-line
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
    .on('tick', this.ticked.bind(this));

    this.nodesG = this.d3Svg.append<SVGGElement>('g').attr('class', 'nodes');

    this.currentNodeState = {
      data: null
    };

    this.formNode = {
      id: 'id',
      name: 'name',
      type: '@',
    };

    this.nodesService.observable.subscribe(response => {
      // Just add the node to our array and update d3
      if (response.action === 'initial') {
        this.currentNodes = this.mapImmutableMapToArrayOfNodes(response.data);
      } else if (response.action === 'addNode') {
        response.payload.forEach(node => this.currentNodes.push(node));
        console.log(this.currentNodes);
        this.addNodes();
      } else if (response.action === 'updateNode') {
        // This means the update was caused by d3 and that only updates the x and y, so only
        // the node locations need to be updated.  Otherwise, the only other paramaters that d3
        // needs to know about is the type and the name of the node.
        if (response.data === this.currentNodeState.data) {
          this.updateNodeLocation(this.mapImmutableMapToArrayOfNodes(response.data));
        } else {
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
      } else if (response.action === 'removeNode') {
        const indexes = [];
        const nodesToDelete = response.data as OrderedMap<string, Map<string, any>>;
        // Take the nodes out of currentNodes
        for (let i = this.currentNodes.length - 1; i >= 0; i--) {
          if (nodesToDelete.has(this.currentNodes[i].id)) {
            this.currentNodes.splice(i, 1);
          }
        }
        this.removeNodes();
      }
    });
  }

  mapImmutableMapToArrayOfNodes(nodesMap: OrderedMap<string, Map<string, any>>) {
    return nodesMap.reduce((array: D3Node[], node) => {
      array.push(node);
      return array;
    }, []);
  }

  addNodes () {
    console.log('nodes?', this.currentNodes);
    const g = this.nodesG
      .data(this.currentNodes)
      .enter()
      .append('g')
      .attr('id', (node: D3Node) => `id-${node.id}`)
      .attr('class', 'node-group')
      .attr('transform', (node: D3Node) => `translate(${node.x || 250},${node.y || 250})`)
      .call(this.d3.drag<SVGTextElement, D3Node>()
        .on('start', dragStarted.bind(this))
        .on('drag', dragged.bind(this))
        .on('end', dragEnded.bind(this)))
      .on('tick', this.ticked.bind(this));

      g.append('text')
      .attr('class', 'node-text')
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .text((node: D3Node) => this.getNodeImage(node));

      g.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .text((node: D3Node) => node.name);

    this.force.nodes(this.currentNodes).alpha(1).alphaTarget(0).restart();

    this.updateNodeLocation(this.currentNodes);
  }

  removeNodes () {
    this.nodesG.selectAll('g')
    .data(this.currentNodes, (d3Node: D3Node) => d3Node.id)
    .exit()
    .remove();
  }

  getNodeImage (node: D3Node): string {
    return node.type.toString();
  }

  updateNodeLocation (nodes: D3Node[]) {
    nodes.forEach(node => {
      this.d3.select(`#id-${node.id}`)
      .attr('transform', `translate(${node.x},${node.y})`);
    });
  }

  addNode () {
    this.nodesService.addNode(clone(this.formNode));
  }

  ticked() {
    this.currentNodes.forEach(keepNodeInBounds.bind(this));
    this.nodesService.bulkReplaceNodes(this.currentNodes, this.currentNodeState);
  }
}
