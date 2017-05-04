import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

import { Header } from './../';

const tabPath = `//app-header-events`;
export class EventsTab {
  private header: Header;

  constructor(header) {
    this.header = header;
  }

  get sequenceCount() {
    return browser.findElements(by.css('li.sequence-list-item')).then(elements => elements.length);
  }

  /**
   * Gets the parent div of a label, used to quickly navigate around .form-groups
   *
   * @private
   * @param {any} labelText the text of the label
   * @returns {ElementFinder}
   *
   * @memberOf EventsTab
   */
  private getParentOfSequenceGroup(sequenceName): ElementFinder {
    return element(
      by.xpath(`//app-sequence-dropdown//div[@class='d-inline-block dropdown show']/ul/li//span[text()="${sequenceName}"]/parent::*`));
  }

  startNewEventProcess() {
    this.switchToCorrectTabIfNeeded();
    element(by.buttonText('Create Event')).click();
  }

  openSequenceMenu() {
    element(by.id('sequenceDropdownMenu')).click();
  }

  startNewSequenceProcess() {
    this.switchToCorrectTabIfNeeded();
    this.openSequenceMenu();
    const newSequenceButton = element(by.xpath(`//div[@id='eventsTab-panel']//app-sequence-dropdown//li[text()='New Sequence']`));
    newSequenceButton.click();
  }

  startDeleteSequenceProcess(sequenceName) {
    this.switchToCorrectTabIfNeeded();
    this.openSequenceMenu();
    const parent = this.getParentOfSequenceGroup(sequenceName);
    parent.element(by.css('i.fa-trash')).click();
  }

  startSaveSequenceProcess(sequenceName) {
    this.switchToCorrectTabIfNeeded();
    this.openSequenceMenu();
    const parent = this.getParentOfSequenceGroup(sequenceName);
    parent.element(by.css('i.fa-floppy-o')).click();
  }

  startViewSequenceProcess(sequenceName) {
    const sequenceButton = element(by.xpath(`//app-sequence-dropdown//li//span[text()='${sequenceName}']`));
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
    return this.header.activeTab.then(activeTabText => {
      if (activeTabText !== 'Events') {
        return this.header.goToTab('Events');
      }
    });
  }
}
