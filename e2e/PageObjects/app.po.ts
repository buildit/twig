import { Header } from './header';
import { ModalForm } from './modalForm';
import { User } from './user';
import { browser, element, by } from 'protractor';

export class TwigPage {
  header = new Header();
  modalForm = new ModalForm();
  user = new User();
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
