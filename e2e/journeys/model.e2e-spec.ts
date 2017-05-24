import { browser, element } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';

describe('Model Lifecycle', () => {
  let page: TwigPage;
  const modelName = 'Test Model';

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.user.login('ben.hernandez@corp.riglet.io', 'Z3nB@rnH3n');
    page.header.modelTab.deleteModelIfNeeded(modelName, page);
    browser.waitForAngular();
  });

  afterAll(() => {
    browser.manage().logs().get('browser').then(function(browserLog) {
      console.log('log: ' + require('util').inspect(browserLog));
    });
  });

  describe('Create a Model', () => {
    beforeAll(() => {
      page.header.goToTab('Model');
    });

    it('pops up the create model modal when the button is pressed', () => {
      page.header.modelTab.startNewModelProcess();
      expect(page.formForModals.modalTitle).toEqual('Create New Model');
    });

    it('does not start out showing any form errors', () => {
      expect(page.formForModals.formErrorCount).toEqual(0);
    });

    it('displays an error if the name is empty', () => {
      page.formForModals.makeInputFieldDirtyByLabel('Name');
      expect(page.formForModals.getErrorByLabel('Name')).toEqual('You must enter a name for your model!');
    });

    it('removes the error if a value is put into the name field', () => {
      page.formForModals.fillInTextFieldByLabel('Name', modelName);
      expect(page.formForModals.getErrorByLabel('Name')).toBeUndefined();
    });

    it('should enable the "Save Changes" button once the minimum is filled out', () => {
      expect(page.formForModals.checkIfButtonEnabled('Save Changes')).toBeTruthy();
    });

    it('should close the modal when the submit button is pressed', () => {
      page.formForModals.clickButton('Save Changes');
      browser.waitForAngular();
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('should allow us to edit the model', () => {
      page.header.goToTab('Edit');
      page.header.modelEditTab.startModelEditProcess();
      expect(page.modelEditForm.isOpen).toBeTruthy();
    });

    it('should start with no entities', () => {
      expect(page.modelEditForm.entityCount).toEqual(0);
    });

    it('allows the user to add an entity', () => {
      page.modelEditForm.addEntity('zzzzz', 'dollar', '#008800', '30');
      expect(page.modelEditForm.entityCount).toEqual(1);
    });

    it('alphabetizes the entities by type as they are added', () => {
      page.modelEditForm.addEntity('aaaaa', 'car', '#880088', '40');
      expect(page.modelEditForm.row[2].type).toEqual('zzzzz');
    });

    it('allows the user to remove an entity', () => {
      page.modelEditForm.clickButton('minus-circle');
      expect(page.modelEditForm.entityCount).toEqual(1);
    });

    it('can save the model', () => {
      page.header.modelEditTab.saveModelEdits();
      page.formForModals.fillInOnlyTextField('Test Model Created');
      page.formForModals.clickButton('Save Changes');
      expect(page.modelInfo.entityCount).toEqual(1);
    });
  });

  describe('Deleting Models', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
    });

    it('can bring up the delete model modal', () => {
      page.header.modelTab.startDeleteModelProcess(modelName);
      expect(page.formForModals.modalTitle).toEqual(`Delete ${modelName}`);
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.formForModals.fillInOnlyTextField(modelName);
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.formForModals.clickButton('Delete');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });
  });
});
