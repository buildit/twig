import { browser, element, by, ElementFinder } from 'protractor';

import { Header } from './../';
import { User } from '../../user';
import { ModelTab } from '../modelTab';

const ownTag = 'app-header-model';
const user = new User();

export class EditModelTab {
  self: ElementFinder;

  constructor(private header: Header) {
    this.self = element(by.css(ownTag));
  }

  startModelEditProcess() {
    const button = this.self.element(by.cssContainingText('button', `Edit`));
    button.click();
  }
}
