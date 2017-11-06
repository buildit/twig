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
    browser.manage().logs().get('browser').then(function(browserLog) {
      console.log('log: ' + require('util').inspect(browserLog));
    });
    deleteDefaultJsonImportedTwiglet(page);
  });

  describe('Collapsing Nodes', () => {
    it('can collapse a single set of nodes', () => {
      page.twigletGraph.collapseClick('node4-1');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 11), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(11);
    });

    it('can flower collapsed nodes', () => {
      page.twigletGraph.collapseClick('node4-1');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 15), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can collapse node 2 generations up', () => {
      page.twigletGraph.collapseClick('node2-2');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 13), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(13);
    });

    it('can flower nodes and restore missing generation', () => {
      page.twigletGraph.collapseClick('node2-2');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 15), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can handle collapsing nodes in steps', () => {
      page.twigletGraph.collapseClick('node2-2');
      page.twigletGraph.collapseClick('node4-1');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 9), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(9);
    });

    it('can flower nodes that were collapsed insteps', () => {
      page.twigletGraph.collapseClick('node4-1');
      page.twigletGraph.collapseClick('node2-2');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 15), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can cascade collapse a set of nodes', () => {
      page.accordion.goToMenu('Environment');
      page.accordion.environmentMenu.toggleByLabel('Cascading Collapse');
      page.twigletGraph.collapseClick('node4-1');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 1), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(1);
    });

    it('can cascade flower a set of nodes', () => {
      page.twigletGraph.collapseClick('node4-1');
      browser.wait(page.twigletGraph.nodeCount.then(count => count === 15), 1000);
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });
  });
})
