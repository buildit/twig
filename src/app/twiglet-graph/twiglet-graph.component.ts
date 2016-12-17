import { Component, ElementRef, OnInit } from '@angular/core';
import { D3Service, D3, Selection, Simulation } from 'd3-ng2-service';
import { List } from 'immutable';
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
    this.currentNodeState = {
      data: null
    };
    this.d3Svg = this.d3.select(this.element.nativeElement).select<SVGSVGElement>('svg');
    this.width = +this.d3Svg.attr('width');
    this.height = +this.d3Svg.attr('height');
    this.force = this.d3.forceSimulation([])
    .force('charge', this.d3.forceManyBody().strength(-1000))
    .force('link', this.d3.forceLink([]).distance(200))
    .alphaTarget(0)
    .on('tick', this.ticked.bind(this));

    this.nodesG = this.d3Svg.append<SVGGElement>('g').attr('class', 'nodes');

    this.formNode = {
      id: 'id',
      name: 'name',
      type: '@',
    };

    this.nodesService.observable.subscribe(nodes => {
      if (nodes === this.currentNodeState.data) {
        this.updateNodeLocation(nodes);
      } else {
        this.updateNodes(nodes);
      }
    });
  }

  updateNodes (nodes: List<D3Node>) {
    this.currentNodes = nodes.reduce((array: D3Node[], node) => {
      if (!node.x) {
        node.x = Math.floor(Math.random() * this.width);
      }
      if (!node.y) {
        node.y = Math.floor(Math.random() * this.height);
      }
      array.push(node);
      return array;
    }, []);

    this.nodesG.selectAll('text').remove();

    this.nodesG.selectAll('text')
      .data(this.currentNodes)
      .enter()
      .append('text')
      .attr('class', 'node-group')
      .attr('transform', (node: D3Node) => `translate(${node.x || 250},${node.y || 250})`)
      .attr('id', (node: D3Node) => `id-${node.id}`)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .text((node: D3Node) => node.type.toString())
      .call(this.d3.drag<SVGTextElement, D3Node>()
        .on('start', dragStarted.bind(this))
        .on('drag', dragged.bind(this))
        .on('end', dragEnded.bind(this)))
      .on('tick', this.ticked.bind(this));



    this.force.nodes(this.currentNodes).alpha(1).alphaTarget(0).restart();

    this.updateNodeLocation(nodes);
  }

  updateNodeLocation (nodes: List<D3Node>) {
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
