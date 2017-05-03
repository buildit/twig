import { browser, by, element, ElementFinder } from 'protractor';

import { EventsTab } from './../header/eventsTab/index';

const ownTag = '//app-events-list';

export class EventsList {
  private eventsTab: EventsTab;

  constructor(eventsTab) {
    this.eventsTab = eventsTab;
  }

  get eventCount() {
    this.eventsTab.switchToCorrectTabIfNeeded();
    return browser.findElements(by.xpath(`${ownTag}//div[contains(@class, 'card')]`)).then(elements =>
      elements.length
    );
  }

  private getParentOfEventGroup(eventName): ElementFinder {
    return element(
      by.xpath(`//div[@class='overflow-scroll']//div[@class='card']//div[@class='card-block']//h4[text()="${eventName}"]/parent::*`));
  }

  startDeleteEventProcess(eventName) {
    this.eventsTab.switchToCorrectTabIfNeeded();
    const parent = this.getParentOfEventGroup(eventName);
    parent.element(by.css('i.fa-trash')).click();
  }

  previewEvent(eventName) {
    this.eventsTab.switchToCorrectTabIfNeeded();
    const parent = this.getParentOfEventGroup(eventName);
    browser.actions().mouseMove(element(by.css('i.fa-eye')).find()).perform();
  }

  toggleEventCheck(eventName) {
    this.eventsTab.switchToCorrectTabIfNeeded();
    const parent = this.getParentOfEventGroup(eventName);
    parent.element(by.css('input.custom-control-input')).click();
  }
}
