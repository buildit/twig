import { browser, by, element, ElementFinder } from 'protractor';

import { Accordion } from './../';

const tabPath = `//app-header-view`;
export class ViewMenu {
  private accordion: Accordion;
  constructor(accordion) {
    this.accordion = accordion;
  }

  private getParentOfViewGroup(viewName): ElementFinder {
    return element(
      by.xpath(`//app-view-dropdown//div[@class='d-inline-block dropdown show']/ul/li//span[text()='${viewName}']/parent::*`));
  }

  get viewCount() {
    this.switchToCorrectMenuIfNeeded();
    return browser.findElements(by.css('li.view-list-item')).then(elements => elements.length);
  }

  startNewViewProcess() {
    this.switchToCorrectMenuIfNeeded();
    const newViewButton = element(by.xpath(`//app-twiglet-views//i[@class="fa fa-plus view-action"]/parent::*`));
    newViewButton.click();
  }

  startViewViewProcess(viewName) {
    this.switchToCorrectMenuIfNeeded();
    const viewButton = element(by.xpath(
        `//app-twiglet-views//li[contains(@class, 'view-list-item')]/span[text()="${viewName}"]`));
    viewButton.click();
  }

  startSaveViewProcess(viewName) {
    this.switchToCorrectMenuIfNeeded();
    const parent = this.getParentOfViewGroup(viewName);
    parent.element(by.css('i.fa-floppy-o')).click();
  }

  startDeleteViewProcess(viewName) {
    this.switchToCorrectMenuIfNeeded();
    const parent = this.getParentOfViewGroup(viewName);
    parent.element(by.css('i.fa-trash')).click();
  }

  toggleGravityEditProcess() {
    this.switchToCorrectMenuIfNeeded();
    element(by.className('gravityButton')).click();
  }

  toggleGravityAddingProcess() {
    element(by.className('toggle-group')).click();
  }

  private switchToCorrectMenuIfNeeded() {
    return this.accordion.activeMenu.then(activeTabText => {
      if (activeTabText !== 'View') {
        return this.accordion.goToMenu('View');
      }
    });
  }
}
