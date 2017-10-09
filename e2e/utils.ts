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
    page.formForModals.clickButton('Create');
    browser.waitForAngular();
    page.header.modelTab.startModelEditProcess(modelName);
    page.modelEditForm.addEntity('ent1', 'ban', '#CC0000');
    page.modelEditForm.addEntity('ent2', 'dollar', '#00CC00');
    page.modelEditForm.addAttribute(1, 'key1', 'String', true);
    page.modelEditForm.addAttribute(1, 'key2', 'Integer', false);
    page.modelEditForm.addAttribute(1, 'key3', 'Float', true);
    page.modelEditForm.addAttribute(1, 'key4', 'Timestamp', false);
    page.modelEditForm.addEntity('ent3', 'diamond', '#0000CC');
    page.modelEditForm.addAttribute(1, 'key5', 'Integer', true);
    page.modelEditForm.addAttribute(1, 'key6', 'String', false);
    page.modelEditForm.addEntity('ent4', 'bug', '#CC00CC');
    page.modelEditForm.saveModelEdits();
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
  page.header.twigletTab.startNewJsonTwigletProcess();
  page.formForModals.fillInTextFieldByLabel('Name', twigletName);
  page.formForModals.uploadFileByLabel('Upload JSON', 'twigletUpload.json');
  page.formForModals.clickButton('Create');
  browser.waitForAngular();
}

export function deleteDefaultJsonImportedTwiglet(page: TwigPage) {
  page.navigateTo();
  page.header.twigletTab.startDeleteTwigletProcess(twigletName);
  page.formForModals.fillInOnlyTextField(twigletName);
  page.formForModals.clickButton('Delete');
  browser.waitForAngular();
}
