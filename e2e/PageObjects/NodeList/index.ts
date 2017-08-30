import { browser, element, by, ElementFinder } from 'protractor';
const ownTag = 'app-twiglet-node-list';

export class NodeList {

  get entityCount() {
    return browser.findElements(by.xpath(`//${ownTag}//div[contains(@class, 'entity-header')]`)).then(elements =>
      elements.length
    );
  }

  get entities(): { [key: string]: EntityHeader } {
    return new Proxy({}, {
      get (target, entityName) {
        return entityHeader(`//app-twiglet-node-list//div[contains(@class, 'entity-header')]/span[contains(text(), '${entityName}')]/..`);
      }
    });

  }
}

function entityHeader(groupString): EntityHeader {
  return {
    get icon() {
      const classesToExclude = ['fa'];
      return new Promise<string>((resolve, reject) => {
        element(by.xpath(`${groupString}i[contains(@class, 'fa')]`)).getAttribute('class')
        .then(classString =>
            classString.split(' ').filter(className => !classesToExclude.includes[className])[0])
        .then(resolve)
        .catch(reject);
      });
    },
    get color() {
      const parent = element(by.xpath(groupString));
      return new Promise<string>((resolve, reject) => {
        parent.getCssValue('color')
      });
    },
    get count() {
      const input = element(by.xpath(`${groupString}/span[2]`));
      return new Promise<number>((resolve, reject) => {
        input.getText().then(text => +text.replace('(', '').replace(')', ''))
        .then(resolve)
        .catch(reject);
      });
    },
    getNode(name): Node {
      return node(groupString, name);
    }
  };
}


function node(groupString, name): Node {
  const nodeTitle = `//div[contains(@class, 'card-header')]//span[contains(text(), '${name}')]`;
  const nodeGroup = `${groupString}/../..${nodeTitle}/../../../../..`;

  return {
    get isOpen() {
      return new Promise<boolean>((resolve, reject) => {
        element(by.xpath(nodeGroup)).getAttribute('aria-expanded').then(attribute => attribute === 'true')
        .then(resolve)
        .catch(reject);
      });
    },
    open () {
      element(by.xpath(nodeGroup)).click();
    },
    get color() {
      return new Promise<string>((resolve, reject) => {
        element(by.xpath(`${nodeGroup}/div/a/div/span/span[2]`)).getCssValue('color')
        .then(resolve)
        .catch(reject);
      });
    },
    get type() {
      return new Promise<string>((resolve, reject) => {
        element(by.xpath(`${nodeGroup}//span[@class='node-info-type']/span[@class='param']`)).getText()
        .then(resolve)
        .catch(reject);
      })
    },
    get location() {
      return new Promise<string>((resolve, reject) => {
        element(by.xpath(`${nodeGroup}//span[@class='node-info-location']/span[@class='param']`)).getText()
        .then(resolve)
        .catch(() => undefined);
      });
    },
    get startAt() {
      return new Promise<string>((resolve, reject) => {
        element(by.xpath(`${nodeGroup}//span[@class='node-info-start-at']/span[@class='param']`)).getText()
        .then(resolve)
        .catch(() => undefined);
      });
    },
    get endAt() {
      return new Promise<string>((resolve, reject) => {
        element(by.xpath(`${nodeGroup}//span[@class='node-info-end-at']/span[@class='param']`)).getText()
        .then(resolve)
        .catch(() => undefined);
      });
    },
    get attributes() {
      return new Proxy({}, {
        get (target, key) {
          try {
            const keyGroup = `/span/span[contains(@class, "key") and contains(text(), ${key})]/..`;
            return element(by.xpath(`${nodeGroup}//span[@class='node-info-attribute']${keyGroup}/span[@class="param"]`)).getText();
          } catch (error) {
            return undefined;
          }
        },
      });
    }
  };
}

export interface EntityHeader {
  icon: Promise<string>;
  color: Promise<string>;
  count: Promise<number>;
  getNode: (name: string) => Node;
}

export interface Node {
  isOpen: Promise<boolean>;
  open: () => void;
  color: Promise<string>;
  type: Promise<string>;
  location: Promise<string>;
  startAt: Promise<string>;
  endAt: Promise<string>;
  attributes: object;
}
