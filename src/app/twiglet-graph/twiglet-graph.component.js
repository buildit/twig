"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var d3_ng2_service_1 = require("d3-ng2-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var state_service_1 = require("../state.service");
var interfaces_1 = require("../../non-angular/interfaces");
var inputHandlers_1 = require("./inputHandlers");
var handleUserStateChanges_1 = require("./handleUserStateChanges");
var locationHelpers_1 = require("./locationHelpers");
var handleGraphMutations_1 = require("./handleGraphMutations");
var nodeAttributesToDOMAttributes_1 = require("./nodeAttributesToDOMAttributes");
var TwigletGraphComponent = (function () {
    function TwigletGraphComponent(element, d3Service, stateService, modalService, route) {
        this.element = element;
        this.stateService = stateService;
        this.modalService = modalService;
        this.route = route;
        this.width = 800;
        this.height = 500;
        this.margin = 20;
        this.userState = {};
        this.linkSourceMap = {};
        this.linkTargetMap = {};
        this.allNodes = [];
        this.allLinks = [];
        this.currentTwigletState = {
            data: null
        };
        this.d3 = d3Service.getD3();
    }
    TwigletGraphComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.d3Svg = this.d3.select(this.element.nativeElement).select('svg');
        this.nodesG = this.d3Svg.select('#nodesG');
        this.linksG = this.d3Svg.select('#linksG');
        this.nodes = this.nodesG.selectAll('.node-group');
        this.links = this.linksG.selectAll('.link-group');
        this.d3Svg.on('mousemove', inputHandlers_1.mouseMoveOnCanvas(this));
        this.simulation = this.d3.forceSimulation([])
            .on('tick', this.ticked.bind(this))
            .on('end', this.publishNewCoordinates.bind(this));
        this.updateSimulation();
        this.userStateSubscription = this.stateService.userState.observable.subscribe(handleUserStateChanges_1.handleUserStateChanges.bind(this));
        this.modelServiceSubscription = this.stateService.twiglet.modelService.observable.subscribe(function (response) {
            var entities = response.get('entities').reduce(function (object, value, key) {
                object[key] = value.toJS();
                return object;
            }, {});
            _this.model = {
                entities: entities,
            };
        });
        this.twigletServiceSubscription = this.stateService.twiglet.observable.subscribe(function (response) {
            handleGraphMutations_1.handleGraphMutations.bind(_this)(response);
        });
        this.routeSubscription = this.route.params.subscribe(function (params) {
            _this.stateService.twiglet.loadTwiglet(params['id']);
        });
    };
    TwigletGraphComponent.prototype.ngOnDestroy = function () {
        this.userStateSubscription.unsubscribe();
        this.modelServiceSubscription.unsubscribe();
        this.twigletServiceSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    };
    TwigletGraphComponent.prototype.updateSimulation = function () {
        this.simulation
            .force('x', this.d3.forceX(this.width / 2).strength(this.userState.forceGravityX))
            .force('y', this.d3.forceY(this.height / 2).strength(this.userState.forceGravityY))
            .force('link', (this.simulation.force('link') || this.d3.forceLink())
            .distance(this.userState.forceLinkDistance * this.userState.scale)
            .strength(this.userState.forceLinkStrength))
            .force('charge', this.d3.forceManyBody().strength(this.userState.forceChargeStrength * this.userState.scale))
            .force('collide', this.d3.forceCollide().radius(function (d3Node) { return d3Node.radius + 15; }).iterations(16));
        this.restart();
        if (this.simulation.alpha() < 0.5) {
            this.simulation.alpha(0.5).restart();
        }
    };
    TwigletGraphComponent.prototype.ngAfterContentInit = function () {
        this.onResize();
    };
    TwigletGraphComponent.prototype.restart = function () {
        var _this = this;
        if (this.d3Svg) {
            if (this.simulation.alpha() < 0.5) {
                this.simulation.alpha(0.5).restart();
            }
            this.d3Svg.on('mouseup', null);
            this.allNodes.forEach(locationHelpers_1.keepNodeInBounds.bind(this));
            this.stateService.twiglet.updateNodes(this.allNodes, this.currentTwigletState);
            this.currentlyGraphedNodes = this.allNodes.filter(function (d3Node) {
                return !d3Node.hidden;
            });
            this.nodes = this.nodesG.selectAll('.node-group').data(this.currentlyGraphedNodes, function (d) { return d.id; });
            this.nodes.exit().remove();
            var nodeEnter = this.nodes
                .enter()
                .append('g')
                .attr('id', function (d3Node) { return "id-" + d3Node.id; })
                .attr('class', 'node-group')
                .attr('transform', function (d3Node) { return "translate(" + d3Node.x + "," + d3Node.y + ")"; })
                .attr('fill', 'white')
                .on('click', function (d3Node) { return _this.stateService.userState.setCurrentNode(d3Node.id); });
            handleUserStateChanges_1.addAppropriateMouseActionsToNodes.bind(this)(nodeEnter);
            this.simulation.alpha(0.9);
            nodeEnter.append('text')
                .attr('class', 'node-image')
                .attr('y', 0)
                .attr('font-size', function (d3Node) { return nodeAttributesToDOMAttributes_1.getRadius.bind(_this)(d3Node) + "px"; })
                .attr('stroke', function (d3Node) { return nodeAttributesToDOMAttributes_1.getColorFor.bind(_this)(d3Node); })
                .attr('fill', function (d3Node) { return nodeAttributesToDOMAttributes_1.getColorFor.bind(_this)(d3Node); })
                .attr('text-anchor', 'middle')
                .text(function (d3Node) { return nodeAttributesToDOMAttributes_1.getNodeImage.bind(_this)(d3Node); });
            nodeEnter.append('text')
                .attr('class', 'node-name')
                .classed('invisible', !this.userState.showNodeLabels)
                .attr('dy', function (d3Node) { return d3Node.radius / 2 + 12; })
                .attr('stroke', function (d3Node) { return nodeAttributesToDOMAttributes_1.getColorFor.bind(_this)(d3Node); })
                .attr('text-anchor', 'middle')
                .text(function (d3Node) { return d3Node.name; });
            this.nodes = nodeEnter.merge(this.nodes);
            this.d3Svg.on('mouseup', inputHandlers_1.mouseUpOnCanvas(this));
            var linkType = this.userState.linkType;
            var graphedLinks = this.allLinks.filter(function (link) {
                return !link.hidden;
            });
            this.links = this.linksG.selectAll('.link-group').data(graphedLinks, function (l) { return l.id; });
            this.links.exit().remove();
            var linkEnter = this.links
                .enter()
                .append('g')
                .attr('id', function (link) { return "id-" + link.id; })
                .attr('class', 'link-group');
            linkEnter.append(linkType)
                .attr('class', 'link');
            linkEnter.append('circle')
                .attr('class', 'circle')
                .classed('invisible', !this.userState.isEditing)
                .attr('r', 10);
            console.log(this.userState.isEditing);
            linkEnter.append('text')
                .attr('text-anchor', 'middle')
                .attr('class', 'link-name')
                .classed('invisible', !this.userState.showLinkLabels)
                .text(function (link) { return link.association; });
            this.links = linkEnter.merge(this.links);
            this.simulation.nodes(this.currentlyGraphedNodes);
            this.simulation.force('link').links(graphedLinks)
                .distance(this.userState.forceLinkDistance * this.userState.scale)
                .strength(this.userState.forceLinkStrength);
        }
    };
    TwigletGraphComponent.prototype.linkArc = function (link) {
        var _this = this;
        if (interfaces_1.isD3Node(link.target) && interfaces_1.isD3Node(link.source)) {
            var tx = Math.max(link.target.radius, Math.min(this.width - link.target.radius, link.target.x));
            var ty = Math.max(link.target.radius + 25, Math.min(this.height - link.target.radius, link.target.y));
            var sx = Math.max(link.source.radius, Math.min(this.width - link.source.radius, link.source.x));
            var sy = Math.max(link.source.radius + 25, Math.min(this.height - link.source.radius, link.source.y));
            var dx = tx - sx;
            var dy = ty - sy;
            var linksFromSource = this.linkSourceMap[link.source.id];
            var linksFromSourceToTarget = linksFromSource.filter(function (linkId) {
                return _this.allLinksObject[linkId].target === link.target;
            });
            var totalLinkNum = linksFromSourceToTarget.length;
            var dr = Math.sqrt(dx * dx + dy * dy);
            if (totalLinkNum > 1) {
                dr = dr / (1 + (1 / totalLinkNum) * ((linksFromSourceToTarget.indexOf(link.id) + 1) / 2));
            }
            return 'M'
                + (sx + ",")
                + (sy + "A" + dr + ",")
                + (dr + " 0 0,1 ")
                + (tx + "," + ty);
        }
        return '';
    };
    TwigletGraphComponent.prototype.updateNodeLocation = function () {
        this.nodes.attr('transform', function (node) { return "translate(" + node.x + "," + node.y + ")"; });
    };
    TwigletGraphComponent.prototype.updateLinkLocation = function () {
        this.links.select('path')
            .attr('d', this.linkArc.bind(this));
        this.links.select('line')
            .attr('x1', function (link) { return link.source.x; })
            .attr('y1', function (link) { return link.source.y; })
            .attr('x2', function (link) { return link.target.x; })
            .attr('y2', function (link) { return link.target.y; });
        if (this.userState.linkType === 'line') {
            this.links.select('circle')
                .attr('cx', function (link) { return (link.source.x + link.target.x) / 2; })
                .attr('cy', function (link) { return (link.source.y + link.target.y) / 2; });
        }
        this.links.select('text')
            .attr('x', function (link) { return (link.source.x + link.target.x) / 2; })
            .attr('y', function (link) { return (link.source.y + link.target.y) / 2; });
    };
    TwigletGraphComponent.prototype.ticked = function () {
        this.currentlyGraphedNodes.forEach(locationHelpers_1.keepNodeInBounds.bind(this));
        this.updateNodeLocation();
        this.updateLinkLocation();
    };
    TwigletGraphComponent.prototype.publishNewCoordinates = function () {
        console.log('publishNewCoordinates');
        this.stateService.twiglet.updateNodes(this.currentlyGraphedNodes, this.currentTwigletState);
    };
    TwigletGraphComponent.prototype.onResize = function () {
        this.width = this.element.nativeElement.offsetWidth;
        this.height = this.element.nativeElement.offsetHeight;
        this.simulation
            .force('x', this.d3.forceX(this.width / 2).strength(this.userState.forceGravityX))
            .force('y', this.d3.forceY(this.height / 2).strength(this.userState.forceGravityY));
    };
    TwigletGraphComponent.prototype.onMouseUp = function () {
        this.stateService.userState.clearNodeTypeToBeAdded();
    };
    TwigletGraphComponent.prototype.keyboardDown = function (event) {
        if (event.altKey) {
            this.altPressed = true;
        }
    };
    TwigletGraphComponent.prototype.keyboardInput = function (event) {
        this.altPressed = false;
    };
    return TwigletGraphComponent;
}());
__decorate([
    core_1.HostListener('window:resize', []),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TwigletGraphComponent.prototype, "onResize", null);
__decorate([
    core_1.HostListener('document:mouseup', []),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TwigletGraphComponent.prototype, "onMouseUp", null);
__decorate([
    core_1.HostListener('window:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], TwigletGraphComponent.prototype, "keyboardDown", null);
__decorate([
    core_1.HostListener('window:keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], TwigletGraphComponent.prototype, "keyboardInput", null);
TwigletGraphComponent = __decorate([
    core_1.Component({
        providers: [d3_ng2_service_1.D3Service],
        selector: 'app-twiglet-graph',
        styleUrls: ['./twiglet-graph.component.scss'],
        templateUrl: './twiglet-graph.component.html',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        d3_ng2_service_1.D3Service,
        state_service_1.StateService,
        ng_bootstrap_1.NgbModal,
        router_1.ActivatedRoute])
], TwigletGraphComponent);
exports.TwigletGraphComponent = TwigletGraphComponent;
