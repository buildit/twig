import { browser, by, element } from 'protractor';

import { Header } from './header';
import { ModelEditForm } from './ModelEditForm';
import { ModalForm } from './modalForm';
import { ModelInfo } from './ModelInfo';
import { NodeList } from './NodeList';
import { TwigletFilters } from './TwigletFilters';
import { TwigletGraph } from './twigletGraph';
import { User } from './user';

export class TwigPage {
  header = new Header();
  modalForm = new ModalForm();
  modelInfo = new ModelInfo();
  modelEditForm = new ModelEditForm();
  nodeList = new NodeList();
  twigletFilters = new TwigletFilters();
  user = new User();
  twigletGraph = new TwigletGraph();

  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
