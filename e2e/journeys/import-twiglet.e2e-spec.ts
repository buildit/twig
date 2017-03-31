import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';
import { createDefaultModel, deleteDefaultModel } from '../utils';

fdescribe('Twiglet Lifecycle', () => {
  let page: TwigPage;
  const twigletName = 'JSON Twiglet';

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.user.loginDefaultTestUser();
    page.header.twigletTab.startNewTwigletProcess();
    page.modalForm.fillInTextFieldByLabel('Name', twigletName);
    page.modalForm.uploadFileByLabel('Upload JSON', 'twigletUpload.json');
  });

  it('name and json file are enough to make the form valid', () => {
    expect(page.modalForm.checkIfButtonEnabled('Save Changes')).toBeTruthy();
  });

  it('should close the modal when the submit button is pressed', () => {
    page.modalForm.clickButton('Save Changes');
    expect(page.modalForm.isModalOpen).toBeFalsy();
  });

  it('should redirect to the twiglet page', () => {
    expect(browser.getCurrentUrl()).toEndWith(`/twiglet/${twigletName}`);
  });
});

