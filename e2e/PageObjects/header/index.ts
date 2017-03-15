import { browser, by, element } from 'protractor';

import { ModelTab } from './modelTab/index';
import { TwigletTab } from './twigletTab/index';

export class Header {
  modelTab: ModelTab;
  twigletTab: TwigletTab;

  constructor() {
    this.modelTab = new ModelTab(this);
    this.twigletTab = new TwigletTab(this);
  }

  get title() {
    return element(by.css('app-header-info-bar')).getText();
  }

  get activeTab() {
    return element(by.xpath(`//div[@id='headerFlexBox']/ngb-tabset//a[contains(concat(' ', @class, ' '), ' active ')]`)).getText();
  }

  goToTab(text) {
    const elementToClick = element(by.xpath(`//div[@id='headerFlexBox']/ngb-tabset//a[contains(text(), "${text}")]`));
    elementToClick.click();
  }
}
