import { browser, element, by, ElementFinder } from 'protractor';
const ownTag = 'app-twiglet-node-list';

export class NodeList {

  get entityCount() {
    return browser.findElements(by.xpath(`//${ownTag}//div[contains(@class, 'entity-header')]`)).then(elements =>
      elements.length
    );
  }

  entityGroup(entityName: string): EntityHeader {
    return entityHeader(`//app-twiglet-node-list//div[contains(@class, 'entity-header')]/span[contains(text(), '${entityName}')]/..`);
  }
}

function entityHeader(groupString): EntityHeader {
  return {
    get icon() {
      const classesToExclude = ['fa'];
      return element(by.xpath(`${groupString}i[contains(@class, 'fa')]`))
        .getAttribute('class').then(classString =>
          classString.split(' ').filter(className => !classesToExclude.includes[className])[0]);
    },
    get color() {
      const parent = element(by.xpath(groupString));
      return parent.getCssValue('color');
    },
    get count() {
      const input = element(by.xpath(`${groupString}/span[2]`));
      return input.getText().then(text => text.replace('(', '').replace(')', ''));
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
      return element(by.xpath(nodeGroup)).getAttribute('aria-expanded').then(attribute => attribute === 'true');
    },
    open () {
      element(by.xpath(nodeGroup)).click();
    },
    get color() {
      return element(by.xpath(`${nodeGroup}/div/a/div/span/span[2]`)).getCssValue('color');
    },
    get type() {
      return element(by.xpath(`${nodeGroup}//span[@class='node-info-type']/span[@class='param']`)).getText();
    },
    get location() {
      try {
        return element(by.xpath(`${nodeGroup}//span[@class='node-info-location']/span[@class='param']`)).getText();
      } catch (error) {
        return undefined;
      }
    },
    get startAt() {
      try {
        return element(by.xpath(`${nodeGroup}//span[@class='node-info-start-at']/span[@class='param']`)).getText();
      } catch (error) {
        return undefined;
      }
    },
    get endAt() {
      try {
        return element(by.xpath(`${nodeGroup}//span[@class='node-info-end-at']/span[@class='param']`)).getText();
      } catch (error) {
        return undefined;
      }
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
  icon: PromiseLike<string>;
  color: PromiseLike<string>;
  count: PromiseLike<string>;
  getNode: (name: string) => Node;
}

export interface Node {
  isOpen: PromiseLike<boolean>;
  open: () => void;
  color: PromiseLike<string>;
  type: PromiseLike<string>;
  location: PromiseLike<string>;
  startAt: PromiseLike<string>;
  endAt: PromiseLike<string>;
  attributes: object;
}
