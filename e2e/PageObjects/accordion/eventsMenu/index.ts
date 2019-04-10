import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

import { Accordion } from './../';

const tabPath = `//app-twiglet-events`;
export class EventsMenu {
  private accordion: Accordion;

  constructor(accordion) {
    this.accordion = accordion;
  }

  get sequenceCount() {
    return browser.findElements(by.css('li.sequence-list-item')).then(elements => elements.length);
  }

  get eventCount() {
    return browser.findElements(by.css('li.event-list-item')).then(elements => elements.length);
  }

  /**
   * Gets the parent div of a label, used to quickly navigate around .form-groups
   *
   * @private
   * @param {any} labelText the text of the label
   * @returns {ElementFinder}
   *
   * @memberOf EventsMenu
   */
  private getParentOfSequenceGroup(sequenceName): ElementFinder {
    return element(
      by.xpath(`//app-sequence-list//li[contains(@class, 'sequence-list-item')]/span[text()="${sequenceName}"]/parent::*`));
  }

  private getParentOfEventGroup(eventName): ElementFinder {
    return element(
      by.xpath(`//app-events-list//li[contains(@class, 'event-list-item')]/label[text()="${eventName}"]/parent::*`));
  }

  startNewEventProcess() {
    this.switchToCorrectMenuIfNeeded();

    // after the package updates,
    // it looks like the issue is that this element is not present
    // until the events button is clicked
    // this is present and a correct selector, but error is element not found
    // const eventButton = element(by.xpath(`//ngb-accordion//button[text=('Events')]`));
    // eventButton.click();

    // this is present and a correct selector, but error is element not found
    const newEventButton = element(by.xpath(`//app-twiglet-events//i[@class="fa fa-plus event"]/parent::*`));

    browser.actions()
      .mouseMove(newEventButton, { x: 5, y: 5 })
      .click()
      .perform();
  }

  startDeleteEventProcess(eventName) {
    this.switchToCorrectMenuIfNeeded();
    const parent = this.getParentOfEventGroup(eventName);
    parent.element(by.css('i.fa-trash')).click();
  }

  previewEvent(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    parent.element(by.css('i.fa-eye')).click();
  }

  toggleEventCheck(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    parent.element(by.tagName('label')).click();
  }

  checkedEvent(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    return parent.element(by.css('input.checkbox-toggle')).isSelected();
  }

  checkIfDeleteEnabled(eventName) {
    const parent = this.getParentOfEventGroup(eventName);
    return parent.element(by.css('i.fa-trash.grey'));
  }

  startNewSequenceProcess() {
    this.switchToCorrectMenuIfNeeded();
    const newSequenceButton = element(by.xpath(`//app-twiglet-events//i[@class="fa fa-plus sequence"]/parent::*`));
    browser.actions()
      .mouseMove(newSequenceButton, { x: 5, y: 5 })
      .click()
      .perform();
  }

  startDeleteSequenceProcess(sequenceName) {
    this.switchToCorrectMenuIfNeeded();
    const parent = this.getParentOfSequenceGroup(sequenceName);
    parent.element(by.css('i.fa-trash')).click();
  }

  startSaveSequenceProcess(sequenceName) {
    this.switchToCorrectMenuIfNeeded();
    const parent = this.getParentOfSequenceGroup(sequenceName);
    parent.element(by.css('i.fa-floppy-o')).click();
  }

  startViewSequenceProcess(sequenceName) {
    const sequenceButton = element(by.xpath(`//app-sequence-list//li//span[text()='${sequenceName}']`));
    sequenceButton.click();
  }

  startSequencePlay() {
    this.switchToCorrectMenuIfNeeded();
    element(by.css('i.fa-play')).click();
  }

  stopSequencePlay() {
    element(by.css('i.fa-stop')).click();
  }

  waitForPlayback() {
    const playButton = element(by.css('i.fa-play'));
    const EC = ExpectedConditions;
    browser.wait(EC.visibilityOf(playButton), 10000);
  }

  editPlaybackInterval(number) {
    element(by.css('.form-control')).clear();
    element(by.css('.form-control')).sendKeys(number);
  }

  private switchToCorrectMenuIfNeeded() {
    return this.accordion.activeMenu.then(activeTabText => {
      if (activeTabText !== 'Events') {
        return this.accordion.goToMenu('Events');
      }
    });
  }
}
