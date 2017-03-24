import { browser, by, element } from 'protractor';

import { ModelTab } from './modelTab';
import { EditModelTab } from './editModelTab';
import { TwigletTab } from './twigletTab';
import { EditTwigletTab } from './editTwigletTab';

export class Header {
  modelTab: ModelTab;
  modelEditTab: EditModelTab;
  twigletTab: TwigletTab;
  twigletEditTab: EditTwigletTab;

  constructor() {
    this.modelTab = new ModelTab(this);
    this.modelEditTab = new EditModelTab(this);
    this.twigletTab = new TwigletTab(this);
    this.twigletEditTab = new EditTwigletTab(this);
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
