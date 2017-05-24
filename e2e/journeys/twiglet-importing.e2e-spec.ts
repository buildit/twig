import { escape } from 'querystring';
import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';
import {
  createDefaultJsonImportedTwiglet,
  deleteDefaultJsonImportedTwiglet,
  twigletName
} from '../utils';
const jsonTwiglet = require('../PageObjects/FormsForModals/twigletUpload.json');

describe('Twiglet Lifecycle', () => {
  let page: TwigPage;

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.user.loginDefaultTestUser();
    page.header.twigletTab.deleteTwigletIfNeeded(twigletName, page);
    browser.waitForAngular();
    page.header.goToTab('Twiglet');
    page.header.twigletTab.startNewTwigletProcess();
    page.formForModals.fillInTextFieldByLabel('Name', twigletName);
    page.formForModals.uploadFileByLabel('Upload JSON', 'twigletUpload.json');
    browser.waitForAngular();
  });

  afterAll(() => {
    browser.manage().logs().get('browser').then(function(browserLog) {
      console.log('log: ' + require('util').inspect(browserLog));
    });
    deleteDefaultJsonImportedTwiglet(page);
  });

  it('name and json file are enough to make the form valid', () => {
    expect(page.formForModals.checkIfButtonEnabled('Save Changes')).toBeTruthy();
  });

  it('should close the modal when the submit button is pressed', () => {
    page.formForModals.clickButton('Save Changes');
    browser.waitForAngular();
    page.formForModals.waitForModalToClose();
    expect(page.formForModals.isModalOpen).toBeFalsy();
  });

  it('should redirect to the twiglet page', () => {
    browser.getCurrentUrl().then(url => {
      expect(url.endsWith(`/twiglet/${escape(twigletName)}`)).toEqual(true);
    });
  });

  it('should have the correct number of nodes', () => {
    expect(page.twigletGraph.nodeCount).toEqual(jsonTwiglet.nodes.length);
  });

  it('should have the correct number of links', () => {
    expect(page.twigletGraph.linkCount).toEqual(jsonTwiglet.links.length);
  });
});

