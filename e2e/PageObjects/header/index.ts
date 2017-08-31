import { browser, by, element } from 'protractor';

import { EditModelTab } from './editModelTab';
import { EditTwigletTab } from './editTwigletTab';
import { ModelTab } from './modelTab';
import { TwigletTab } from './twigletTab';

export class Header {
  modelEditTab: EditModelTab;
  modelTab: ModelTab;
  twigletEditTab: EditTwigletTab;
  twigletTab: TwigletTab;

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
    return element(by.xpath(`//app-header//ul[@class="nav ml-auto"]//a[contains(concat(' ', @class, ' '), ' active ')]`)).getText();
  }

  goToTab(text: 'Home' | 'Twiglet' | 'Model' | 'About') {
    const elementToClick = element(by.xpath(`//app-header//ul[@class="nav ml-auto"]//a[contains(text(), "${text}")]`));
    elementToClick.click();
  }
}
