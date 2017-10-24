import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';
import {
  createDefaultJsonImportedTwiglet,
  deleteDefaultJsonImportedTwiglet,
  twigletName
} from '../utils';

describe('Twiglet Environment Controls', () => {

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

  describe('Collapsing Nodes', () => {
    it('can collapse a single set of nodes', () => {
      page.twigletGraph.collapseClick('node4-1');
      browser.waitForAngular();
      expect(page.twigletGraph.nodeCount).toEqual(11);
    });

    it('can flower collapsed nodes', () => {
      page.twigletGraph.collapseClick('node4-1');
      browser.waitForAngular();
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can cascade collapse a set of nodes', () => {
      page.accordion.goToMenu('Environment');
      page.accordion.environmentMenu.toggleByLabel('Cascading Collapse');
      page.twigletGraph.collapseClick('node4-1');
      browser.waitForAngular();
      expect(page.twigletGraph.nodeCount).toEqual(1);
    });

    it('can cascade flower a set of nodes', () => {
      page.twigletGraph.collapseClick('node4-1');
      browser.waitForAngular();
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });
  });
})
