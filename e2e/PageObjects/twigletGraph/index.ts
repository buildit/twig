import { browser, element, by } from 'protractor';
export class TwigletGraph {

  get nodeCount() {
    return browser.findElements(by.css('g.node-group')).then(elements => elements.length);
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
