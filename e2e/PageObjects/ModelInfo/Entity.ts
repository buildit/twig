import { ElementFinder, by } from 'protractor';
export class Entity {
  constructor(private self: ElementFinder) { }

  get type() {
    const div = this.self.element(by.xpath(`//div[1]`));
    return div.getText();
  }

  get size() {
    const div = this.self.element(by.xpath(`//div[2]`));
    return div.getText();
  }

  get color() {
    const div = this.self.element(by.xpath(`//div[3]`));
    return div.getCssValue('color');
  }

  get icon() {
    const classesToExclude = ['fa', 'fa-2x'];
    const div = this.self.element(by.xpath(`//div[3]`));
    return div.element(by.xpath(`i`))
      .getAttribute('class').then(classString =>
        classString.split(' ').filter(className => !classesToExclude.includes[className])[0]);
  }
}
