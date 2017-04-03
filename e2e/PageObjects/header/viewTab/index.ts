import { browser, by, element, ElementFinder } from 'protractor';

import { Header } from './../';

const tabPath = `//app-header-view`;
export class ViewTab {
  private header: Header;
  constructor(header) {
    this.header = header;
  }

  private getParentOfViewGroup(viewName): ElementFinder {
    return element(
      by.xpath(`//app-view-dropdown//div[@class='d-inline-block dropdown show']/ul/li//span[text()='${viewName}']/parent::*`));
  }

  openViewMenu() {
    element(by.id('viewDropdownMenu')).click();
  }

  startNewViewProcess() {
    this.switchToCorrectTabIfNeeded();
    this.openViewMenu();
    const newViewButton = element(by.xpath(`//app-view-dropdown//li[text()='New View']`));
    newViewButton.click();
  }

  startViewViewProcess(viewName) {
    this.switchToCorrectTabIfNeeded();
    this.openViewMenu();
    const viewButton = element(by.xpath(
        `//app-view-dropdown//div[@class='d-inline-block dropdown show']/ul/li//span[text()='${viewName}']`));
    viewButton.click();
  }

  startSaveViewProcess(viewName) {
    this.switchToCorrectTabIfNeeded();
    this.openViewMenu();
    const parent = this.getParentOfViewGroup(viewName);
    parent.element(by.buttonText('Overwrite')).click();
  }

  startDeleteViewProcess(viewName) {
    this.switchToCorrectTabIfNeeded();
    this.openViewMenu();
    const parent = this.getParentOfViewGroup(viewName);
    parent.element(by.buttonText('Delete')).click();
  }

  private switchToCorrectTabIfNeeded() {
    return this.header.activeTab.then(activeTabText => {
      if (activeTabText !== 'View') {
        return this.header.goToTab('View');
      }
    });
  }
}
