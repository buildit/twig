import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';
import {
  createDefaultJsonImportedTwiglet,
  deleteDefaultJsonImportedTwiglet,
  twigletName
} from '../utils';

fdescribe('Filtering Twiglets', () => {
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

  it('can add multiple filters', () => {
    page.twigletFilters.addFilter();
    expect(page.twigletFilters.filterCount).toEqual(2);
  });

  it('can have filters build on each other', () => {
    page.twigletFilters.filters[1].type = 'ent3';
    expect(page.twigletGraph.nodeCount).toEqual(6);
    expect(page.nodeList.entities.ent3.count).toEqual(4);
  });
});

