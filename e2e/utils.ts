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
    page.formForModals.fillInTextFieldByLabel('Name', modelName);
    page.formForModals.clickButton('Save Changes');
    browser.waitForAngular();
    page.header.goToTab('Edit');
    page.header.modelEditTab.startModelEditProcess();
    page.modelEditForm.addEntity('ent1', 'ban', '#CC0000', '30');
    page.modelEditForm.addEntity('ent2', 'dollar', '#00CC00', '40');
    page.modelEditForm.addAttribute(2, 'key1', 'String', true);
    page.modelEditForm.addAttribute(2, 'key2', 'Integer', false);
    page.modelEditForm.addAttribute(2, 'key3', 'Float', true);
    page.modelEditForm.addAttribute(2, 'key4', 'Timestamp', false);
    page.modelEditForm.addEntity('ent3', 'diamond', '#0000CC', '20');
    page.header.modelEditTab.saveModelEdits();
    page.formForModals.fillInOnlyTextField('Test Model Created');
    page.formForModals.clickButton('Save Changes');
    browser.waitForAngular();
  });
}

export function deleteDefaultModel(page: TwigPage) {
  page.header.modelTab.startDeleteModelProcess(modelName);
  page.formForModals.fillInOnlyTextField(modelName);
  page.formForModals.clickButton('Delete');
  browser.wait(() => page.formForModals.isModalOpen.then(modalOpen => modalOpen === false));
}

export function createDefaultJsonImportedTwiglet(page: TwigPage) {
  page.navigateTo();
  page.user.loginDefaultTestUser();
  page.header.twigletTab.startNewTwigletProcess();
  page.formForModals.fillInTextFieldByLabel('Name', twigletName);
  page.formForModals.uploadFileByLabel('Upload JSON', 'twigletUpload.json');
  page.formForModals.clickButton('Save Changes');
  browser.waitForAngular();
}

export function deleteDefaultJsonImportedTwiglet(page: TwigPage) {
  page.header.twigletTab.startDeleteTwigletProcess(twigletName);
  page.formForModals.fillInOnlyTextField(twigletName);
  page.formForModals.clickButton('Delete');
  browser.waitForAngular();
}
