import { browser, element, by, ElementFinder } from 'protractor';
import { Entity } from './Entity';
const ownTag = 'app-model-view';


export class ModelInfo {

  get entityCount() {
    return browser.findElements(by.xpath(`//${ownTag}//div[contains(@class, 'entity-row')]`)).then(elements =>
      // Account for the header row.
      elements.length - 1
    );
  }

  getNthType(rowNumber) {
    const self = element(by.css(ownTag));
    const row = self.element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]`));
    return new Entity(row).type;
  }

  getNthColor(rowNumber) {
    const self = element(by.css(ownTag));
    const row = self.element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]`));
    return new Entity(row).color;
  }

  getNthSize(rowNumber) {
    const self = element(by.css(ownTag));
    const row = self.element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]`));
    return new Entity(row).size;
  }

  getNthIcon(rowNumber) {
    const self = element(by.css(ownTag));
    const row = self.element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]`));
    return new Entity(row).icon;
  }
}
