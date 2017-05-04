import { browser, by, element, ElementFinder } from 'protractor';

const ownTag = '//app-twiglet-filters';

export class TwigletFilters {

  get filterCount() {
    return browser.findElements(by.xpath(`${ownTag}//div[contains(@class, 'twiglet-filter')]`)).then(elements =>
      elements.length
    );
  }

  get filters(): Filter[] {
    return new Proxy([], {
      get(target, propKey, receiver) {
        return filter(`${ownTag}//div[contains(@class, 'twiglet-filter')][${+(propKey as string) + 1}]`);
      }
    });
  }

  addFilter() {
    element(by.xpath(`${ownTag}//button[text()="Add Filter"]`)).click();
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
