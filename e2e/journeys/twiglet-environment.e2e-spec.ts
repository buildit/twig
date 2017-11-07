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

  const waitTime = 500;

  describe('Collapsing Nodes', () => {
    it('can collapse a single set of nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 11) {
          return true;
        }
        page.twigletGraph.collapseClick(nodeNameToClick);
        return false;
      }), waitTime)
      expect(page.twigletGraph.nodeCount).toEqual(11);
    });

    it('can flower collapsed nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 15) {
          return true;
        }
        page.twigletGraph.collapseClick(nodeNameToClick);
        return false;
      }), waitTime)
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can collapse node 2 generations up', () => {
      const nodeNameToClick = 'node2-2';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 13) {
          return true;
        }
        page.twigletGraph.collapseClick(nodeNameToClick);
        return false;
      }), waitTime)
      .catch(() => page.twigletGraph.collapseClick(nodeNameToClick));
      expect(page.twigletGraph.nodeCount).toEqual(13);
    });

    it('can flower nodes and restore missing generation', () => {
      const nodeNameToClick = 'node2-2';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 15) {
          return true;
        }
        page.twigletGraph.collapseClick(nodeNameToClick);
        return false;
      }), waitTime)
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can handle collapsing nodes in steps', () => {
      const firstNodeNameToClick = 'node2-2';
      const secondNodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(firstNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 13) {
          return true;
        }
        page.twigletGraph.collapseClick(firstNodeNameToClick);
        return false;
      }), waitTime)
      page.twigletGraph.collapseClick(secondNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 9) {
          return true;
        }
        page.twigletGraph.collapseClick(secondNodeNameToClick);
        return false;
      }), waitTime)
      expect(page.twigletGraph.nodeCount).toEqual(9);
    });

    it('can flower nodes that were collapsed in steps', () => {
      const firstNodeNameToClick = 'node4-1';
      const secondNodeNameToClick = 'node2-2';
      page.twigletGraph.collapseClick(firstNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 13) {
          return true;
        }
        page.twigletGraph.collapseClick(firstNodeNameToClick);
        return false;
      }), waitTime)
      page.twigletGraph.collapseClick(secondNodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 15) {
          return true;
        }
        page.twigletGraph.collapseClick(secondNodeNameToClick);
        return false;
      }), waitTime)
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });

    it('can cascade collapse a set of nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.accordion.goToMenu('Environment');
      page.accordion.environmentMenu.toggleByLabel('Cascading Collapse');
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 1) {
          return true;
        }
        page.twigletGraph.collapseClick(nodeNameToClick);
        return false;
      }), waitTime)
      expect(page.twigletGraph.nodeCount).toEqual(1);
    });

    it('can cascade flower a set of nodes', () => {
      const nodeNameToClick = 'node4-1';
      page.twigletGraph.collapseClick(nodeNameToClick);
      browser.wait(() => page.twigletGraph.nodeCount.then(count => {
        if (count === 15) {
          return true;
        }
        page.twigletGraph.collapseClick(nodeNameToClick);
        return false;
      }), waitTime)
      expect(page.twigletGraph.nodeCount).toEqual(15);
    });
  });
})
