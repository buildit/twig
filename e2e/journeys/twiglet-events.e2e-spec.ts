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
  });

  afterAll(() => {
    // browser.manage().logs().get('browser').then(function(browserLog) {
    //   console.log('log: ' + require('util').inspect(browserLog));
    // });
    deleteDefaultJsonImportedTwiglet(page);
  });

  describe('Adding an event', () => {
    beforeAll(() => {
      page.accordion.goToMenu('Events');
    });

    it('pops up the create event modal', () => {
      page.accordion.eventsMenu.startNewEventProcess();
      expect(page.formForModals.modalTitle).toEqual('Create New Event');
    });

    it('can save the event', () => {
      page.formForModals.fillInTextFieldByLabel('Name', 'event3');
      page.formForModals.clickButton('Create');
      page.formForModals.waitForModalToClose();
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('adds the event', () => {
      expect(page.accordion.eventsMenu.eventCount).toEqual(3);
    });
  });

  describe('Previewing an event', () => {
    beforeAll(() => {
      browser.waitForAngular();
      page.header.twigletEditTab.startTwigletEditProcess();
      page.header.twigletEditTab.addNodeByTooltip('ent1');
      page.formForModals.fillInTextFieldByLabel('Name', 'node 1');
      page.formForModals.clickButton('Add Node');
      page.formForModals.waitForModalToClose();
      page.header.twigletEditTab.saveEdits();
      page.formForModals.fillInOnlyTextField('Commit message');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      page.accordion.goToMenu('Events');
    });

    it('shows the correct number of nodes for event', () => {
      page.accordion.eventsMenu.previewEvent('event2');
      expect(page.twigletGraph.nodeCount).toEqual(15);
      page.accordion.eventsMenu.previewEvent('event2');
    });
  });

  describe('Creating a sequence', () => {
    it('can create a sequence', () => {
      page.accordion.eventsMenu.startNewEventProcess();
      page.formForModals.fillInTextFieldByLabel('Name', 'event4');
      page.formForModals.clickButton('Create');
      page.formForModals.waitForModalToClose();
      page.accordion.eventsMenu.toggleEventCheck('event1');
      page.accordion.eventsMenu.toggleEventCheck('event3');
      page.accordion.eventsMenu.startNewSequenceProcess();
      expect(page.formForModals.modalTitle).toEqual('Create New Sequence');
    });

    it('can save the sequence', () => {
      page.formForModals.fillInTextFieldByLabel('Name', 'sequence2');
      page.formForModals.clickButton('Create');
      page.formForModals.waitForModalToClose();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('sequence list should display the correct number of sequences', () => {
      expect(page.accordion.eventsMenu.sequenceCount).toEqual(2);
    });
  });

  describe('Viewing a sequence', () => {
    it('shows the correct checked events', () => {
      expect(page.accordion.eventsMenu.checkedEvent('event3')).toBeTruthy();
    });

    it('ends the play sequence and displays current twiglet', () => {
      page.accordion.eventsMenu.startSequencePlay();
      page.accordion.eventsMenu.waitForPlayback();
      expect(page.twigletGraph.linkCount).toEqual(15);
    });
  });

  describe('Overwriting a sequence', () => {
    it('brings up the save sequence modal when save is clicked', () => {
      page.accordion.eventsMenu.startViewSequenceProcess('sequence2');
      page.accordion.eventsMenu.toggleEventCheck('event1');
      page.accordion.eventsMenu.startSaveSequenceProcess('sequence2');
      expect(page.formForModals.modalTitle).toEqual('Edit Sequence');
    });

    it('closes the modal when submit is clicked', () => {
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      browser.waitForAngular();
      expect(page.formForModals.isModalOpen).toBeFalsy();
    });

    it('shows the updated checked events', () => {
      page.accordion.eventsMenu.startViewSequenceProcess('sequence2');
      expect(page.accordion.eventsMenu.checkedEvent('event3')).toBeFalsy();
    });
  });

  describe('Deleting an event', () => {
    beforeAll(() => {
      page.accordion.goToMenu('Events');
    });

    it('disables the delete button if event is in sequence', () => {
      expect(page.accordion.eventsMenu.checkIfDeleteEnabled('event1')).toBeTruthy();
    });

    it('can bring up the delete event modal', () => {
      page.accordion.eventsMenu.startDeleteEventProcess('event4');
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
      expect(page.accordion.eventsMenu.eventCount).toEqual(3);
    });
  });

  describe('Deleting a sequence', () => {
    beforeAll(() => {
      page.accordion.goToMenu('Events');
    });

    it('can bring up the delete sequence modal', () => {
      page.accordion.eventsMenu.startDeleteSequenceProcess('sequence2');
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
      expect(page.accordion.eventsMenu.sequenceCount).toEqual(1);
    });
  });
});
