import { escape } from 'querystring';
import { browser } from 'protractor';

import { TwigPage } from '../PageObjects/app.po';
import {
  createDefaultJsonImportedTwiglet,
  deleteDefaultJsonImportedTwiglet,
  twigletName
} from '../utils';

describe('View Lifecycle', () => {
  let page: TwigPage;
  const viewName = 'Test View';

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    createDefaultJsonImportedTwiglet(page);
  });

  afterAll(() => {
    deleteDefaultJsonImportedTwiglet(page);
  });

  describe('Create a View', () => {
    beforeAll(() => {
      page.header.goToTab('View');
    });

    it('pops up the create view modal when the button is pressed', () => {
      page.header.goToTab('Environment');
      page.header.environmentTab.toggleNodeLabels();
      page.header.viewTab.startNewViewProcess();
      expect(page.modalForm.modalTitle).toEqual('Create New View');
    });

    it('does not start out showing any form errors', () => {
      expect(page.modalForm.formErrorCount).toEqual(0);
    });

    it('displays an error if the save button is clicked with no name', () => {
      page.modalForm.clickButton('Save');
      expect(page.modalForm.getErrorByLabel('Name')).toEqual('A name is required.');
    });

    it('should close the modal when the submit button is clicked with a name', () => {
      page.modalForm.fillInTextFieldByLabel('Name', viewName);
      page.modalForm.clickButton('Save');
      expect(page.modalForm.isModalOpen).toBeFalsy();
    });

    it('should redirect to the view page', () => {
      expect(browser.getCurrentUrl()).toEndWith(`/view/${escape(viewName)}`);
    });
  });

  describe('Viewing a View', () => {
    beforeAll(() => {
      page.header.goToTab('View');
    });

    it('should redirect to the view page', () => {
      expect(browser.getCurrentUrl()).toEndWith(`/view/${escape(viewName)}`);
    });

    it('displays the view when view is clicked', () => {
      page.header.viewTab.startViewViewProcess(viewName);
      expect(page.twigletGraph.checkNodeLabels('node5-1', 'invisible')).toBeFalsy();
    });

    it('brings up the save view modal when the overwrite button is clicked', () => {
      page.header.viewTab.startSaveViewProcess(viewName);
      expect(page.modalForm.modalTitle).toEqual(`Overwrite ${viewName}`);
    });

    it('should close the modal when the save button is clicked', () => {
      page.modalForm.clickButton('Save');
      expect(page.modalForm.isModalOpen).toBeFalsy();
    });
  });

  describe('Deleting Views', () => {
    beforeAll(() => {
      page.header.goToTab('View');
    });

    it('can bring up the delete view modal', () => {
      page.header.viewTab.startDeleteViewProcess(viewName);
      expect(page.modalForm.modalTitle).toEqual(`Delete ${viewName}`);
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.modalForm.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.modalForm.fillInOnlyTextField(viewName);
      expect(page.modalForm.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.modalForm.clickButton('Delete');
      expect(page.modalForm.isModalOpen).toBeFalsy();
    });
  });
});
