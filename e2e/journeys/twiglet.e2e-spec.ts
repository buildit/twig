import { browser } from 'protractor';

import { TwigPage } from '../PageObjects/app.po';
import { EditNode } from './../PageObjects/EditNodeModal/index';
import { createDefaultModel, deleteDefaultModel, modelName } from '../utils';

describe('Twiglet Lifecycle', () => {
  let page: TwigPage;
  const twigletName = 'Web Test Twiglet';

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.user.loginDefaultTestUser();
    browser.waitForAngular();
    page.header.twigletTab.deleteTwigletIfNeeded(twigletName, page);
    browser.waitForAngular();
    page.header.modelTab.deleteModelIfNeeded(modelName, page);
    browser.waitForAngular();
    createDefaultModel(page);
  });

  afterAll(() => {
    // browser.manage().logs().get('browser').then(function(browserLog) {
    //   console.log('log: ' + require('util').inspect(browserLog));
    // });
    deleteDefaultModel(page);
  });

  describe('Create a Twiglet', () => {
    beforeAll(() => {
      page.header.goToTab('Twiglet');
    });

    it('pops up the create twiglet modal when the button is pressed', () => {
      page.header.twigletTab.startNewTwigletProcess();
      expect(page.formForModals.modalTitle).toEqual('Create New Twiglet');
    });

    it('starts with the "Create" being disabled', () => {
      expect(page.formForModals.checkIfButtonEnabled('Create')).toBeFalsy();
    });

    it('does not start out showing any form errors', () => {
      expect(page.formForModals.formErrorCount).toEqual(0);
    });

    it('displays an error if the name is empty', () => {
      page.formForModals.makeInputFieldDirtyByLabel('Name');
      expect(page.formForModals.getErrorByLabel('Name')).toEqual('A name is required.');
    });

    it('removes the error if a value is put into the name field', () => {
      page.formForModals.fillInTextFieldByLabel('Name', twigletName);
      expect(page.formForModals.getErrorByLabel('Name')).toBeUndefined();
    });

    it('displays an error if the model is not selected', () => {
      page.formForModals.makeSelectDirtyByLabel('Model');
      expect(page.formForModals.getErrorByLabel('Model')).toEqual('A model from the list is required.');
    });

    it('removes the error if a model is selected', () => {
      page.formForModals.selectOptionByLabel('Model', modelName);
      expect(page.formForModals.getErrorByLabel('Model')).toBeUndefined();
    });

    it('should enable the "Create" button once the minimum is filled out', () => {
      expect(page.formForModals.checkIfButtonEnabled('Create')).toBeTruthy();
    });

    it('should close the modal when the submit button is pressed', () => {
      page.formForModals.clickButton('Create');
      page.formForModals.waitForModalToClose();
      browser.waitForAngular();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });
  });

  describe('Adding nodes and links', () => {
    beforeAll(() => {
      page.header.twigletEditTab.startTwigletEditProcess();
      browser.waitForAngular();
    });

    it('can add a node to the canvas', () => {
      page.header.twigletEditTab.addNodeByTooltip('ent1');
      expect(page.twigletGraph.nodeCount).toEqual(1);
    });

    it('pops up the add node modal', () => {
      expect(page.formForModals.modalTitle).toEqual('Node Editor');
    });

    it('can save the node', () => {
      page.formForModals.fillInTextFieldByLabel('Name', 'node 1');
      const editNode = new EditNode();
      page.formForModals.clickButton('Show Attributes');
      page.formForModals.clickButtonByClassName('fa-plus');
      editNode.fillKey(1, 'key1');
      editNode.fillValue(1, 'value1');
      page.formForModals.clickButtonByClassName('fa-plus');
      editNode.fillKey(2, 'key2');
      editNode.fillValue(2, 'value2');
      page.formForModals.clickButton('Add Node');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });
  });

  describe('same-type-nodes add attributes keys to each other', () => {
    it('adds attributes to other nodes', () => {
      page.header.twigletEditTab.addNodeByTooltip('ent1');
      const editNode = new EditNode();
      expect(editNode.getKey(1)).toEqual(`key1 (string)`);
      expect(editNode.getKey(2)).toEqual(`key2 (string)`);
      page.formForModals.clickButton('Delete');
    });
  });

  describe('switching a node type', () => {
    let editNode: EditNode;
    let attributes: { tagName: string, key: string, value: string }[];
    const nodeName = 'Switching Type 2 -> 3';
    const requiredSymbol = '*';
    const diamond = '';
    beforeAll(() => {
      editNode = new EditNode();
      page.header.twigletEditTab.addNodeByTooltip('ent2', { x: 10, y: 100 });
      page.formForModals.fillInTextFieldByLabel('Name', nodeName);
      editNode.fillValue(1, 'abc 123 @#$');
      editNode.fillValue(2, 2);
      editNode.fillValue(3, '3.5');
      page.formForModals.clickButton('Add Node');
    });

    it('starts the editing process', () => {
      page.twigletGraph.startEditing(nodeName);
      return editNode.attributes.then(_attributes => {
        attributes = _attributes;
        expect(attributes.length).toEqual(4);
      });
    });

    it('can change the type of node', () => {
      editNode.switchType('ent3');
      browser.sleep(5000);
    });

    it('updates the attributes on a node change', () => {
      return editNode.attributes.then(_attributes => {
        attributes = _attributes;
        expect(attributes.length).toEqual(5);
      });
    });

    it('keeps the old attributes with values', () => {
      const oldFilledInKeys = ['key1', 'key2', 'key3'];
      const attributeKeys = attributes.map(attribute => attribute.key);
      expect(attributeKeys.filter(key => oldFilledInKeys.some(oldKey => key.includes(oldKey))).length).toEqual(3);
    });

    it('removes the requirements from old keys', () => {
      const oldRequirements = ['key1', 'key3'];
      const attributeKeys = attributes.map(attribute => attribute.key);
      const updatedVersionsOfOldKeys = attributeKeys.filter(key => oldRequirements.some(oldKey => key.includes(oldKey)));
      expect(updatedVersionsOfOldKeys.every(key => !key.includes(requiredSymbol))).toBeTruthy();
    })

    it('gets rid of old attributes without a filled in value', () => {
      const shouldBeGone = 'key4';
      const attributeKeys = attributes.map(attribute => attribute.key);
      expect(attributeKeys.every(key => !key.includes(shouldBeGone))).toBeTruthy();
    });

    it('puts a required on new required attributes', () => {
      const shouldBeStarred = 'key5';
      const shouldBeStarredKey = attributes.map(attribute => attribute.key).filter(key => key.includes(shouldBeStarred))[0];
      expect(shouldBeStarredKey.includes(requiredSymbol)).toBeTruthy();
    });

    it('updates the canvas', () => {
      editNode.fillValue(1, 5);
      page.formForModals.clickButton('Update Node');
      page.formForModals.waitForModalToClose();
      expect(page.twigletGraph.getNodeType(nodeName)).toEqual(diamond);
    });
  });

  describe('required model attributes', () => {
    let attributes: { tagName: string, key: string, value: string }[];
    let editNode: EditNode;
    beforeAll(() => {
      editNode = new EditNode();
      page.header.twigletEditTab.addNodeByTooltip('ent2');
      page.formForModals.fillInTextFieldByLabel('Name', 'node 2');
      return editNode.attributes.then(_attributes => {
        attributes = _attributes;
      });
    });

    it('puts required on the correct attributes', () => {
      const required = ['key1', 'key3'];
      attributes
        .filter(attribute => attribute.tagName === 'label')
        .filter(attribute => attribute.key.startsWith('*'))
        .forEach(attribute => {
          expect(required.some(key => attribute.key.includes(key))).toBeTruthy();
        });
    });

    it('does not put required on incorrect attributes', () => {
      const notRequired = ['key2', 'key4'];
      attributes
        .filter(attribute => attribute.tagName === 'label')
        .filter(attribute => !attribute.key.startsWith('*'))
        .forEach(attribute => {
          expect(notRequired.some(key => attribute.key.includes(key))).toBeTruthy();
        });
    });

    describe('string types', () => {
      it('allows anything inside of strings', () => {
        editNode.fillValue(1, 'abc 123 @#$');
        expect(editNode.getError(1)).toBeUndefined();
      });
    });

    describe('integer types', () => {
      it('does not allow strings', () => {
        editNode.fillValue(2, 'a');
        expect(editNode.getError(2)).not.toBeUndefined();
      });

      it('does not allow decimals', () => {
        editNode.fillValue(2, '2.5');
        expect(editNode.getError(2)).not.toBeUndefined();
      });

      it('allows integers', () => {
        editNode.fillValue(2, 2);
        expect(editNode.getError(2)).toBeUndefined();
      });
    });

    describe('float types', () => {
      it('does not allow strings', () => {
        editNode.fillValue(3, 'a');
        expect(editNode.getError(3)).not.toBeUndefined();
      });

      it('allows decimals', () => {
        editNode.fillValue(3, '3.5');
        expect(editNode.getError(3)).toBeUndefined();
      });

      it('allows integers', () => {
        editNode.fillValue(3, 3);
        expect(editNode.getError(3)).toBeUndefined();
      });
    });

    describe('dates', () => {
      it('does not allow non dates', () => {
        editNode.fillValue(4, 'a');
        expect(editNode.getError(4)).not.toBeUndefined();
      });

      it('can process dates', () => {
        editNode.fillValue(4, '2017/04/25');
        expect(editNode.getError(4)).toBeUndefined();
      });
    });

    it('can save the node', () => {
      page.formForModals.clickButton('Add Node');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('can save the edits', () => {
      page.header.twigletEditTab.saveEdits();
      page.formForModals.fillInOnlyTextField('Commit message');
      page.formForModals.clickButton('Save Changes');
    });
  });

  describe('Editing the model', () => {
    beforeAll(() => {
      browser.waitForAngular();
      page.header.twigletEditTab.startTwigletEditProcess();
      page.header.twigletEditTab.startTwigletModelEditProcess();
    });

    it('opens the model form', () => {
      expect(page.twigletModel.isOpen).toBeTruthy();
    });

    it('allows the user to add an entity', () => {
      page.modelEditForm.addEntity('zzzzz', 'dollar', '#008800');
      expect(page.twigletModel.entityCount).toEqual(5);
    });

    it('allows the user to remove an entity', () => {
      page.modelEditForm.clickButton('fa-trash');
      expect(page.twigletModel.entityCount).toEqual(4);
    });

    it('does not allow the user to remove an entity that is in the twiglet', () => {
      expect(page.twigletModel.removeButtonCount).toEqual(1);
    });

    it('can save the edits', () => {
      page.header.twigletEditTab.saveEdits();
    });
  });

  describe('Clone Twiglet', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
      page.header.twigletTab.deleteTwigletIfNeeded(`${twigletName} - copy`, page);
    });

    it('can bring up a clone twiglet modal', () => {
      page.header.twigletTab.startCloneTwigletProcess(twigletName);
      expect(page.formForModals.modalTitle).toEqual(`Clone ${twigletName}`);
    });

    it('should close the modal when the create button button is pressed', () => {
      page.formForModals.clickButton('Create');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
      browser.waitForAngular();
    });
  });

  describe('Deleting Twiglets', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
    });

    it('can bring up the delete twiglet modal', () => {
      page.header.twigletTab.startDeleteTwigletProcess(twigletName);
      expect(page.formForModals.modalTitle).toEqual(`Delete ${twigletName}`);
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.formForModals.fillInOnlyTextField(twigletName);
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.formForModals.clickButton('Delete');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
      page.formForModals.waitForModalToClose();
      browser.waitForAngular();
    });
  });
});
