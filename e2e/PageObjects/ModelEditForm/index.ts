import { browser, element, by, ElementFinder } from 'protractor';

const ownTag = '//app-model-form//';

export class ModelEditForm {
  addEntity(type: string, icon: string, color?: string, size?: string) {
    const button = element(by.cssContainingText('button.new-button', 'Add New Entity'));
    button.click();
    const e = this.row[1];
    e.type = type;
    e.color = color;
    e.size = size;
    e.icon = icon;
  }

  addAttribute(rowNumber, name, type, required = false) {
    const showHide = element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]//span[@class="clickable"]/span`));
    return showHide.getText().then(text => {
      if (text === 'Show Attributes') {
        return showHide.click();
      }
    })
    .then(() => element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]//i[@class="fa fa-plus"]`)).click())
    .then(() => browser.findElements(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]//div[@formarrayname="attributes"]` +
          `//div[contains(@class, 'form-row')]`)))
    .then(elements => {
      const rowString = `//div[contains(@class, 'entity-row')][${rowNumber}]//div[@formarrayname="attributes"]` +
          `//div[contains(@class, 'form-row')][${elements.length - 1}]//`;
      const newAttribute = attribute(rowString);
      newAttribute.name = name;
      newAttribute.type = type;
      newAttribute.required = required;
    });

  }

  clickButton(className: string) {
    element(by.css(`.${className}`)).click();
  }

  get isOpen() {
    return browser.isElementPresent(element(by.css('app-model-form')));
  }

  get entityCount() {
    return browser.findElements(by.xpath(`${ownTag}div[contains(@class, 'entity-row')]`)).then(elements =>
      elements.length
    );
  }

  get row(): Entity[] {
    return new Proxy([], {
      get(target, propKey, receiver) {
        return entity(getRowString(propKey));
      }
    });
  }
}

function getRowString(row) {
  return `//div[contains(@class, 'form-row entity-row')][${row}]//`;
}

function entity(rowString) {
  return {
    get type() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='type']`));
      return new Promise((resolve, reject) => {
        input.getAttribute('value')
        .then(resolve)
        .catch(reject);
      })
    },
    set type(type: string | Promise<string>) {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='type']`));
      input.clear();
      input.sendKeys(type as string);
    },
    get color() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='color']`));
      return new Promise((resolve, reject) => {
        input.getAttribute('value')
        .then(resolve)
        .catch(reject);
      });
    },
    set color(color: string | Promise<string>) {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='color']`));
      input.sendKeys(color as string);
    },
    get size() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='size']`));
      return new Promise((resolve, reject) => {
        input.getAttribute('value')
        .then(resolve)
        .catch(reject);
      });
    },
    set size(size: string | Promise<string>) {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='size']`));
      input.clear();
      input.sendKeys(size as string);
    },
    get icon() {
      const classesToExclude = ['fa', 'fa-2x'];
      return new Promise((resolve, reject) => {
        element(by.xpath(`${rowString}i[contains(@class, 'fa-2x')]`))
          .getAttribute('class').then(classString =>
            classString.split(' ').filter(className => !classesToExclude.includes[className])[0])
        .then(resolve)
        .catch(reject);
      });
    },
    set icon(icon: string | Promise<string>) {
      element(by.xpath(`${rowString}button[@id='iconDropdownMenu']`)).click();
      const search = element(by.xpath(`${rowString}input[@placeholder='search']`));
      search.clear();
      search.sendKeys(icon as string);
      element(by.xpath(`${rowString}button[contains(text(), '${icon}')]`)).click();
    },
  };
}

function attribute(rowString) {
  return {
    set name(name: string) {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='name']`));
      input.clear();
      input.sendKeys(name as string);
    },
    set type(type: string) {
      const input = element(by.xpath(`${rowString}select[@formcontrolname='dataType']`));
      input.click();
      input.element(by.cssContainingText('option', type)).click();
    },
    set required(required: boolean) {
      if (required) {
        const input = element(by.xpath(`${rowString}input[@formcontrolname="required"]`));
        input.click();
      }
    }
  };
}

export interface Entity {
  type: string | PromiseLike<string>;
  color: string | PromiseLike<string>;
  size: string | PromiseLike<string>;
  icon: string | PromiseLike<string>;
  clickSave: Function;
}
