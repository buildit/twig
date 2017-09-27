import { browser, by, element, ElementFinder } from 'protractor';

import { Accordion } from './../';

const tabPath = '//app-twiglet-gravity';
export class GravityMenu {
  private accordion: Accordion;
  constructor(accordion) {
    this.accordion = accordion;
  }

  private switchToCorrectMenuIfNeeded() {
    return this.accordion.activeMenu.then(activeTabText => {
      if (activeTabText !== 'Gravity') {
        return this.accordion.goToMenu('Gravity');
      }
    });
  }

  toggleGravityEditProcess() {
    const parent = element(by.xpath(`${tabPath}//label[text()="Gravity Edit Mode"]/parent::*`));
    const toggle = parent.element(by.css('.slider.round'));
    return toggle.click();
  }
}
