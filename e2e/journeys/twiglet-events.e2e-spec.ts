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

  describe('previewing an event', () => {
    beforeAll(() => {
      page.header.goToTab('Edit');
      page.header.twigletEditTab.startTwigletEditProcess();
      page.header.twigletEditTab.addNodeByTooltip('ent1');
      page.formForModals.fillInTextFieldByLabel('Name', 'node 1');
      page.formForModals.clickButton('Submit');
      page.formForModals.waitForModalToClose();
      page.header.twigletEditTab.saveEdits();
      page.formForModals.fillInOnlyTextField('Commit message');
      page.formForModals.clickButton('Save Changes');
      page.header.goToTab('Events');
    });

    it('shows the correct number of nodes for event', () => {
      page.eventsList.previewEvent('New Event');
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });
  });

  describe('creating a sequence', () => {
    it('can create a sequence', () => {
      // page.eventsList.toggleEventCheck('event1');
      // page.eventsList.toggleEventCheck('event2');
      page.header.eventsTab.openSequenceMenu();
      page.header.eventsTab.startNewSequenceProcess();
      expect(page.formForModals.modalTitle).toEqual('Create New Sequence');
    });

    it('can save the sequence', () => {
      page.formForModals.fillInTextFieldByLabel('Name', 'sequence2');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('dropdown should display the correct number of sequences', () => {
      page.header.eventsTab.openSequenceMenu();
      expect(page.header.eventsTab.sequenceCount).toEqual(2);
    });
  });

  describe('deleting an event', () => {
    beforeAll(() => {
      page.header.goToTab('Events');
    });

    it('can bring up the delete view modal', () => {
      page.eventsList.startDeleteEventProcess('New Event');
      expect(page.formForModals.modalTitle).toEqual('Delete New Event');
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.formForModals.fillInOnlyTextField('New Event');
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.formForModals.clickButton('Delete');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('deletes the event', () => {
      expect(page.eventsList.eventCount).toEqual(2);
    });
  });
});
