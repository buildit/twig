import { browser, by, element } from 'protractor';

export class TwigletGraph {

  get nodeCount() {
    return browser.findElements(by.css('g.node-group')).then(elements => elements.length);
  }

  get linkCount() {
    return browser.findElements(by.css('g.link-group')).then(elements => elements.length);
  }

  get gravityPointCount() {
    return browser.findElements(by.css('g.gravity-point-group')).then(elements => elements.length);
  }

  get gravityPointName() {
    return element(by.css('text')).getText();
  }

  createLink(node1Name, node2Name) {
    const node1 = this.getNodeGroup(node1Name);
    const node2 = this.getNodeGroup(node2Name);
    browser.driver.actions().mouseDown(node1).mouseMove(node2).mouseUp(node2).perform();
  }

  checkNodeLabels(nodeName, cls) {
    const nodeElement = this.getNodeLabel(nodeName);
    return nodeElement.getAttribute('class').then(classes => {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  }

  addGravityPoint() {
    element(by.css('app-twiglet-graph')).click();
  }

  openEditGravityModal() {
    element(by.css('g.gravity-point-group')).click();
  }

  private getNodeGroup(name) {
    return element(
      by.xpath(`//app-twiglet-graph/*[name()='svg']//*[name()="text" and contains(@class, "node-name") and text()="${name}"]/..`));
  }

  private getNodeLabel(name) {
    return element(
      by.xpath(`//app-twiglet-graph/*[name()='svg']//*[name()="text" and contains(@class, "node-name") and text()="${name}"]`));
  }
}
