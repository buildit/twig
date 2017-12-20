import { FormsForModals } from './../FormsForModals/index';
import { browser, element, by } from 'protractor';
const defaultEmail = 'ben.hernandez@corp.riglet.io';
const localEmail = 'local@user';
const defaultPassword = 'Z3nB@rnH3n';
const localPassword = 'password';

const formForModals = new FormsForModals();

export class User {

  /**
   * Returns true if the user is currently logged in.
   *
   * @readonly
   * @type {PromiseLike<boolean>}
   * @memberOf User
   */
  get isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      browser.isElementPresent(by.className('sign-out'))
      .then(resolve)
      .catch(reject);
    });
  }

  /**
   * Logs the tester in with the provided user name and password
   *
   * @param {any} username
   * @param {any} password
   *
   * @memberOf User
   */
  login(username, password) {
    return browser.isElementPresent(by.className('sign-in')).then(present => {
      if (!present) {
        this.logout();
      }
      element(by.className('sign-in')).click();
      formForModals.fillInTextFieldByLabel('Email', username);
      formForModals.fillInTextFieldByLabel('Password', password);
      formForModals.clickButton('Sign In');
    });
  }

  // @TODO Any type set since Promise type is resolving as PromiseLike and causing a TypeScript compile error
  loginDefaultTestUser(): any {
    return this.login(localEmail, localPassword);
  }

  /**
   * Logs the tester out.
   *
   *
   * @memberOf User
   */
  logout() {
    browser.isElementPresent(by.className('sign-out')).then(present => {
      if (present) {
        element(by.className('sign-out')).click();
      }
    });
  }
}
