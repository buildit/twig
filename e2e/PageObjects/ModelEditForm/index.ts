import { browser, element, by, ElementFinder } from 'protractor';
const ownTag = '//app-model-form//';

export class ModelEditForm {
  addEntity(type: string, icon: string, color?: string, size?: string) {
    const blankEntity = this.blankEntity;
    blankEntity.type = type;
    blankEntity.color = color;
    blankEntity.size = size;
    blankEntity.icon = icon;
    blankEntity.clickSave();
  }

  addAttribute(rowNumber, name, type, required = false) {
    const arrow = element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]//span[@class='clickable']/i`));
    return arrow.getAttribute('class').then(classes => {
      if (classes.includes('fa-arrow-down')) {
        arrow.click();
      }
      element(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]//i[contains(@class, 'fa-plus-circle')]`)).click();
      return browser.findElements(by.xpath(`//div[contains(@class, 'entity-row')][${rowNumber}]//div[@formarrayname="attributes"]` +
          `/div[contains(@class, 'attribute-form')]//div[contains(@class, 'form-row')]`));
    })
    .then(elements => {
      const rowString = `//div[contains(@class, 'entity-row')][${rowNumber}]//div[@formarrayname="attributes"]` +
          `/div[contains(@class, 'attribute-form')]//div[contains(@class, 'form-row')][${elements.length}]//`;
      const newAttribute = attribute(rowString);
      newAttribute.name = name;
      newAttribute.type = type;
      newAttribute.required = required;
    });

  }

  clickButton(className: string) {
    element(by.css(`.fa.fa-${className}`)).click();
  }

  get isOpen() {
    return browser.isElementPresent(element(by.css('app-model-form')));
  }

  get entityCount() {
    return browser.findElements(by.xpath(`${ownTag}div[contains(@class, 'entity-row')]`)).then(elements =>
      // the first row is the header.
      elements.length - 1
    );
  }

  get blankEntity() {
    const blankEntityString = `//div[@class = 'blank-entity-row']//`;
    const returner = entity(blankEntityString);
    returner.clickSave = function clickSave() {
      return element(by.xpath(`${blankEntityString}button[text()='Add Entity']`)).click();
    };
    return returner;
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
      return input.getAttribute('value');
    },
    set type(type: string | PromiseLike<string>) {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='type']`));
      input.clear();
      input.sendKeys(type as string);
    },
    get color() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='color']`));
      return input.getAttribute('value');
    },
    set color(color: string | PromiseLike<string>) {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='color']`));
      input.sendKeys(color as string);
    },
    get size() {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='size']`));
      return input.getAttribute('value');
    },
    set size(size: string | PromiseLike<string>) {
      const input = element(by.xpath(`${rowString}input[@formcontrolname='size']`));
      input.clear();
      input.sendKeys(size as string);
    },
    get icon() {
      const classesToExclude = ['fa', 'fa-2x'];
      return element(by.xpath(`${rowString}i[contains(@class, 'fa-2x')]`))
        .getAttribute('class').then(classString =>
          classString.split(' ').filter(className => !classesToExclude.includes[className])[0]);
    },
    set icon(icon: string | PromiseLike<string>) {
      element(by.xpath(`${rowString}button[@id='iconDropdownMenu']`)).click();
      const search = element(by.xpath(`${rowString}input[@placeholder='search']`));
      search.clear();
      search.sendKeys(icon as string);
      element(by.xpath(`${rowString}button[contains(text(), '${icon}')]`)).click();
    },
    clickSave () { }
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
