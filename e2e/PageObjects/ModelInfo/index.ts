import { browser, element, by, ElementFinder } from 'protractor';
const ownTag = 'app-model-view';


export class ModelInfo {

  get entityCount() {
    return browser.findElements(by.xpath(`//${ownTag}//div[contains(@class, 'entity-row')]`)).then(elements =>
      // Account for the header row.
      elements.length - 1
    );
  }

   get row(): Entity[] {
    return new Proxy([], {
      get(target, propKey, receiver) {
        return entity(`//div[contains(@class, 'entity-row')][${propKey as number + 1}]`);
      }
    });
  }
}

function entity(rowString) {
  return {
    get type() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='type']`));
      return input.getAttribute('value');
    },
    get color() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='color']`));
      return input.getAttribute('value');
    },
    get size() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='size']`));
      return input.getAttribute('value');
    },
    get icon() {
      const classesToExclude = ['fa', 'fa-2x'];
      return element(by.xpath(`${rowString}i[contains(@class, 'fa-2x')]`))
        .getAttribute('class').then(classString =>
          classString.split(' ').filter(className => !classesToExclude.includes[className])[0]);
    },
  };
}

export interface Entity {
  type: string;
  color: string;
  size: string;
  icon: string;
}
