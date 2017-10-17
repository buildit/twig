import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';

describe('logging in', () => {
  let page: TwigPage;
  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
  });

  afterAll(() => {
    // browser.manage().logs().get('browser').then(function(browserLog) {
    //   console.log('log: ' + require('util').inspect(browserLog));
    // });
  });

  it('can login', () => {
    page.user.loginDefaultTestUser();
    browser.waitForAngular();
    expect(page.user.isLoggedIn).toBeTruthy();
  });

  it('can logout', () => {
    page.user.logout();
    expect(page.user.isLoggedIn).toBeFalsy();
  });

  it('stays logged out', () => {
    browser.refresh();
    browser.waitForAngular();
    expect(page.user.isLoggedIn).toBeFalsy();
  });
});
