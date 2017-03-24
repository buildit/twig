import { ModalForm } from './../modalForm/index';
import { browser, element, by } from 'protractor';
const defaultEmail = 'ben.hernandez@corp.riglet.io';
const defaultPassword = 'Z3nB@rnH3n';

const modalForm = new ModalForm();

export class User {

  /**
   * Returns true if the user is currently logged in.
   *
   * @readonly
   * @type {PromiseLike<boolean>}
   * @memberOf User
   */
  get isLoggedIn(): PromiseLike<boolean> {
    return browser.isElementPresent(by.className('fa-sign-out'));
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
    return browser.isElementPresent(by.className('fa-sign-in')).then(present => {
      if (!present) {
        this.logout();
      }
      element(by.className('fa-sign-in')).click();
      modalForm.fillInTextFieldByLabel('Email', username);
      modalForm.fillInTextFieldByLabel('Password', password);
      modalForm.clickButton('Login');
    });
  }

  loginDefaultTestUser() {
    return this.login(defaultEmail, defaultPassword);
  }

  /**
   * Logs the tester out.
   *
   *
   * @memberOf User
   */
  logout() {
    browser.isElementPresent(by.className('fa-sign-out')).then(present => {
      if (present) {
        element(by.className('fa-sign-out')).click();
      }
    });
  }
}
