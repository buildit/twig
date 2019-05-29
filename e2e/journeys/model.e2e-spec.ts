import { browser, element } from 'protractor';

import { TwigPage } from '../PageObjects/app.po';

describe('Model Lifecycle', () => {
  let page: TwigPage;
  const modelName = 'Test Model';

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.user.loginDefaultTestUser();
    page.header.modelTab.deleteModelIfNeeded(modelName, page);
    browser.waitForAngular();
  });

  afterAll(() => {
    // browser.manage().logs().get('browser').then(function(browserLog) {
    //   console.log('log: ' + require('util').inspect(browserLog));
    // });
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

    it('should enable the "Create" button once the minimum is filled out', () => {
      expect(page.formForModals.checkIfButtonEnabled('Create')).toBeTruthy();
    });

    it('should close the modal when the submit button is pressed', () => {
      page.formForModals.clickButton('Create');
      browser.waitForAngular();
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('should allow us to edit the model', () => {
      page.header.modelEditTab.startModelEditProcess();
      expect(page.modelEditForm.isOpen).toBeTruthy();
    });

    it('should start with no entities', () => {
      expect(page.modelEditForm.entityCount).toEqual(0);
    });

    it('allows the user to add an entity', () => {
      page.modelEditForm.addEntity('zzzzz', 'dollar', '#008800');
      page.modelEditForm.addAttribute(1, 'attr1', 'String', false);
      expect(page.modelEditForm.entityCount).toEqual(1);
    });

    it('adds new entities to the top of the form', () => {
      page.modelEditForm.addEntity('aaaaa', 'car', '#880088');
      expect(page.modelEditForm.row[2].type).toEqual('zzzzz');
    });

    it('allows the user to remove an entity', () => {
      page.modelEditForm.clickButton('fa-trash');
      expect(page.modelEditForm.entityCount).toEqual(1);
    });

    it('can save the model', () => {
      page.modelEditForm.saveModelEdits();
      page.formForModals.fillInOnlyTextField('Test Model Created');
      page.formForModals.clickButton('Save Changes');
      browser.waitForAngular();
      expect(page.modelInfo.entityCount).toEqual(1);
    });
  });

  describe('Editing Models', () => {
    it('can start the editing process', () => {
      page.modelEditForm.startEditing();
      expect(page.modelEditForm.isOpen).toBeTruthy();
    });

    it('can add an entity', () => {
      page.modelEditForm.startAddingEntity();
      expect(page.modelEditForm.entityCount).toEqual(2);
    });

    it('makes the form invalid when initially adding an entity', () => {
      expect(page.modelEditForm.isReadyToSave).toBeFalsy();
    })

    it('can fill in the type but that is not enough to make the form valid', () => {
      page.modelEditForm.row[1].type = 'aaaaaa';
      expect(page.modelEditForm.isReadyToSave).toBeFalsy();
    });

    it('can fill in the icon and with the type that is enough to make the form valid', () => {
      page.modelEditForm.row[1].icon = 'bug';
      expect(page.modelEditForm.isReadyToSave).toBeTruthy();
    });

    let attribute: { name: string, type: string, required: boolean };

    it('adding an attribute makes the form invalid again', () => {
      page.modelEditForm.startAddingAttribute(1).then(rs => attribute = rs);
      expect(page.modelEditForm.isReadyToSave).toBeFalsy();
    });

    it('attribute name is not enough to make the form valid', () => {
      attribute.name = 'attr1';
      expect(page.modelEditForm.isReadyToSave).toBeFalsy();
    });

    it('filling in the name and the type is enough to make the form valid', () => {
      attribute.type = 'String';
      expect(page.modelEditForm.isReadyToSave).toBeTruthy();
    });

    it('can save the changes', () => {
      page.modelEditForm.saveModelEdits();
      page.formForModals.fillInOnlyTextField('Making some changes');
      page.formForModals.clickButton('Save Changes');
      browser.waitForAngular();
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
      expect(page.formForModals.modalTitle).toEqual(`Delete ${modelName}`);
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.formForModals.fillInOnlyTextField(modelName);
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    // it('should close the modal when the Delete button is pressed', () => {
    //   page.formForModals.clickButton('Delete');
    //   page.formForModals.waitForModalToClose();
    //   expect(page.formForModals.isModalOpen).toBeFalsy();
    // });
  });
});
