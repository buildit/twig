import { browser, by, element, ElementFinder } from 'protractor';

import { Header } from './../';

const tabPath = `//app-header-model`;
export class ModelTab {
  private header: Header;
  constructor(header) {
    this.header = header;
  }

  /**
   * Gets the parent div of a label, used to quickly navigate around .form-groups
   *
   * @private
   * @param {any} labelText the text of the label
   * @returns {ElementFinder}
   *
   * @memberOf ModelTab
   */
  private getParentOfModelGroup(modelName): ElementFinder {
    return element(
      by.xpath(`//app-model-dropdown//div[@class='d-inline-block dropdown show']/ul/li//span[text()="${modelName}"]/parent::*`));
  }

  openModelMenu() {
    element(by.id('modelDropdownMenu')).click();
  }

  startNewModelProcess() {
    this.switchToCorrectTabIfNeeded();
    this.openModelMenu();
    const newModelButton = element(by.xpath(`//div[@id='modelTab-panel']//app-model-dropdown//li[text()='New Model']`));
    newModelButton.click();
  }

  startDeleteModelProcess(modelName) {
    this.switchToCorrectTabIfNeeded();
    this.openModelMenu();
    const parent = this.getParentOfModelGroup(modelName);
    parent.element(by.css('i.fa-trash')).click();
  }

  deleteModelIfNeeded(modelName, page) {
    this.switchToCorrectTabIfNeeded();
    this.openModelMenu();
    element.all(by.css('.clickable')).getText().then(models => {
      if (models.includes(modelName)) {
        const parent = this.getParentOfModelGroup(modelName);
        parent.element(by.css('i.fa-trash')).click();
        page.formForModals.fillInOnlyTextField(modelName);
        page.formForModals.clickButton('Delete');
      }
    });
  }

  private switchToCorrectTabIfNeeded() {
    return this.header.activeTab.then(activeTabText => {
      if (activeTabText !== 'Model') {
        return this.header.goToTab('Model');
      }
    });
  }
}
