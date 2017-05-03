import { browser } from 'protractor';

import { TwigPage } from '../PageObjects/app.po';
import {
  createDefaultJsonImportedTwiglet,
  deleteDefaultJsonImportedTwiglet,
  twigletName
} from '../utils';

describe('Events and Sequences', () => {
  let page: TwigPage;

  beforeAll(() => {
    page = new TwigPage();
    page.header.twigletTab.deleteTwigletIfNeeded(twigletName, page);
    browser.waitForAngular();
    createDefaultJsonImportedTwiglet(page);
    browser.waitForAngular();
    page.header.goToTab('Events');
  });

  afterAll(() => {
    deleteDefaultJsonImportedTwiglet(page);
  });

  describe('adding an event', () => {
    beforeAll(() => {
      page.header.goToTab('Events');
    });

    it('pops up the create event modal', () => {
      page.header.eventsTab.startNewEventProcess();
      expect(page.formForModals.modalTitle).toEqual('Create New Event');
    });

    it('can save the event', () => {
      page.formForModals.fillInTextFieldByLabel('Name', 'New Event');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('adds the event', () => {
      expect(page.eventsList.eventCount).toEqual(3);
    });
  });
});
