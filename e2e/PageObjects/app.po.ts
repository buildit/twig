import { ModelEditForm } from './ModelEditForm';
import { ModelInfo } from './ModelInfo';
import { Header } from './header';
import { ModalForm } from './modalForm';
import { User } from './user';
import { TwigletGraph } from './twigletGraph';
import { browser, element, by } from 'protractor';

export class TwigPage {
  header = new Header();
  modalForm = new ModalForm();
  modelInfo = new ModelInfo();
  modelEditForm = new ModelEditForm();
  user = new User();
  twigletGraph = new TwigletGraph();
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
