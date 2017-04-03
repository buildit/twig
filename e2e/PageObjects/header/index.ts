import { browser, by, element } from 'protractor';

import { EditModelTab } from './editModelTab';
import { EditTwigletTab } from './editTwigletTab';
import { EnvironmentTab } from './environmentTab';
import { ModelTab } from './modelTab';
import { TwigletTab } from './twigletTab';
import { ViewTab } from './viewTab';

export class Header {
  environmentTab: EnvironmentTab;
  modelEditTab: EditModelTab;
  modelTab: ModelTab;
  twigletEditTab: EditTwigletTab;
  twigletTab: TwigletTab;
  viewTab: ViewTab;

  constructor() {
    this.modelTab = new ModelTab(this);
    this.modelEditTab = new EditModelTab(this);
    this.twigletTab = new TwigletTab(this);
    this.twigletEditTab = new EditTwigletTab(this);
    this.viewTab = new ViewTab(this);
    this.environmentTab = new EnvironmentTab(this);
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
