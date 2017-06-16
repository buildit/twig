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
  const newViewName = 'Test View 2';

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.user.loginDefaultTestUser();
    page.header.twigletTab.deleteTwigletIfNeeded(twigletName, page);
    browser.waitForAngular();
    createDefaultJsonImportedTwiglet(page);
    browser.waitForAngular();
  });

  afterAll(() => {
    browser.manage().logs().get('browser').then(function(browserLog) {
      console.log('log: ' + require('util').inspect(browserLog));
    });
    deleteDefaultJsonImportedTwiglet(page);
  });

  describe('Create a View', () => {
    beforeAll(() => {
      page.header.goToTab('View');
    });

    it('pops up the create view modal when the button is pressed', () => {
      page.header.goToTab('Environment');
      page.header.environmentTab.toggleNodeLabels();
      page.twigletFilters.filters[0].type = 'ent1';
      page.header.viewTab.startNewViewProcess();
      expect(page.formForModals.modalTitle).toEqual('Create New View');
    });

    it('does not start out showing any form errors', () => {
      expect(page.formForModals.formErrorCount).toEqual(0);
    });

    it('displays an error if the save button is clicked with no name', () => {
      page.formForModals.clickButton('Save');
      expect(page.formForModals.getErrorByLabel('Name')).toEqual('A name is required.');
    });

    it('should close the modal when the submit button is clicked with a name', () => {
      page.formForModals.fillInTextFieldByLabel('Name', viewName);
      page.formForModals.clickButton('Save');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('should redirect to the view page', () => {
      browser.getCurrentUrl().then(url => {
        expect(url.endsWith(`/view/${escape(viewName)}`)).toEqual(true);
      });
    });

    it('dropdown should display the correct number of views', () => {
      page.header.viewTab.openViewMenu();
      expect(page.header.viewTab.viewCount).toEqual(3);
    });
  });

  describe('Viewing a View', () => {
    beforeAll(() => {
      page.header.goToTab('View');
    });

    it('should redirect to the view page', () => {
      browser.getCurrentUrl().then(url => {
        expect(url.endsWith(`/view/${escape(viewName)}`)).toEqual(true);
      });
    });

    it('displays the view when view is clicked', () => {
      page.header.viewTab.startViewViewProcess(viewName);
      expect(page.twigletGraph.checkNodeLabels('node1-1', 'invisible')).toBeFalsy();
    });

    it('displays the correct number of nodes', () => {
      expect(page.twigletGraph.nodeCount).toEqual(2);
    });
  });

  describe('Overwriting a View', () => {
    it('brings up the save view modal when the overwrite button is clicked', () => {
      page.header.goToTab('Environment');
      page.header.environmentTab.toggleNodeLabels();
      page.header.viewTab.startSaveViewProcess(viewName);
      expect(page.formForModals.modalTitle).toEqual(`Overwrite ${viewName}`);
    });

    it('should close the modal when the save button is clicked', () => {
      page.formForModals.fillInTextFieldByLabel('Name', newViewName);
      page.formForModals.clickButton('Save');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('should redirect to the view page with new name', () => {
      browser.getCurrentUrl().then(url => {
        expect(url.endsWith(`/view/${escape(newViewName)}`)).toEqual(true);
      });
    });

    it('displays the updated view', () => {
      expect(page.twigletGraph.checkNodeLabels('node1-1', 'invisible')).toBeTruthy();
    });
  });

  describe('Deleting Views', () => {
    beforeAll(() => {
      page.header.goToTab('View');
    });

    it('can bring up the delete view modal', () => {
      page.header.viewTab.startDeleteViewProcess(newViewName);
      expect(page.formForModals.modalTitle).toEqual(`Delete ${newViewName}`);
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.formForModals.fillInOnlyTextField(newViewName);
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.formForModals.clickButton('Delete');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('should redirect to the twiglet page', () => {
      browser.getCurrentUrl().then(url => {
        expect(url.endsWith(`/twiglet/${escape(twigletName)}`)).toEqual(true);
      });
    });
  });
});
