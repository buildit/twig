import { browser, by, element, ElementFinder } from 'protractor';

import { Accordion } from './../';

const tabPath = `//app-environment-controls`;
export class EnvironmentMenu {
  private accordion: Accordion;
  constructor(accordion) {
    this.accordion = accordion;
  }

  toggleByLabel(labelName: string) {
    const parent = this.getGroupByLabel(labelName);
    const toggle = parent.element(by.css('.slider.round'));
    return toggle.click();
  }

  private getGroupByLabel(labelName: string) {
    return element(by.xpath(`${tabPath}//label[text()="${labelName}"]/parent::*`))
  }

  private switchToCorrectMenuIfNeeded() {
    return this.accordion.activeMenu.then(activeTabText => {
      if (activeTabText !== 'Environment') {
        return this.accordion.goToMenu('Environment');
      }
    });
  }
}
