import { browser, element, by, ElementFinder } from 'protractor';
const ownTag = 'app-twiglet-filters';

export class TwigletFilter {

  get filterCount() {
    return browser.findElements(by.xpath(`//${ownTag}//div[contains(@class, 'twiglet-filter')]`)).then(elements =>
      elements.length
    );
  }

  get filters(): Filter[] {
    return new Proxy([], {
      get(target, propKey, receiver) {
        return filter(`//app-twiglet-filters//div[contains(@class, 'twiglet-filter')][${propKey}]`);
      }
    });
  }
}

function filter(groupString) {
  return {
    set type(type) {
      const input = element(by.xpath(`${groupString}/select[@formcontrolname="type"]/option[text()="${type}"]`)).click();
    },
    set key(key) {
      const input = element(by.xpath(`${groupString}/select[@formcontrolname="key"]/option[text()="${key}"]`)).click();
    },
    set value(value) {
      const input = element(by.xpath(`${groupString}/select[@formcontrolname="value"]/option[text()="${value}"]`)).click();
    }
  };
}

export interface Filter {
  type: PromiseLike<string>;
  key: PromiseLike<string>;
  param: PromiseLike<string>;
}
