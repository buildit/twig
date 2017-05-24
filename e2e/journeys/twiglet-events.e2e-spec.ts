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
    page.navigateTo();
    page.user.loginDefaultTestUser();
    page.header.twigletTab.deleteTwigletIfNeeded(twigletName, page);
    browser.waitForAngular();
    createDefaultJsonImportedTwiglet(page);
    browser.waitForAngular();
    page.header.goToTab('Events');
  });

  afterAll(() => {
    browser.manage().logs().get('browser').then(function(browserLog) {
      console.log('log: ' + require('util').inspect(browserLog));
    });
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
      page.formForModals.fillInTextFieldByLabel('Name', 'event3');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('adds the event', () => {
      expect(page.eventsList.eventCount).toEqual(3);
    });
  });

  describe('previewing an event', () => {
    beforeAll(() => {
      browser.waitForAngular();
      page.header.goToTab('Edit');
      page.header.twigletEditTab.startTwigletEditProcess();
      page.header.twigletEditTab.addNodeByTooltip('ent1');
      page.formForModals.fillInTextFieldByLabel('Name', 'node 1');
      page.formForModals.clickButton('Submit');
      page.formForModals.waitForModalToClose();
      page.header.twigletEditTab.saveEdits();
      page.formForModals.fillInOnlyTextField('Commit message');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      page.header.goToTab('Events');
    });

    it('shows the correct number of nodes for event', () => {
      page.eventsList.previewEvent('event2');
      expect(page.twigletGraph.nodeCount).toEqual(15);
      page.eventsList.previewEvent('event2');
    });
  });

  describe('creating a sequence', () => {
    it('can create a sequence', () => {
      page.header.eventsTab.startNewEventProcess();
      page.formForModals.fillInTextFieldByLabel('Name', 'event4');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      page.eventsList.toggleEventCheck('event1');
      page.eventsList.toggleEventCheck('event3');
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

  describe('viewing a sequence', () => {
    it('shows the correct checked events', () => {
      page.header.eventsTab.startViewSequenceProcess('sequence2');
      expect(page.eventsList.checkedEvent('event3')).toBeTruthy();
    });

    it('ends the play sequence and displays current twiglet', () => {
      page.header.eventsTab.startSequencePlay();
      page.header.eventsTab.waitForPlayback();
      expect(page.twigletGraph.linkCount).toEqual(15);
    });
  });

  describe('overwriting a sequence', () => {
    it('brings up the save sequence modal when save is clicked', () => {
      page.header.eventsTab.openSequenceMenu();
      page.header.eventsTab.startViewSequenceProcess('sequence2');
      page.eventsList.toggleEventCheck('event3');
      page.header.eventsTab.startSaveSequenceProcess('sequence2');
      expect(page.formForModals.modalTitle).toEqual('Update sequence2');
    });

    it('closes the modal when submit is clicked', () => {
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      browser.waitForAngular();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('shows the updated checked events', () => {
      page.header.eventsTab.openSequenceMenu();
      page.header.eventsTab.startViewSequenceProcess('sequence2');
      expect(page.eventsList.checkedEvent('event3')).toBeFalsy();
    });
  });

  describe('deleting an event', () => {
    beforeAll(() => {
      page.header.goToTab('Events');
    });

    it('disables the delete button if event is in sequence', () => {
      expect(page.eventsList.checkIfDeleteEnabled('event1')).toBeTruthy();
    });

    it('can bring up the delete event modal', () => {
      page.eventsList.startDeleteEventProcess('event4');
      expect(page.formForModals.modalTitle).toEqual('Delete event4');
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.formForModals.fillInOnlyTextField('event4');
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.formForModals.clickButton('Delete');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('deletes the event', () => {
      expect(page.eventsList.eventCount).toEqual(3);
    });
  });

  describe('deleting a sequence', () => {
    beforeAll(() => {
      page.header.goToTab('Events');
    });

    it('can bring up the delete sequence modal', () => {
      page.header.eventsTab.startDeleteSequenceProcess('sequence2');
      expect(page.formForModals.modalTitle).toEqual('Delete sequence2');
    });

    it('disables the "Delete" button if the name does not match', () => {
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
    });

    it('enables the button if the form is filled out correctly', () => {
      page.formForModals.fillInOnlyTextField('sequence2');
      expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
    });

    it('should close the modal when the Delete button is pressed', () => {
      page.formForModals.clickButton('Delete');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('deletes the sequence', () => {
      page.header.eventsTab.openSequenceMenu();
      expect(page.header.eventsTab.sequenceCount).toEqual(1);
    });
  });
});
