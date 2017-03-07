import { TwigletTab } from './twigletTab/index';
import { browser, element, by } from 'protractor';

export class Header {
  twigletTab: TwigletTab;

  constructor() {
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
