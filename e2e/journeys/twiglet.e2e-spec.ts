import { browser } from 'protractor';

import { TwigPage } from '../PageObjects/app.po';
import { createDefaultModel, deleteDefaultModel, modelName } from '../utils';

describe('Twiglet Lifecycle', () => {
  let page: TwigPage;
  const twigletName = 'Test Twiglet';

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.user.login('ben.hernandez@corp.riglet.io', 'Z3nB@rnH3n');
    // if (page.header.modelTab.deleteModelIfNeeded(modelName) === true) {
    //   deleteDefaultModel(page);
    // }
    // page.header.modelTab.deleteModelIfNeeded(modelName)
    page.header.modelTab.deleteModelIfNeeded(modelName, page);
    browser.waitForAngular();
    createDefaultModel(page);
  });

  afterAll(() => {
    deleteDefaultModel(page);
  });

  describe('Create a Twiglet', () => {
    beforeAll(() => {
      page.header.goToTab('Twiglet');
    });

    it('pops up the create twiglet modal when the button is pressed', () => {
      page.header.twigletTab.startNewTwigletProcess();
      expect(page.modalForm.modalTitle).toEqual('Create New Twiglet');
    });

    it('starts with the "Save Changes" being disabled', () => {
      expect(page.modalForm.checkIfButtonEnabled('Save Changes')).toBeFalsy();
    });

    it('does not start out showing any form errors', () => {
      expect(page.modalForm.formErrorCount).toEqual(0);
    });

    it('displays an error if the name is empty', () => {
      page.modalForm.makeInputFieldDirtyByLabel('Name');
      expect(page.modalForm.getErrorByLabel('Name')).toEqual('A name is required.');
    });

    it('removes the error if a value is put into the name field', () => {
      page.modalForm.fillInTextFieldByLabel('Name', twigletName);
      expect(page.modalForm.getErrorByLabel('Name')).toBeUndefined();
    });

    it('displays an error if the model is not selected', () => {
      page.modalForm.makeSelectDirtyByLabel('Model');
      expect(page.modalForm.getErrorByLabel('Model')).toEqual('A model from the list is required.');
    });

    it('removes the error if a model is selected', () => {
      page.modalForm.selectOptionByLabel('Model', modelName);
      expect(page.modalForm.getErrorByLabel('Model')).toBeUndefined();
    });

    it('should enable the "Save Changes" button once the minimum is filled out', () => {
      expect(page.modalForm.checkIfButtonEnabled('Save Changes')).toBeTruthy();
    });

    it('should close the modal when the submit button is pressed', () => {
      page.modalForm.clickButton('Save Changes');
      expect(page.modalForm.isModalOpen).toBeFalsy();
    });
  });

  describe('Adding nodes and links', () => {
    beforeAll(() => {
      page.header.goToTab('Edit');
      page.header.twigletEditTab.startTwigletEditProcess();
      browser.waitForAngular();
    });

    it('can add a node to the canvas', () => {
      page.header.twigletEditTab.addNodeByTooltip('ent1');
      expect(page.twigletGraph.nodeCount).toEqual(1);
    });

    it('pops up the add node modal', () => {
      expect(page.modalForm.modalTitle).toEqual('Node Editor');
    });

    it('can save the node', () => {
      page.modalForm.fillInTextFieldByLabel('Name', 'node 1');
      page.modalForm.clickButton('Submit');
      expect(page.modalForm.isModalOpen).toBeFalsy();
    });

    it('can save the edits', () => {
      page.header.twigletEditTab.saveEdits();
    });
  });

  describe('Editing the model', () => {
    beforeAll(() => {
      page.modalForm.fillInOnlyTextField('Commit message');
      page.modalForm.clickButton('Save Changes');
      page.header.goToTab('Edit');
      page.header.twigletEditTab.startTwigletModelEditProcess();
    });

    it('opens the model form', () => {
      expect(page.twigletModel.isOpen).toBeTruthy();
    });

    it('allows the user to add an entity', () => {
      page.modelEditForm.addEntity('zzzzz', 'dollar', '#008800', '30');
      expect(page.twigletModel.entityCount).toEqual(4);
    });

    it('allows the user to remove an entity', () => {
      page.modelEditForm.clickButton('minus-circle');
      expect(page.twigletModel.entityCount).toEqual(3);
    });

    it('does not allow the user to remove an entity that is in the twiglet', () => {
      expect(page.twigletModel.removeButtonCount).toEqual(2);
    });

    it('can save the edits', () => {
      page.header.twigletEditTab.saveEdits();
    });
  });

  describe('Deleting Twiglets', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
    });

    it('can bring up the delete twiglet modal', () => {
      page.header.twigletTab.startDeleteTwigletProcess(twigletName);
      expect(page.modalForm.modalTitle).toEqual(`Delete ${twigletName}`);
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.modalForm.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.modalForm.fillInOnlyTextField(twigletName);
      expect(page.modalForm.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.modalForm.clickButton('Delete');
      expect(page.modalForm.isModalOpen).toBeFalsy();
      browser.waitForAngular();
    });
  });
});
