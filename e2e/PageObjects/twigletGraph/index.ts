import { browser, element, by } from 'protractor';
export class TwigletGraph {

  get nodeCount() {
    return browser.findElements(by.css('g.node-group')).then(elements => elements.length);
  }

  get linkCount() {
    return browser.findElements(by.css('g.link-group')).then(elements => elements.length);
  }

  createLink(node1Name, node2Name) {
    const node1 = this.getNodeGroup(node1Name);
    const node2 = this.getNodeGroup(node2Name);
    browser.driver.actions().mouseDown(node1).mouseMove(node2).mouseUp(node2).perform()
  }

  private getNodeGroup(name) {
    return element(
      by.xpath(`//app-twiglet-graph/*[name()='svg']//*[name()="text" and contains(@class, "node-name") and text()="${name}"]/..`));
  }
}
