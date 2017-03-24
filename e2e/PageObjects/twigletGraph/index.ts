import { browser, element, by } from 'protractor';
const self = element(by.css('app-twiglet-graph'));
export class TwigletGraph {

  get nodeCount() {
    return self.findElements(by.css('g.node-group')).then(elements => {
      return elements.length;
    });
  }

  createLink(node1Name, node2Name) {
    const node1 = this.getNodeGroup(node1Name);
    const node2 = this.getNodeGroup(node2Name);
    browser.actions().dragAndDrop(node1, node2).perform();
  }

  private getNodeGroup(name) {
    return element(by.xpath(`//app-twiglet-graph/*[name()='svg']//*[name()="text" and @class="node-name" and text()="${name}"]/..`));
  }
}
