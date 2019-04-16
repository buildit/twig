import { browser, by, element, ElementFinder } from 'protractor';

import { Accordion } from './../';

const ownTag = '//app-twiglet-filters';

export class FiltersMenu {

  private accordion: Accordion;

  constructor(accordion) {
    this.accordion = accordion;
  }

  get filterCount() {
    return browser.findElements(by.xpath(`${ownTag}//div[contains(@class, 'twiglet-filter')]`)).then(elements =>
      elements.length
    );
  }

  get filters(): Filter[] {
    this.switchToCorrectTabIfNeeded();
    return new Proxy([], {
      get(target, propKey, receiver) {
        return filter(`${ownTag}//div[contains(@class, 'twiglet-filter')][${+(propKey as string) + 1}]`);
      }
    });
  }

  addFilter() {
    element(by.xpath(`${ownTag}//button[text()="Add Filter"]`)).click();
  }

  setFilterType(index: number, type: string, forTarget: boolean = false) {
    let activeFilter = `${ownTag}//div[contains(@class, 'twiglet-filter')][${index} + 1]`;
    if (forTarget) {
      activeFilter += '//app-twiglet-filter-target';
    }
    element(by.xpath(`${activeFilter}//select[@formcontrolname="type"]/option[text()="${type}"]`)).click();
  }

  addTargetAndType(index: number, type: string) {
    const activeFilter = `${ownTag}//div[contains(@class, 'twiglet-filter')][${index} + 1]`;
    element(by.xpath(`${activeFilter}//button[text()="Add Target"]`)).click();
    this.setFilterType(index, type, true);
  }

  private switchToCorrectTabIfNeeded() {
    return this.accordion.activeMenu.then(activeTabText => {
      if (activeTabText !== 'Filter') {
        return this.accordion.goToMenu('Filter');
      }
    });
  }
}

function filter(groupString): Filter {
  return {
    set type(type) {
      element(by.xpath(`${groupString}/select[@formcontrolname="type"]/option[text()="${type}"]`)).click();
    },
    set key(key) {
      element(by.xpath(`${groupString}/select[@formcontrolname="key"]/option[text()="${key}"]`)).click();
    },
    set param(value) {
      element(by.xpath(`${groupString}/select[@formcontrolname="value"]/option[text()="${value}"]`)).click();
    },
    addTarget() {
      element(by.xpath(`${groupString}//button[text()="Add Target"]`)).click();
    },
    remove() {
      element(by.xpath(`${groupString}//button[text()="Remove Filter"]`)).click();
    },
    get target(): BasicFilter {
      const returner = filter(`${groupString}//app-twiglet-filter-target/`);
      delete returner.addTarget;
      delete returner.remove;
      return returner;
    }
  };
}

export interface Filter extends BasicFilter {
  addTarget: () => void;
  remove: () => void;
  target: BasicFilter;
}

export interface BasicFilter {
  type: string;
  key: string;
  param: string;
}
