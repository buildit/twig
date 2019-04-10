import { browser, element, by, Key, ElementFinder, ElementArrayFinder, promise } from 'protractor';

// const modalPath = `//ngb-modal-window[@class='modal fade show']//`;
const modalPath = `//ngb-modal-window[contains(@class, 'modal')]//`;

export class EditNode {
  get attributes() {
    return browser.findElements(by.xpath(`${modalPath}div[@formarrayname='attrs']//div[contains(@class, 'form-inline')]`))
    .then(rows => {
      const promises = [];
      rows.forEach((rowE, index) => {
        const row = element(by.xpath(`${modalPath}div[@formarrayname='attrs']//div[contains(@class, 'form-inline')][${index + 1}]`));
        promises.push(promise.all([row.element(by.className('key')), row.element(by.className('value'))])
        .then(([keyF, valueF]: ElementFinder[]) =>
          keyF.getTagName().then(tagName => {
            if (tagName === 'label') {
              return keyF.getText().then(key =>
                valueF.getAttribute('value')
                  .then(value => ({ tagName, key, value })),
              );
            } else {
              return keyF.getAttribute('value').then(key =>
                valueF.getAttribute('value')
                  .then(value => ({ tagName, key, value })),
              );
            }
          })
        ));
      });
      return promise.all(promises);
    });
  }

  fillKey(rowNumber, key) {
    const rowString = this.rowNumber(rowNumber);
    const row = element(by.xpath(rowString));
    const input = row.element(by.xpath(`input[@formcontrolname='key']`));
    input.clear();
    input.sendKeys(key);
  }

  getKey(rowNumber) {
    const rowString = this.rowNumber(rowNumber);
    const row = element(by.xpath(rowString));
    const input = row.element(by.css(`label`));
    return input.getText();
  }

  fillValue(rowNumber, value) {
    const rowString = this.rowNumber(rowNumber);
    const row = element(by.xpath(rowString));
    const input = row.element(by.xpath(`input[@formcontrolname='value']`));
    input.clear();
    input.sendKeys(value);
  }

  clearValue(rowNumber) {
    const rowString = this.rowNumber(rowNumber);
    const row = element(by.xpath(rowString));
    const input = row.element(by.xpath(`input[@formcontrolname='value']`));
    input.clear();
  }

  getError(rowNumber) {
    const rowString = this.rowNumber(rowNumber);
    const row = element(by.xpath(rowString));
    return row.element(by.xpath(`div[contains(@class, 'alert-danger')]`)).isPresent().then(present => {
      if (present) {
        return row.element(by.xpath(`div[contains(@class, 'alert-danger')]`)).getText();
      }
      return undefined;
    });
  }

  switchType(type: string) {
    const dropdown = element(by.id('entityDropdownMenu'));
    dropdown.click();
    const targetButton = element(by.buttonText(type));
    targetButton.click();
  }

  private rowNumber(number) {
    return `//ngb-modal-window[contains(@class, 'modal')]//div[@formarrayname='attrs']//div[contains(@class, 'form-inline')][${number}]`;
  }
}
