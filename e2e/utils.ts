import { TwigPage } from './PageObjects/app.po';

const modelName = 'Default Test Model';
export function append(string) {
  return `${string} (╯°□°）╯︵ ┻━┻`;
}

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
    page.header.goToTab('Edit');
    page.header.modelEditTab.startModelEditProcess();
    page.modelEditForm.addEntity('ent1', 'ban', '#CC0000', '30');
    page.modelEditForm.addEntity('ent2', 'dollar', '#00CC00', '40');
    page.modelEditForm.addEntity('ent3', 'diamond', '#0000CC', '20');
    page.header.modelEditTab.saveModelEdits();
    page.modalForm.fillInOnlyTextField('Test Model Created');
    page.modalForm.clickButton('Save Changes');
  });
}

export function deleteDefaultModel(page: TwigPage) {
    page.header.modelTab.startDeleteModelProcess(modelName);
    page.modalForm.fillInOnlyTextField(modelName);
    page.modalForm.clickButton('Delete');
}
