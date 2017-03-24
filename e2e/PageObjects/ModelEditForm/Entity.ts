import { element, by } from 'protractor';

export class Entity {
  constructor(private row: string) { }

  setType(type) {
    const input = element(by.xpath(`${this.row}input[@formcontrolname='type']`));
    input.clear();
    input.sendKeys(type);
  }

  setColor(color) {
    const input = element(by.xpath(`${this.row}input[@formcontrolname='color']`));
    input.sendKeys(color);
  }

  setSize(size) {
    const input = element(by.xpath(`${this.row}input[@formcontrolname='size']`));
    input.clear();
    input.sendKeys(size);
  }

  setIcon(icon) {
    element(by.xpath(`${this.row}button[@id='iconDropdownMenu']`)).click();
    element(by.xpath(`${this.row}input[@placeholder='search']`)).sendKeys(icon);
    element(by.xpath(`${this.row}button[@class='dropdown-item']`)).click();
  }

  clickAddEntity() {
    element(by.xpath(`${this.row}button[text()='Add Entity']`)).click();
  }

  get type() {
    const input = element(by.xpath(`${this.row}input[@formcontrolname='type']`));
    return input.getAttribute('value');
  }

  get color() {
    const input = element(by.xpath(`${this.row}input[@formcontrolname='color']`));
    return input.getAttribute('value');
  }

  get size() {
    const input = element(by.xpath(`${this.row}input[@formcontrolname='size']`));
    return input.getAttribute('value');
  }

  get icon() {
    const classesToExclude = ['fa', 'fa-2x'];
    return element(by.xpath(`${this.row}i[contains(@class, 'fa-2x')]`))
      .getAttribute('class').then(classString =>
        classString.split(' ').filter(className => !classesToExclude.includes[className])[0]);
  }
}
