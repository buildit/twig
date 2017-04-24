import { TwigPage } from './PageObjects/app.po';

import { browser, by, element } from 'protractor';
import { escape } from 'querystring';

export const modelName = 'AAA Default Test Model';
export const twigletName = 'AAA Default JSON Twiglet';

export function createDefaultModel(page: TwigPage) {
  return page.user.isLoggedIn.then(loggedIn => {
    if (!loggedIn) {
      return page.user.loginDefaultTestUser();
    }
  })
  .then(() => {
    page.header.modelTab.startNewModelProcess();
    page.modalForm.fillInTextFieldByLabel('Name', modelName);
    page.modalForm.clickButton('Save Changes');
    browser.waitForAngular();
    page.header.goToTab('Edit');
    page.header.modelEditTab.startModelEditProcess();
    page.modelEditForm.addEntity('ent1', 'ban', '#CC0000', '30');
    page.modelEditForm.addEntity('ent2', 'dollar', '#00CC00', '40');
    page.modelEditForm.addEntity('ent3', 'diamond', '#0000CC', '20');
    page.header.modelEditTab.saveModelEdits();
    page.modalForm.fillInOnlyTextField('Test Model Created');
    page.modalForm.clickButton('Save Changes');
    browser.waitForAngular();
  });
}

export function deleteDefaultModel(page: TwigPage) {
  page.header.modelTab.startDeleteModelProcess(modelName);
  page.modalForm.fillInOnlyTextField(modelName);
  page.modalForm.clickButton('Delete');
  browser.wait(() => page.modalForm.isModalOpen.then(modalOpen => modalOpen === false));
}

export function createDefaultJsonImportedTwiglet(page: TwigPage) {
  page.navigateTo();
  page.user.loginDefaultTestUser();
  page.header.twigletTab.startNewTwigletProcess();
  page.modalForm.fillInTextFieldByLabel('Name', twigletName);
  page.modalForm.uploadFileByLabel('Upload JSON', 'twigletUpload.json');
  page.modalForm.clickButton('Save Changes');
  browser.waitForAngular();
  // browser.manage().logs()
  //     .get('browser').then((browserLog) => {
  //     console.log('log: ' + require('util').inspect(browserLog));
  //   });
}

export function deleteDefaultJsonImportedTwiglet(page: TwigPage) {
  page.header.twigletTab.startDeleteTwigletProcess(twigletName);
  page.modalForm.fillInOnlyTextField(twigletName);
  page.modalForm.clickButton('Delete');
  browser.waitForAngular();
}
