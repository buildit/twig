"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var modalPath = "//ngb-modal-window[@class='modal fade show']";
var modalNotOpenError = new Error('Modal not open');
var remote = require('selenium-webdriver/remote');
var FormsForModals = (function () {
    function FormsForModals() {
    }
    /**
     * Gets the parent div of a label, used to quickly navigate around .form-groups
     *
     * @private
     * @param {any} labelText the text of the label
     * @returns {ElementFinder}
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.getParentOfLabel = function (labelText) {
        return protractor_1.element(protractor_1.by.xpath(modalPath + "//form//label[contains(text(), \"" + labelText + "\")]/parent::*"));
    };
    /**
     * Throws an error if the modal is not open. Better than thinking we are missing a specific element.
     *
     * @private
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.throwIfNotOpen = function () {
        if (!this.isModalOpen) {
            throw modalNotOpenError;
        }
    };
    Object.defineProperty(FormsForModals.prototype, "isModalOpen", {
        /**
         * Checks to see if any modal is open.
         *
         * @readonly
         * @type {Promise<boolean>}
         * @memberOf FormsForModals
         */
        get: function () {
            return new Promise(function (resolve, reject) {
                protractor_1.browser.isElementPresent(protractor_1.element(protractor_1.by.css('.modal:not(.modal-top)')))
                    .then(resolve);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormsForModals.prototype, "modalTitle", {
        /**
         * Returns a promise containing the modal title.
         *
         * @readonly
         * @type {Promise<string>}
         * @memberOf FormsForModals
         */
        get: function () {
            this.throwIfNotOpen();
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(modalPath + "//div[@class='modal-header']/h4[@class='modal-title']")).getText()
                    .then(resolve)
                    .catch(reject);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormsForModals.prototype, "formErrorCount", {
        /**
         * Returns a promise containing the number of errors currently on the form.
         *
         * @readonly
         * @type {PromiseLike<number>}
         * @memberOf FormsForModals
         */
        get: function () {
            this.throwIfNotOpen();
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(modalPath)).all(protractor_1.by.className('alert-danger')).count()
                    .then(resolve)
                    .catch(reject);
            });
        },
        enumerable: true,
        configurable: true
    });
    FormsForModals.prototype.waitForModalToClose = function () {
        protractor_1.browser.wait(protractor_1.element(protractor_1.by.xpath(modalPath)).isPresent().then(function (present) {
            return !present;
        }), 10000);
    };
    /**
     * Returns a promise containing the text of the error under that label, or undefined if none
     *
     * @param {any} labelText the text of the label, fuzzy finding but case sensitive
     * @returns {PromiseLike<string>}
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.getErrorByLabel = function (labelText) {
        this.throwIfNotOpen();
        var parent = this.getParentOfLabel(labelText);
        return protractor_1.browser.isElementPresent(parent.$('.alert-danger')).then(function (present) {
            if (present) {
                return parent.$('.alert-danger').getText();
            }
        });
    };
    /**
     * Returns a promise containing a boolean representing the enabled state of the button
     *
     * @param {any} buttonText
     * @returns {PromiseLike<boolean>}
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.checkIfButtonEnabled = function (buttonText) {
        this.throwIfNotOpen();
        var modal = protractor_1.element(protractor_1.by.xpath(modalPath));
        return new Promise(function (resolve, reject) {
            modal.element(protractor_1.by.buttonText(buttonText)).isEnabled()
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Fills in a text field by the label name (Case Sensative).
     *
     * @param {any} labelText the text of the label, fuzzy finding but case sensitive
     * @param {any} value the value to be placed in the text field
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.fillInTextFieldByLabel = function (labelText, value) {
        this.throwIfNotOpen();
        var parent = this.getParentOfLabel(labelText);
        var input = parent.$('input');
        input.clear();
        input.sendKeys(value);
    };
    /**
     * Fills in the text field based on ngModel attribute.
     *
     * @param {any} ngModel
     * @param {any} value
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.fillInOnlyTextField = function (value) {
        this.throwIfNotOpen();
        var self = protractor_1.element(protractor_1.by.xpath(modalPath));
        var input = self.element(protractor_1.by.css('input[type="text"]'));
        input.clear();
        input.sendKeys(value);
    };
    /**
     * Fills in a file input field
     *
     * @param {any} labelText the text of the label, fuzzy finding but case sensitive
     * @param {any} pathToFile the path
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.uploadFileByLabel = function (labelText, pathToFile) {
        this.throwIfNotOpen();
        var parent = this.getParentOfLabel(labelText);
        var input = parent.$('input');
        protractor_1.browser.setFileDetector(new remote.FileDetector());
        input.clear();
        input.sendKeys(__dirname + "/" + pathToFile);
    };
    /**
     * Passes an 'a' then backspaces over it to simulate the user leaving the field empty.
     *
     * @param {any} labelText the text of the label, fuzzy finding but case sensitive
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.makeInputFieldDirtyByLabel = function (labelText) {
        this.throwIfNotOpen();
        var parent = this.getParentOfLabel(labelText);
        var input = parent.$('input');
        input.clear();
        input.sendKeys('a');
        input.sendKeys(protractor_1.Key.BACK_SPACE);
    };
    /**
     * Selects an option from a <select> by label text
     *
     * @param {any} labelText the text of the label, fuzzy finding but case sensitive
     * @param {any} optionText the text of the option to be selected.
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.selectOptionByLabel = function (labelText, optionText) {
        this.throwIfNotOpen();
        var parent = this.getParentOfLabel(labelText);
        var options = parent.$('select').all(protractor_1.by.tagName('option'));
        options.filter(function (option) { return option.getText().then(function (text) { return text === optionText; }); })
            .then(function (arrayOfOneOption) { return arrayOfOneOption[0].click(); });
    };
    FormsForModals.prototype.makeSelectDirtyByLabel = function (labelText) {
        this.throwIfNotOpen();
        var parent = this.getParentOfLabel(labelText);
        var options = parent.$('select').all(protractor_1.by.tagName('option'));
        options.get(1).click();
        options.get(0).click();
    };
    /**
     * Clicks a button specified by the button text
     *
     * @param {any} buttonText the button text to look for.
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.clickButton = function (buttonText) {
        this.throwIfNotOpen();
        var modal = protractor_1.element(protractor_1.by.xpath(modalPath));
        modal.element(protractor_1.by.buttonText(buttonText)).click();
    };
    /**
     * Clicks a button specified by the class name
     *
     * @param {any} className the class name to look for.
     *
     * @memberOf FormsForModals
     */
    FormsForModals.prototype.clickButtonByClassName = function (className) {
        this.throwIfNotOpen();
        var modal = protractor_1.element(protractor_1.by.xpath(modalPath));
        modal.element(protractor_1.by.className(className)).click();
    };
    return FormsForModals;
}());
exports.FormsForModals = FormsForModals;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL0Zvcm1zRm9yTW9kYWxzL2luZGV4LnRzIiwic291cmNlcyI6WyIvdHdpZy9lMmUvUGFnZU9iamVjdHMvRm9ybXNGb3JNb2RhbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMEY7QUFFMUYsSUFBTSxTQUFTLEdBQUcsOENBQThDLENBQUM7QUFDakUsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRXBEO0lBQUE7SUFzT0EsQ0FBQztJQXBPQzs7Ozs7Ozs7T0FRRztJQUNLLHlDQUFnQixHQUF4QixVQUF5QixTQUFTO1FBQ2hDLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksU0FBUyx5Q0FBbUMsU0FBUyxtQkFBZSxDQUFDLENBQUMsQ0FBQztJQUNwRyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssdUNBQWMsR0FBdEI7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0saUJBQWlCLENBQUM7UUFDMUIsQ0FBQztJQUNILENBQUM7SUFTRCxzQkFBSSx1Q0FBVztRQVBmOzs7Ozs7V0FNRzthQUNIO1lBQ0UsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQ2pDLG9CQUFPLENBQUMsZ0JBQWdCLENBQUMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztxQkFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQzs7O09BQUE7SUFTRCxzQkFBSSxzQ0FBVTtRQVBkOzs7Ozs7V0FNRzthQUNIO1lBQ0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxD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QyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILG9DQUFXLEdBQVgsVUFBWSxVQUFVO1FBQ3BCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFNLEtBQUssR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsK0NBQXNCLEdBQXRCLFVBQXVCLFNBQVM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQU0sS0FBSyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzNDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUF0T0QsSUFzT0M7QUF0T1ksd0NBQWM7QUFzTzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBicm93c2VyLCBlbGVtZW50LCBieSwgS2V5LCBFbGVtZW50RmluZGVyLCBFbGVtZW50QXJyYXlGaW5kZXIgfSBmcm9tICdwcm90cmFjdG9yJztcblxuY29uc3QgbW9kYWxQYXRoID0gYC8vbmdiLW1vZGFsLXdpbmRvd1tAY2xhc3M9J21vZGFsIGZhZGUgc2hvdyddYDtcbmNvbnN0IG1vZGFsTm90T3BlbkVycm9yID0gbmV3IEVycm9yKCdNb2RhbCBub3Qgb3BlbicpO1xuY29uc3QgcmVtb3RlID0gcmVxdWlyZSgnc2VsZW5pdW0td2ViZHJpdmVyL3JlbW90ZScpO1xuXG5leHBvcnQgY2xhc3MgRm9ybXNGb3JNb2RhbHMge1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwYXJlbnQgZGl2IG9mIGEgbGFiZWwsIHVzZWQgdG8gcXVpY2tseSBuYXZpZ2F0ZSBhcm91bmQgLmZvcm0tZ3JvdXBzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7YW55fSBsYWJlbFRleHQgdGhlIHRleHQgb2YgdGhlIGxhYmVsXG4gICAqIEByZXR1cm5zIHtFbGVtZW50RmluZGVyfVxuICAgKlxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIHByaXZhdGUgZ2V0UGFyZW50T2ZMYWJlbChsYWJlbFRleHQpOiBFbGVtZW50RmluZGVyIHtcbiAgICByZXR1cm4gZWxlbWVudChieS54cGF0aChgJHttb2RhbFBhdGh9Ly9mb3JtLy9sYWJlbFtjb250YWlucyh0ZXh0KCksIFwiJHtsYWJlbFRleHR9XCIpXS9wYXJlbnQ6OipgKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBtb2RhbCBpcyBub3Qgb3Blbi4gQmV0dGVyIHRoYW4gdGhpbmtpbmcgd2UgYXJlIG1pc3NpbmcgYSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIHByaXZhdGUgdGhyb3dJZk5vdE9wZW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzTW9kYWxPcGVuKSB7XG4gICAgICB0aHJvdyBtb2RhbE5vdE9wZW5FcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRvIHNlZSBpZiBhbnkgbW9kYWwgaXMgb3Blbi5cbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqIEB0eXBlIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIGdldCBpc01vZGFsT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBicm93c2VyLmlzRWxlbWVudFByZXNlbnQoZWxlbWVudChieS5jc3MoJy5tb2RhbDpub3QoLm1vZGFsLXRvcCknKSkpXG4gICAgICAudGhlbihyZXNvbHZlKTtcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIGNvbnRhaW5pbmcgdGhlIG1vZGFsIHRpdGxlLlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge1Byb21pc2U8c3RyaW5nPn1cbiAgICogQG1lbWJlck9mIEZvcm1zRm9yTW9kYWxzXG4gICAqL1xuICBnZXQgbW9kYWxUaXRsZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHRoaXMudGhyb3dJZk5vdE9wZW4oKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZWxlbWVudChieS54cGF0aChgJHttb2RhbFBhdGh9Ly9kaXZbQGNsYXNzPSdtb2RhbC1oZWFkZXInXS9oNFtAY2xhc3M9J21vZGFsLXRpdGxlJ11gKSkuZ2V0VGV4dCgpXG4gICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSBjb250YWluaW5nIHRoZSBudW1iZXIgb2YgZXJyb3JzIGN1cnJlbnRseSBvbiB0aGUgZm9ybS5cbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqIEB0eXBlIHtQcm9taXNlTGlrZTxudW1iZXI+fVxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIGdldCBmb3JtRXJyb3JDb3VudCgpOiBQcm9taXNlTGlrZTxudW1iZXI+IHtcbiAgICB0aGlzLnRocm93SWZOb3RPcGVuKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGVsZW1lbnQoYnkueHBhdGgobW9kYWxQYXRoKSkuYWxsKGJ5LmNsYXNzTmFtZSgnYWxlcnQtZGFuZ2VyJykpLmNvdW50KClcbiAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICB9KVxuICB9XG5cbiAgd2FpdEZvck1vZGFsVG9DbG9zZSgpIHtcbiAgICBicm93c2VyLndhaXQoZWxlbWVudChieS54cGF0aChtb2RhbFBhdGgpKS5pc1ByZXNlbnQoKS50aGVuKHByZXNlbnQgPT4ge1xuICAgICAgcmV0dXJuICFwcmVzZW50O1xuICAgIH0pLCAxMDAwMCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgY29udGFpbmluZyB0aGUgdGV4dCBvZiB0aGUgZXJyb3IgdW5kZXIgdGhhdCBsYWJlbCwgb3IgdW5kZWZpbmVkIGlmIG5vbmVcbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGxhYmVsVGV4dCB0aGUgdGV4dCBvZiB0aGUgbGFiZWwsIGZ1enp5IGZpbmRpbmcgYnV0IGNhc2Ugc2Vuc2l0aXZlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlTGlrZTxzdHJpbmc+fVxuICAgKlxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIGdldEVycm9yQnlMYWJlbChsYWJlbFRleHQpIHtcbiAgICB0aGlzLnRocm93SWZOb3RPcGVuKCk7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZkxhYmVsKGxhYmVsVGV4dCk7XG4gICAgcmV0dXJuIGJyb3dzZXIuaXNFbGVtZW50UHJlc2VudChwYXJlbnQuJCgnLmFsZXJ0LWRhbmdlcicpKS50aGVuKHByZXNlbnQgPT4ge1xuICAgICAgaWYgKHByZXNlbnQpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudC4kKCcuYWxlcnQtZGFuZ2VyJykuZ2V0VGV4dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIGNvbnRhaW5pbmcgYSBib29sZWFuIHJlcHJlc2VudGluZyB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgYnV0dG9uXG4gICAqXG4gICAqIEBwYXJhbSB7YW55fSBidXR0b25UZXh0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlTGlrZTxib29sZWFuPn1cbiAgICpcbiAgICogQG1lbWJlck9mIEZvcm1zRm9yTW9kYWxzXG4gICAqL1xuICBjaGVja0lmQnV0dG9uRW5hYmxlZChidXR0b25UZXh0KTogUHJvbWlzZUxpa2U8Ym9vbGVhbj4ge1xuICAgIHRoaXMudGhyb3dJZk5vdE9wZW4oKTtcbiAgICBjb25zdCBtb2RhbCA9IGVsZW1lbnQoYnkueHBhdGgobW9kYWxQYXRoKSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIG1vZGFsLmVsZW1lbnQoYnkuYnV0dG9uVGV4dChidXR0b25UZXh0KSkuaXNFbmFibGVkKClcbiAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxscyBpbiBhIHRleHQgZmllbGQgYnkgdGhlIGxhYmVsIG5hbWUgKENhc2UgU2Vuc2F0aXZlKS5cbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGxhYmVsVGV4dCB0aGUgdGV4dCBvZiB0aGUgbGFiZWwsIGZ1enp5IGZpbmRpbmcgYnV0IGNhc2Ugc2Vuc2l0aXZlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZSB0aGUgdmFsdWUgdG8gYmUgcGxhY2VkIGluIHRoZSB0ZXh0IGZpZWxkXG4gICAqXG4gICAqIEBtZW1iZXJPZiBGb3Jtc0Zvck1vZGFsc1xuICAgKi9cbiAgZmlsbEluVGV4dEZpZWxkQnlMYWJlbChsYWJlbFRleHQsIHZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0lmTm90T3BlbigpO1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZMYWJlbChsYWJlbFRleHQpO1xuICAgIGNvbnN0IGlucHV0ID0gcGFyZW50LiQoJ2lucHV0Jyk7XG4gICAgaW5wdXQuY2xlYXIoKTtcbiAgICBpbnB1dC5zZW5kS2V5cyh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogRmlsbHMgaW4gdGhlIHRleHQgZmllbGQgYmFzZWQgb24gbmdNb2RlbCBhdHRyaWJ1dGUuXG4gICAqXG4gICAqIEBwYXJhbSB7YW55fSBuZ01vZGVsXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKlxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIGZpbGxJbk9ubHlUZXh0RmllbGQodmFsdWUpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93SWZOb3RPcGVuKCk7XG4gICAgY29uc3Qgc2VsZiA9IGVsZW1lbnQoYnkueHBhdGgobW9kYWxQYXRoKSk7XG4gICAgY29uc3QgaW5wdXQgPSBzZWxmLmVsZW1lbnQoYnkuY3NzKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpKTtcbiAgICBpbnB1dC5jbGVhcigpO1xuICAgIGlucHV0LnNlbmRLZXlzKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxscyBpbiBhIGZpbGUgaW5wdXQgZmllbGRcbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGxhYmVsVGV4dCB0aGUgdGV4dCBvZiB0aGUgbGFiZWwsIGZ1enp5IGZpbmRpbmcgYnV0IGNhc2Ugc2Vuc2l0aXZlXG4gICAqIEBwYXJhbSB7YW55fSBwYXRoVG9GaWxlIHRoZSBwYXRoXG4gICAqXG4gICAqIEBtZW1iZXJPZiBGb3Jtc0Zvck1vZGFsc1xuICAgKi9cbiAgdXBsb2FkRmlsZUJ5TGFiZWwobGFiZWxUZXh0LCBwYXRoVG9GaWxlKTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0lmTm90T3BlbigpO1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZMYWJlbChsYWJlbFRleHQpO1xuICAgIGNvbnN0IGlucHV0ID0gcGFyZW50LiQoJ2lucHV0Jyk7XG4gICAgYnJvd3Nlci5zZXRGaWxlRGV0ZWN0b3IobmV3IHJlbW90ZS5GaWxlRGV0ZWN0b3IoKSk7XG4gICAgaW5wdXQuY2xlYXIoKTtcbiAgICBpbnB1dC5zZW5kS2V5cyhgJHtfX2Rpcm5hbWV9LyR7cGF0aFRvRmlsZX1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzZXMgYW4gJ2EnIHRoZW4gYmFja3NwYWNlcyBvdmVyIGl0IHRvIHNpbXVsYXRlIHRoZSB1c2VyIGxlYXZpbmcgdGhlIGZpZWxkIGVtcHR5LlxuICAgKlxuICAgKiBAcGFyYW0ge2FueX0gbGFiZWxUZXh0IHRoZSB0ZXh0IG9mIHRoZSBsYWJlbCwgZnV6enkgZmluZGluZyBidXQgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogQG1lbWJlck9mIEZvcm1zRm9yTW9kYWxzXG4gICAqL1xuICBtYWtlSW5wdXRGaWVsZERpcnR5QnlMYWJlbChsYWJlbFRleHQpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93SWZOb3RPcGVuKCk7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZkxhYmVsKGxhYmVsVGV4dCk7XG4gICAgY29uc3QgaW5wdXQgPSBwYXJlbnQuJCgnaW5wdXQnKTtcbiAgICBpbnB1dC5jbGVhcigpO1xuICAgIGlucHV0LnNlbmRLZXlzKCdhJyk7XG4gICAgaW5wdXQuc2VuZEtleXMoS2V5LkJBQ0tfU1BBQ0UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYW4gb3B0aW9uIGZyb20gYSA8c2VsZWN0PiBieSBsYWJlbCB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSB7YW55fSBsYWJlbFRleHQgdGhlIHRleHQgb2YgdGhlIGxhYmVsLCBmdXp6eSBmaW5kaW5nIGJ1dCBjYXNlIHNlbnNpdGl2ZVxuICAgKiBAcGFyYW0ge2FueX0gb3B0aW9uVGV4dCB0aGUgdGV4dCBvZiB0aGUgb3B0aW9uIHRvIGJlIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIHNlbGVjdE9wdGlvbkJ5TGFiZWwobGFiZWxUZXh0LCBvcHRpb25UZXh0KTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0lmTm90T3BlbigpO1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZMYWJlbChsYWJlbFRleHQpO1xuICAgIGNvbnN0IG9wdGlvbnM6IEVsZW1lbnRBcnJheUZpbmRlciA9IHBhcmVudC4kKCdzZWxlY3QnKS5hbGwoYnkudGFnTmFtZSgnb3B0aW9uJykpO1xuICAgIG9wdGlvbnMuZmlsdGVyKChvcHRpb246IEVsZW1lbnRGaW5kZXIpID0+IG9wdGlvbi5nZXRUZXh0KCkudGhlbih0ZXh0ID0+IHRleHQgPT09IG9wdGlvblRleHQpKVxuICAgIC50aGVuKGFycmF5T2ZPbmVPcHRpb24gPT4gYXJyYXlPZk9uZU9wdGlvblswXS5jbGljaygpKTtcbiAgfVxuXG4gIG1ha2VTZWxlY3REaXJ0eUJ5TGFiZWwobGFiZWxUZXh0KTogdm9pZCB7XG4gICAgdGhpcy50aHJvd0lmTm90T3BlbigpO1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZMYWJlbChsYWJlbFRleHQpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBwYXJlbnQuJCgnc2VsZWN0JykuYWxsKGJ5LnRhZ05hbWUoJ29wdGlvbicpKTtcbiAgICBvcHRpb25zLmdldCgxKS5jbGljaygpO1xuICAgIG9wdGlvbnMuZ2V0KDApLmNsaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2tzIGEgYnV0dG9uIHNwZWNpZmllZCBieSB0aGUgYnV0dG9uIHRleHRcbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGJ1dHRvblRleHQgdGhlIGJ1dHRvbiB0ZXh0IHRvIGxvb2sgZm9yLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgRm9ybXNGb3JNb2RhbHNcbiAgICovXG4gIGNsaWNrQnV0dG9uKGJ1dHRvblRleHQpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93SWZOb3RPcGVuKCk7XG4gICAgY29uc3QgbW9kYWwgPSBlbGVtZW50KGJ5LnhwYXRoKG1vZGFsUGF0aCkpO1xuICAgIG1vZGFsLmVsZW1lbnQoYnkuYnV0dG9uVGV4dChidXR0b25UZXh0KSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGlja3MgYSBidXR0b24gc3BlY2lmaWVkIGJ5IHRoZSBjbGFzcyBuYW1lXG4gICAqXG4gICAqIEBwYXJhbSB7YW55fSBjbGFzc05hbWUgdGhlIGNsYXNzIG5hbWUgdG8gbG9vayBmb3IuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBGb3Jtc0Zvck1vZGFsc1xuICAgKi9cbiAgY2xpY2tCdXR0b25CeUNsYXNzTmFtZShjbGFzc05hbWUpOiB2b2lkIHtcbiAgICB0aGlzLnRocm93SWZOb3RPcGVuKCk7XG4gICAgY29uc3QgbW9kYWwgPSBlbGVtZW50KGJ5LnhwYXRoKG1vZGFsUGF0aCkpO1xuICAgIG1vZGFsLmVsZW1lbnQoYnkuY2xhc3NOYW1lKGNsYXNzTmFtZSkpLmNsaWNrKCk7XG4gIH1cbn07XG4iXX0=