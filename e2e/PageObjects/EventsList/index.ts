import { browser, by, element, ElementFinder } from 'protractor';

const ownTag = '//app-events-list';

export class EventsList {

  get eventCount() {
    return browser.findElements(by.xpath(`${ownTag}//div[contains(@class, 'event-item')]`)).then(elements =>
      elements.length
    );
  }

  private getParentOfEventGroup(eventName): ElementFinder {
    return element(
      by.xpath(`//h4[text()="${eventName}"]/parent::*`));
  }

  startDeleteEventProcess(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    parent.element(by.css('i.fa-trash')).click();
  }

  previewEvent(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    parent.element(by.css('i.fa-eye')).click();
  }

  toggleEventCheck(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    browser.driver.actions().mouseMove(parent.element(by.css('label'))).click().perform();
  }

  checkedEvent(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    return parent.element(by.css('input.event-checkbox')).isSelected();
  }

  checkIfDeleteEnabled(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    return parent.element(by.css('i.fa-trash.grey'));
  }
}
