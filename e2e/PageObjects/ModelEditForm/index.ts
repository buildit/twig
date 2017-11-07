import { browser, element, by, ElementFinder } from 'protractor';

export class ModelEditForm {

  startAddingEntity() {
    return this.entityCount.then(count => {
      const button = element(by.cssContainingText('button', 'Add New Entity'));
      button.click();
      browser.wait(() => this.entityCount.then(newCount => {
        if (newCount > count) {
          return true;
        }
        button.click();
        return false;
      }));
      browser.waitForAngular();
    });
  }

  addEntity(type: string, icon: string, color?: string) {
    this.startAddingEntity();
    this.fillEntity(1, type, icon, color);
  }

  fillEntity(rowNumber: number, type: string, icon: string, color?: string) {
    const e = this.row[rowNumber];
    e.type = type;
    e.color = color;
    e.icon = icon;
  }

  startAddingAttribute(rowNumber) {
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
      return attribute(rowString);
    })
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
      return rowString;
    })
    .then(rowString => {
      const newAttribute = attribute(rowString);
      newAttribute.name = name;
      newAttribute.type = type;
      newAttribute.required = required;
    });
  }

  fillAttribute(rowString, name: string, type: string, required = false) {
    const newAttribute = attribute(rowString);
    newAttribute.name = name;
    newAttribute.type = type;
    newAttribute.required = required;
  }

  clickButton(className: string) {
    element(by.css(`.${className}`)).click();
  }

  startEditing() {
    element(by.tagName('app-model-info')).element(by.buttonText('Edit')).click();
    browser.waitForAngular();
  }

  saveModelEdits() {
    const button = element(by.cssContainingText('button', `Save`));
    button.click();
  }

  cancelModelEdits() {
    const button = element(by.cssContainingText('button', `Cancel`));
    button.click();
  }

  get isOpen() {
    return browser.isElementPresent(element(by.css('app-model-form')));
  }

  get isReadyToSave() {
    const saveButton = element(by.xpath('//div[@class="edit-btn"]//button[text()="Save"]'));
    return saveButton.isEnabled();
  }

  get entityCount() {
    return browser.findElements(by.className('entity-row')).then(elements =>
      // Ignore header row;
      elements.length - 1
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
  icon: string | PromiseLike<string>;
  clickSave: Function;
}
