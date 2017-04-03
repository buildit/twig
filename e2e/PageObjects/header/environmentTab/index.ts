import { browser, by, element, ElementFinder } from 'protractor';

import { Header } from './../';

const tabPath = `//app-header-environment`;
export class EnvironmentTab {
  private header: Header;
  constructor(header) {
    this.header = header;
  }

  toggleNodeLabels() {
    this.switchToCorrectTabIfNeeded();
    element(by.css('i.fa-comment')).click();
  }

  private switchToCorrectTabIfNeeded() {
    return this.header.activeTab.then(activeTabText => {
      if (activeTabText !== 'Environment') {
        return this.header.goToTab('Environment');
      }
    });
  }
}
