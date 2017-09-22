import { TwigletGraphComponent } from './twiglet-graph.component';
import { scaleNodes } from './locationHelpers';
import { Map } from 'immutable';
import VIEW from '../../../non-angular/services-helpers/twiglet/constants/view';
import VIEW_DATA from '../../../non-angular/services-helpers/twiglet/constants/view/data';
import { D3Node } from '../../../non-angular/interfaces';


export function handleViewDataChanges(this: TwigletGraphComponent, response: Map<string, any>) {
  this.ngZone.runOutsideAngular(() => {
    const oldViewData = this.viewData;
    this.viewData = response.get(VIEW.DATA);
    if (this.nodes) {
      const needToUpdateD3 = {};
      if (oldViewData.get(VIEW_DATA.TREE_MODE) !== this.userState.get(VIEW_DATA.TREE_MODE)) {
        needToUpdateD3[VIEW_DATA.TREE_MODE] = true;
      }
      if (oldViewData.get(VIEW_DATA.ALPHA_TARGET) !== this.userState.get(VIEW_DATA.ALPHA_TARGET)) {
        this.simulation.alphaTarget(this.userState.get(VIEW_DATA.ALPHA_TARGET));
        needToUpdateD3[VIEW_DATA.ALPHA_TARGET] = true;
      }
      if (oldViewData.get(VIEW_DATA.SEPARATION_DISTANCE) !== this.userState.get(VIEW_DATA.SEPARATION_DISTANCE)) {
        needToUpdateD3[VIEW_DATA.SEPARATION_DISTANCE] = true;
      }
      if (oldViewData.get(VIEW_DATA.RUN_SIMULATION) !== this.userState.get(VIEW_DATA.RUN_SIMULATION)) {
        if (this.userState.get(VIEW_DATA.RUN_SIMULATION)) {
          needToUpdateD3[VIEW_DATA.RUN_SIMULATION] = true;
        } else {
          this.stateService.userState.setSimulating(false);
          this.simulation.stop();
        }
      }
      if (oldViewData.get(VIEW_DATA.SHOW_NODE_LABELS) !== this.userState.get(VIEW_DATA.SHOW_NODE_LABELS)) {
        this.d3.selectAll('.node-name').classed('invisible', !this.userState.get(VIEW_DATA.SHOW_NODE_LABELS));
      }
      if (oldViewData.get(VIEW_DATA.SHOW_LINK_LABELS) !== this.userState.get(VIEW_DATA.SHOW_LINK_LABELS)) {
        this.d3.selectAll('.link-name').classed('invisible', !this.userState.get(VIEW_DATA.SHOW_LINK_LABELS));
      }
      if (oldViewData.get(VIEW_DATA.LINK_TYPE) !== this.userState.get(VIEW_DATA.LINK_TYPE)) {
        this.linksG.selectAll('.link-group').remove();
        this.restart();
        this.updateLinkLocation();
        if (this.userState.get(VIEW_DATA.LINK_TYPE) === 'line') {
          this.links.attr('marker-end', 'url(#relation)');
        } else {
          this.links.attr('marker-end', null);
        }
      }
      if (oldViewData.get(VIEW_DATA.SCALE) !== this.userState.get(VIEW_DATA.SCALE)
          || oldViewData.get(VIEW_DATA.AUTO_CONNECTIVITY) !== this.userState.get(VIEW_DATA.AUTO_CONNECTIVITY)) {
        scaleNodes.bind(this)(this.allNodes);
        this.nodes
        .select('text.node-image')
          .attr('font-size', (d3Node: D3Node) => `${d3Node.radius}px`);
        this.nodes
        .select('text.node-name')
          .attr('dy', (d3Node: D3Node) => d3Node.radius / 2 + 12);
        needToUpdateD3[VIEW_DATA.SCALE] = true;
      }
      if (oldViewData.get(VIEW_DATA.FORCE_CHARGE_STRENGTH) !== this.userState.get(VIEW_DATA.FORCE_CHARGE_STRENGTH)
        || oldViewData.get(VIEW_DATA.FORCE_GRAVITY_X) !== this.userState.get(VIEW_DATA.FORCE_GRAVITY_X)
        || oldViewData.get(VIEW_DATA.FORCE_GRAVITY_Y) !== this.userState.get(VIEW_DATA.FORCE_GRAVITY_Y)
        || oldViewData.get(VIEW_DATA.FORCE_LINK_DISTANCE) !== this.userState.get(VIEW_DATA.FORCE_LINK_DISTANCE)
        || oldViewData.get(VIEW_DATA.FORCE_LINK_STRENGTH) !== this.userState.get(VIEW_DATA.FORCE_LINK_STRENGTH)
        || oldViewData.get(VIEW_DATA.FORCE_VELOCITY_DECAY) !== this.userState.get(VIEW_DATA.FORCE_VELOCITY_DECAY)) {
        needToUpdateD3['force'] = true;
      }
      if (oldViewData.get(VIEW_DATA.GRAVITY_POINTS) !== this.userState.get(VIEW_DATA.GRAVITY_POINTS)) {
        needToUpdateD3[VIEW_DATA.GRAVITY_POINTS] = true;
      }
      if (Reflect.ownKeys(needToUpdateD3).length) {
        this.updateSimulation();
      }
    }
  });
}
