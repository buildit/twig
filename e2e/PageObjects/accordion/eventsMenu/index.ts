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
      by.xpath(`//span[text()="${sequenceName}"]/parent::*`));
  }

  private getParentOfEventGroup(eventName): ElementFinder {
    return element(
      by.xpath(`//span[text()="${eventName}"]/parent::*`));
  }

  startNewEventProcess() {
    this.switchToCorrectTabIfNeeded();
    element(by.css('.fa-plus.event')).click();
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

  startNewSequenceProcess() {
    this.switchToCorrectTabIfNeeded();
    element(by.css('.fa-plus.sequence')).click();
  }

  startDeleteSequenceProcess(sequenceName) {
    this.switchToCorrectTabIfNeeded();
    const parent = this.getParentOfSequenceGroup(sequenceName);
    parent.element(by.css('i.fa-trash')).click();
  }

  startSaveSequenceProcess(sequenceName) {
    this.switchToCorrectTabIfNeeded();
    const parent = this.getParentOfSequenceGroup(sequenceName);
    parent.element(by.css('i.fa-floppy-o')).click();
  }

  startViewSequenceProcess(sequenceName) {
    const sequenceButton = element(by.xpath(`//app-sequence-list//li//span[text()='${sequenceName}']`));
    sequenceButton.click();
  }

  startSequencePlay() {
    this.switchToCorrectTabIfNeeded();
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

  private switchToCorrectTabIfNeeded() {
    return this.accordion.activeMenu.then(activeTabText => {
      if (activeTabText !== 'Events') {
        return this.accordion.goToMenu('Events');
      }
    });
  }
}
