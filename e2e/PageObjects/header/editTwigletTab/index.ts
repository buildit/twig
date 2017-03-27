import { Header } from './../';
import { browser, element, by, ElementFinder } from 'protractor';
import { iconsObject } from '../../../../src/non-angular/utils/icons';

export class EditTwigletTab {

  self: ElementFinder;
  icons: Object;

  constructor(private header: Header) {
    this.self = element(by.css('app-header-twiglet-edit'));
    this.icons = iconsObject();
  }

  get mode() {
    return this.header.activeTab.then(activeTabText => {
      if (activeTabText !== 'Edit') {
        return 'viewing';
      }
      return this.self.isElementPresent(by.cssContainingText('button', `Edit Twiglet's Model`))
      .then(present => present ? 'editing' : 'viewing');
    });
  }

  startTwigletEditProcess() {
    const button = this.self.element(by.cssContainingText('button', `Edit Twiglet`));
    button.click();
  }

  startTwigletModelEditProcess() {
    const button = this.self.element(by.cssContainingText('button', `Edit Twiglet's Model`));
    button.click();
  }

  copyNode() {
    const button = this.self.element(by.css('.fa.fa-clone'));
    button.click();
  }

  pasteNode() {
    const button = this.self.element(by.css('.fa.fa-clipboard'));
    button.click();
  }

  addNodeByTooltip(tooltip) {
    const target = element(by.css('app-twiglet-graph'));
    const button = element(by.xpath(`//app-header-twiglet-edit//button[@ng-reflect-ngb-tooltip='${tooltip}']`));
    browser.driver.actions().dragAndDrop(button, target).perform();
  }

  saveEdits() {
    this.self.element(by.css('.fa.fa-check')).click();
  }
}
