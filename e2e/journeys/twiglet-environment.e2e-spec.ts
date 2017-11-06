import { browser, until } from 'protractor';
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

  const waitTime = 100;

  describe('Collapsing Nodes', () => {
    it('can collapse a single set of nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 11), waitTime)
      .catch(() => page.twigletGraph.collapseClick(nodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(11);
    });

    it('can flower collapsed nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 15), waitTime)
      .catch(() => page.twigletGraph.collapseClick(nodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can collapse node 2 generations up', () => {
      const nodeNameToClick = 'node2-2';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 13), waitTime)
      .catch(() => page.twigletGraph.collapseClick(nodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(13);
    });

    it('can flower nodes and restore missing generation', () => {
      const nodeNameToClick = 'node2-2';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 15), waitTime)
      .catch(() => page.twigletGraph.collapseClick(nodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can handle collapsing nodes in steps', () => {
      const firstNodeNameToClick = 'node2-2';
      const secondNodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(firstNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 13), waitTime)
      .catch(() => page.twigletGraph.collapseClick(firstNodeNameToClick));
      page.twigletGraph.collapseClick(secondNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 9), waitTime)
      .catch(() => page.twigletGraph.collapseClick(secondNodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(9);
    });

    it('can flower nodes that were collapsed in steps', () => {
      const firstNodeNameToClick = 'node4-1';
      const secondNodeNameToClick = 'node2-2';
      page.twigletGraph.collapseClick(firstNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 13), waitTime)
      .catch(() => page.twigletGraph.collapseClick(firstNodeNameToClick));
      page.twigletGraph.collapseClick(secondNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 15), waitTime)
      .catch(() => page.twigletGraph.collapseClick(secondNodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can cascade collapse a set of nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.accordion.goToMenu('Environment');
      page.accordion.environmentMenu.toggleByLabel('Cascading Collapse');
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 1), waitTime)
      .catch(() => page.twigletGraph.collapseClick(nodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(1);
    });

    it('can cascade flower a set of nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => count === 15), waitTime)
      .catch(() => page.twigletGraph.collapseClick(nodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });
  });
})
