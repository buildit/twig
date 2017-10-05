"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./../FormsForModals/index");
var protractor_1 = require("protractor");
var defaultEmail = 'ben.hernandez@corp.riglet.io';
var localEmail = 'local@user';
var defaultPassword = 'Z3nB@rnH3n';
var localPassword = 'password';
var formForModals = new index_1.FormsForModals();
var User = (function () {
    function User() {
    }
    Object.defineProperty(User.prototype, "isLoggedIn", {
        /**
         * Returns true if the user is currently logged in.
         *
         * @readonly
         * @type {PromiseLike<boolean>}
         * @memberOf User
         */
        get: function () {
            return new Promise(function (resolve, reject) {
                protractor_1.browser.isElementPresent(protractor_1.by.className('sign-out'))
                    .then(resolve)
                    .catch(reject);
            });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Logs the tester in with the provided user name and password
     *
     * @param {any} username
     * @param {any} password
     *
     * @memberOf User
     */
    User.prototype.login = function (username, password) {
        var _this = this;
        return protractor_1.browser.isElementPresent(protractor_1.by.className('sign-in')).then(function (present) {
            if (!present) {
                _this.logout();
            }
            protractor_1.element(protractor_1.by.className('sign-in')).click();
            formForModals.fillInTextFieldByLabel('Email', username);
            formForModals.fillInTextFieldByLabel('Password', password);
            formForModals.clickButton('Sign In');
        });
    };
    User.prototype.loginDefaultTestUser = function () {
        var _this = this;
        protractor_1.element(protractor_1.by.className('nav-link about')).click();
        protractor_1.element(protractor_1.by.css('.db-url')).getText().then(function (value) {
            if (value.includes('localhost')) {
                return _this.login(localEmail, localPassword);
            }
            return _this.login(defaultEmail, defaultPassword);
        });
    };
    /**
     * Logs the tester out.
     *
     *
     * @memberOf User
     */
    User.prototype.logout = function () {
        protractor_1.browser.isElementPresent(protractor_1.by.className('sign-out')).then(function (present) {
            if (present) {
                protractor_1.element(protractor_1.by.className('sign-out')).click();
            }
        });
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL3VzZXIvaW5kZXgudHMiLCJzb3VyY2VzIjpbIi90d2lnL2UyZS9QYWdlT2JqZWN0cy91c2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQTJEO0FBQzNELHlDQUFrRDtBQUNsRCxJQUFNLFlBQVksR0FBRyw4QkFBOEIsQ0FBQztBQUNwRCxJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUM7QUFDaEMsSUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDO0FBQ3JDLElBQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQztBQUVqQyxJQUFNLGFBQWEsR0FBRyxJQUFJLHNCQUFjLEVBQUUsQ0FBQztBQUUzQztJQUFBO0lBNERBLENBQUM7SUFuREMsc0JBQUksNEJBQVU7UUFQZDs7Ozs7O1dBTUc7YUFDSDtZQUNFLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO2dCQUNqQyxvQkFBTyxDQUFDLGdCQUFnQixDQUFDLGVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7cUJBQ2pELElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQzs7O09BQUE7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsb0JBQUssR0FBTCxVQUFNLFFBQVEsRUFBRSxRQUFRO1FBQXhCLGlCQVVDO1FBVEMsTUFBTSxDQUFDLG9CQUFPLENBQUMsZ0JBQWdCLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDbkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixDQUFDO1lBQ0Qsb0JBQU8sQ0FBQyxlQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RCxhQUFhLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNELGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsbUNBQW9CLEdBQXBCO1FBQUEsaUJBUUM7UUFQQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hELG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUs7WUFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMvQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gscUJBQU0sR0FBTjtRQUNFLG9CQUFPLENBQUMsZ0JBQWdCLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDN0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWixvQkFBTyxDQUFDLGVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUE1REQsSUE0REM7QUE1RFksb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb3Jtc0Zvck1vZGFscyB9IGZyb20gJy4vLi4vRm9ybXNGb3JNb2RhbHMvaW5kZXgnO1xuaW1wb3J0IHsgYnJvd3NlciwgZWxlbWVudCwgYnkgfSBmcm9tICdwcm90cmFjdG9yJztcbmNvbnN0IGRlZmF1bHRFbWFpbCA9ICdiZW4uaGVybmFuZGV6QGNvcnAucmlnbGV0LmlvJztcbmNvbnN0IGxvY2FsRW1haWwgPSAnbG9jYWxAdXNlcic7XG5jb25zdCBkZWZhdWx0UGFzc3dvcmQgPSAnWjNuQkBybkgzbic7XG5jb25zdCBsb2NhbFBhc3N3b3JkID0gJ3Bhc3N3b3JkJztcblxuY29uc3QgZm9ybUZvck1vZGFscyA9IG5ldyBGb3Jtc0Zvck1vZGFscygpO1xuXG5leHBvcnQgY2xhc3MgVXNlciB7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdXNlciBpcyBjdXJyZW50bHkgbG9nZ2VkIGluLlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge1Byb21pc2VMaWtlPGJvb2xlYW4+fVxuICAgKiBAbWVtYmVyT2YgVXNlclxuICAgKi9cbiAgZ2V0IGlzTG9nZ2VkSW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGJyb3dzZXIuaXNFbGVtZW50UHJlc2VudChieS5jbGFzc05hbWUoJ3NpZ24tb3V0JykpXG4gICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTG9ncyB0aGUgdGVzdGVyIGluIHdpdGggdGhlIHByb3ZpZGVkIHVzZXIgbmFtZSBhbmQgcGFzc3dvcmRcbiAgICpcbiAgICogQHBhcmFtIHthbnl9IHVzZXJuYW1lXG4gICAqIEBwYXJhbSB7YW55fSBwYXNzd29yZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgVXNlclxuICAgKi9cbiAgbG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIGJyb3dzZXIuaXNFbGVtZW50UHJlc2VudChieS5jbGFzc05hbWUoJ3NpZ24taW4nKSkudGhlbihwcmVzZW50ID0+IHtcbiAgICAgIGlmICghcHJlc2VudCkge1xuICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgfVxuICAgICAgZWxlbWVudChieS5jbGFzc05hbWUoJ3NpZ24taW4nKSkuY2xpY2soKTtcbiAgICAgIGZvcm1Gb3JNb2RhbHMuZmlsbEluVGV4dEZpZWxkQnlMYWJlbCgnRW1haWwnLCB1c2VybmFtZSk7XG4gICAgICBmb3JtRm9yTW9kYWxzLmZpbGxJblRleHRGaWVsZEJ5TGFiZWwoJ1Bhc3N3b3JkJywgcGFzc3dvcmQpO1xuICAgICAgZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignU2lnbiBJbicpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9naW5EZWZhdWx0VGVzdFVzZXIoKSB7XG4gICAgZWxlbWVudChieS5jbGFzc05hbWUoJ25hdi1saW5rIGFib3V0JykpLmNsaWNrKCk7XG4gICAgZWxlbWVudChieS5jc3MoJy5kYi11cmwnKSkuZ2V0VGV4dCgpLnRoZW4odmFsdWUgPT4ge1xuICAgICAgaWYgKHZhbHVlLmluY2x1ZGVzKCdsb2NhbGhvc3QnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dpbihsb2NhbEVtYWlsLCBsb2NhbFBhc3N3b3JkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmxvZ2luKGRlZmF1bHRFbWFpbCwgZGVmYXVsdFBhc3N3b3JkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIHRoZSB0ZXN0ZXIgb3V0LlxuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyT2YgVXNlclxuICAgKi9cbiAgbG9nb3V0KCkge1xuICAgIGJyb3dzZXIuaXNFbGVtZW50UHJlc2VudChieS5jbGFzc05hbWUoJ3NpZ24tb3V0JykpLnRoZW4ocHJlc2VudCA9PiB7XG4gICAgICBpZiAocHJlc2VudCkge1xuICAgICAgICBlbGVtZW50KGJ5LmNsYXNzTmFtZSgnc2lnbi1vdXQnKSkuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19