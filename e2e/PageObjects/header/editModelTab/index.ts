import { browser, element, by } from 'protractor';
import { Header } from './../';
import { User } from '../../user';
import { ModelTab } from '../modelTab';
const ownTag = 'app-header-model-edit';
const user = new User();

export class EditModelTab {
  constructor(private header: Header) { }

  startModelEditProcess() {
    const self = element(by.css(ownTag));
    self.element(by.css('i.fa.fa-pencil')).click();
  }

  saveModelEdits() {
    const self = element(by.css(ownTag));
    self.element(by.css('i.fa.fa-check')).click();
  }

  cancelModelEdits() {
    const self = element(by.css(ownTag));
    self.element(by.css('i.fa.fa-times')).click();
  }
}
