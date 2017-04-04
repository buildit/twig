import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';
import {
  createDefaultJsonImportedTwiglet,
  deleteDefaultJsonImportedTwiglet,
  twigletName
} from '../utils';

describe('Filtering Twiglets', () => {
  let page: TwigPage;

  beforeAll(() => {
    page = new TwigPage();
    createDefaultJsonImportedTwiglet(page);
  });

  afterAll(() => {
    deleteDefaultJsonImportedTwiglet(page);
  });

  it('can filter out a set of nodes', () => {
    page.twigletFilters.filters[0].type = 'ent1';
    expect(page.twigletGraph.nodeCount).toEqual(2);
    expect(page.twigletGraph.linkCount).toEqual(0);
  });

  it('affects the side by when nodes are filtered', () => {
    expect(page.nodeList.entities.ent1.count).toEqual(2);
    expect(page.nodeList.entities.ent3.count).toEqual(0);
  });

  it('can add a target to a filter', () => {
    page.twigletFilters.filters[0].addTarget();
    page.twigletFilters.filters[0].target.type = 'ent3';
    expect(page.twigletGraph.nodeCount).toEqual(6);
    expect(page.nodeList.entities.ent3.count).toEqual(4);
  });

  it('can add multiple filters', () => {
    page.twigletFilters.addFilter();
    expect(page.twigletFilters.filterCount).toEqual(2);
  });

  it('does not affect other filters when a new filter is set', () => {
    page.twigletFilters.filters[1].type = 'ent5';
    expect(page.nodeList.entities.ent1.count).toEqual(2);
    expect(page.nodeList.entities.ent3.count).toEqual(4);
  });

  it('filters are additive', () => {
    expect(page.twigletGraph.nodeCount).toEqual(8);
    expect(page.nodeList.entities.ent5.count).toEqual(2);
  });
});

