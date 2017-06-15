import { browser } from 'protractor';
import { TwigPage } from '../PageObjects/app.po';

describe('logging in', () => {
  let page: TwigPage;
  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
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
});
