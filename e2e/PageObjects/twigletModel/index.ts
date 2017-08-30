import { browser, by, element } from 'protractor';

const ownTag = '//app-twiglet-model-view//';

export class TwigletModel {
  get isOpen() {
    return browser.isElementPresent(element(by.css('app-twiglet-model-view')));
  }

  get removeButtonCount() {
    return browser.findElements(by.css('.fa-trash')).then(elements => elements.length);
  }

  get entityCount() {
    return browser.findElements(by.xpath(`${ownTag}div[contains(@class, 'entity-row')]`)).then(elements => elements.length);
  }
}
