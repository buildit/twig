import { browser } from 'protractor';
import { TwigPage } from './PageObjects/app.po';

describe('twig App', function() {
  let page: TwigPage;
  const twigletName = 'Test Twiglet';

  describe('landing page', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
    });

    it('should have an initial title of "Twig"', () => {
      expect(page.header.title).toEqual('Twig');
    });

    it('should start on the "Twiglet" tab', () => {
      expect(page.header.activeTab).toEqual('Twiglet');
    });
  });

  describe('logging in', () => {
    beforeAll(() => {
      page = new TwigPage();
      page.navigateTo();
    });

    it('can login', () => {
      page.user.login('ben.hernandez@corp.riglet.io', 'Z3nB@rnH3n');
      expect(page.user.isLoggedIn).toBeTruthy();
    });

    it('can logout', () => {
      page.user.logout();
      expect(page.user.isLoggedIn).toBeFalsy();
    });
  });

  describe('Twiglet Lifecycle', () => {
    describe('Create a Twiglet', () => {
      beforeAll(() => {
        page = new TwigPage();
        page.navigateTo();
        page.user.login('ben.hernandez@corp.riglet.io', 'Z3nB@rnH3n');
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
        page.modalForm.selectOptionByLabel('Model', 'bsc');
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

    describe('Deleting Twiglets', () => {
      beforeAll(() => {
        page = new TwigPage();
        page.navigateTo();
      });

      it('can bring up the delete twiglet modal', () => {
        page.header.twigletTab.startDeleteTwgiletProcess(twigletName);
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
      });
    });
  });
});
