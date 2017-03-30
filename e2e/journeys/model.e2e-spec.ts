import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';
import { append } from '../utils';

describe('Model Lifecycle', () => {
  let page: TwigPage;
  const modelName = 'Test Model';
  describe('Create a Model', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
      page.user.login('ben.hernandez@corp.riglet.io', 'Z3nB@rnH3n');
    });

    it('pops up the create model modal when the button is pressed', () => {
      page.header.modelTab.startNewModelProcess();
      expect(page.modalForm.modalTitle).toEqual('Create New Model');
    });

    it('does not start out showing any form errors', () => {
      expect(page.modalForm.formErrorCount).toEqual(0);
    });

    it('displays an error if the name is empty', () => {
      page.modalForm.makeInputFieldDirtyByLabel('Name');
      expect(page.modalForm.getErrorByLabel('Name')).toEqual('You must enter a name for your model!');
    });

    it('removes the error if a value is put into the name field', () => {
      page.modalForm.fillInTextFieldByLabel('Name', modelName);
      expect(page.modalForm.getErrorByLabel('Name')).toBeUndefined();
    });

    it('should enable the "Save Changes" button once the minimum is filled out', () => {
      expect(page.modalForm.checkIfButtonEnabled('Save Changes')).toBeTruthy();
    });

    it('should close the modal when the submit button is pressed', () => {
      page.modalForm.clickButton('Save Changes');
      expect(page.modalForm.isModalOpen).toBeFalsy();
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

    it('can save the model', () => {
      page.header.modelEditTab.saveModelEdits();
      page.modalForm.fillInOnlyTextField('Test Model Created');
      page.modalForm.clickButton('Save Changes');
      expect(page.modelInfo.entityCount).toEqual(2);
    });
  });

  describe('Deleting Models', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
    });

    it('can bring up the delete model modal', () => {
      page.header.modelTab.startDeleteModelProcess(modelName);
      expect(page.modalForm.modalTitle).toEqual(`Delete ${modelName}`);
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.modalForm.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.modalForm.fillInOnlyTextField(modelName);
      expect(page.modalForm.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.modalForm.clickButton('Delete');
      expect(page.modalForm.isModalOpen).toBeFalsy();
    });
  });
});
