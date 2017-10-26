import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';

fdescribe('logging in', () => {
  let page: TwigPage;
  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
  });

  it('can login', () => {
    page.user.loginDefaultTestUser();
    browser.waitForAngular();
    expect(page.user.isLoggedIn).toBeFalsy();
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
