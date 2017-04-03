import { browser, by, element } from 'protractor';

import { Header } from './header';
import { ModelEditForm } from './ModelEditForm';
import { ModalForm } from './modalForm';
import { ModelInfo } from './ModelInfo';
import { TwigletGraph } from './twigletGraph';
import { User } from './user';

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
