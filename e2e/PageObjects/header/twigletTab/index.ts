import { browser, by, element, ElementFinder } from 'protractor';

import { Header } from './../';
import { deleteDefaultJsonImportedTwiglet } from './../../../utils';

const tabPath = `//app-header-twiglet`;
export class TwigletTab {
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
   * @memberOf TwigletTab
   */
  private getParentOfTwigletGroup(twigletName): ElementFinder {
    return element(
      by.xpath(`//app-twiglet-dropdown//div[@class='d-inline-block dropdown show']/ul/li//span[text()="${twigletName}"]/parent::*`));
  }

  openTwigletMenu() {
    element(by.id('twigletDropdownMenu')).click();
  }

  openChangelogMenu() {
    element(by.css('.changelog-menu')).click();
  }

  startNewTwigletProcess() {
    this.switchToCorrectTabIfNeeded();
    this.openTwigletMenu();
    const newTwigletButton = element(by.xpath(`//div[@id='twigletTab-panel']//app-twiglet-dropdown//li[text()='New Twiglet']`));
    newTwigletButton.click();
  }

  startViewTwigletProcess(twigletName) {
    this.switchToCorrectTabIfNeeded();
    this.openTwigletMenu();
    const twigletButton = element(by.xpath(`//div[@id='twigletTab-panel']//app-twiglet-dropdown//li[text()='${twigletName}']`));
    twigletButton.click();
  }

  startDeleteTwigletProcess(twigletName) {
    this.switchToCorrectTabIfNeeded();
    this.openTwigletMenu();
    const parent = this.getParentOfTwigletGroup(twigletName);
    parent.element(by.css('i.fa-trash')).click();
  }

  deleteTwigletIfNeeded(twigletName, page) {
    this.switchToCorrectTabIfNeeded();
    this.openTwigletMenu();
    element.all(by.css('.clickable')).getText().then(twiglets => {
      if (twiglets.includes(twigletName)) {
        const parent = this.getParentOfTwigletGroup(twigletName);
        parent.element(by.css('i.fa-trash')).click();
        page.formForModals.fillInOnlyTextField(twigletName);
        page.formForModals.clickButton('Delete');
      }
    });
  }

  private switchToCorrectTabIfNeeded() {
    return this.header.activeTab.then(activeTabText => {
      if (activeTabText !== 'Twiglet') {
        return this.header.goToTab('Twiglet');
      }
    });
  }
}
