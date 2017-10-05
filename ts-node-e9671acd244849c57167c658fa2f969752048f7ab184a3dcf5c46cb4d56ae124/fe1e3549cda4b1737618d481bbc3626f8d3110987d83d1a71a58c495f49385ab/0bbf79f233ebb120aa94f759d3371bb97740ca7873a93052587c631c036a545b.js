"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var modalPath = "//ngb-modal-window[@class='modal fade show']//";
var EditNode = (function () {
    function EditNode() {
    }
    Object.defineProperty(EditNode.prototype, "attributes", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.xpath(modalPath + "div[@formarrayname='attrs']//div[contains(@class, 'form-inline')]"))
                .then(function (rows) {
                var promises = [];
                rows.forEach(function (rowE, index) {
                    var row = protractor_1.element(protractor_1.by.xpath(modalPath + "div[@formarrayname='attrs']//div[contains(@class, 'form-inline')][" + (index + 1) + "]"));
                    promises.push(protractor_1.promise.all([row.element(protractor_1.by.className('key')), row.element(protractor_1.by.className('value'))])
                        .then(function (_a) {
                        var keyF = _a[0], valueF = _a[1];
                        return keyF.getTagName().then(function (tagName) {
                            if (tagName === 'label') {
                                return keyF.getText().then(function (key) {
                                    return valueF.getAttribute('value')
                                        .then(function (value) { return ({ tagName: tagName, key: key, value: value }); });
                                });
                            }
                            else {
                                return keyF.getAttribute('value').then(function (key) {
                                    return valueF.getAttribute('value')
                                        .then(function (value) { return ({ tagName: tagName, key: key, value: value }); });
                                });
                            }
                        });
                    }));
                });
                return protractor_1.promise.all(promises);
            });
        },
        enumerable: true,
        configurable: true
    });
    EditNode.prototype.fillKey = function (rowNumber, key) {
        var rowString = this.rowNumber(rowNumber);
        var row = protractor_1.element(protractor_1.by.xpath(rowString));
        var input = row.element(protractor_1.by.xpath("input[@formcontrolname='key']"));
        input.clear();
        input.sendKeys(key);
    };
    EditNode.prototype.getKey = function (rowNumber) {
        var rowString = this.rowNumber(rowNumber);
        var row = protractor_1.element(protractor_1.by.xpath(rowString));
        var input = row.element(protractor_1.by.css("label"));
        return input.getText();
    };
    EditNode.prototype.fillValue = function (rowNumber, value) {
        var rowString = this.rowNumber(rowNumber);
        var row = protractor_1.element(protractor_1.by.xpath(rowString));
        var input = row.element(protractor_1.by.xpath("input[@formcontrolname='value']"));
        input.clear();
        input.sendKeys(value);
    };
    EditNode.prototype.clearValue = function (rowNumber) {
        var rowString = this.rowNumber(rowNumber);
        var row = protractor_1.element(protractor_1.by.xpath(rowString));
        var input = row.element(protractor_1.by.xpath("input[@formcontrolname='value']"));
        input.clear();
    };
    EditNode.prototype.getError = function (rowNumber) {
        var rowString = this.rowNumber(rowNumber);
        var row = protractor_1.element(protractor_1.by.xpath(rowString));
        return row.element(protractor_1.by.xpath("div[contains(@class, 'alert-danger')]")).isPresent().then(function (present) {
            if (present) {
                return row.element(protractor_1.by.xpath("div[contains(@class, 'alert-danger')]")).getText();
            }
            return undefined;
        });
    };
    EditNode.prototype.switchType = function (type) {
        var dropdown = protractor_1.element(protractor_1.by.id('entityDropdownMenu'));
        dropdown.click();
        var targetButton = protractor_1.element(protractor_1.by.buttonText(type));
        targetButton.click();
    };
    EditNode.prototype.rowNumber = function (number) {
        return "//ngb-modal-window[@class='modal fade show']//div[@formarrayname='attrs']//div[contains(@class, 'form-inline')][" + number + "]";
    };
    return EditNode;
}());
exports.EditNode = EditNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL0VkaXROb2RlTW9kYWwvaW5kZXgudHMiLCJzb3VyY2VzIjpbIi90d2lnL2UyZS9QYWdlT2JqZWN0cy9FZGl0Tm9kZU1vZGFsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQW1HO0FBRW5HLElBQU0sU0FBUyxHQUFHLGdEQUFnRCxDQUFDO0FBRW5FO0lBQUE7SUErRUEsQ0FBQztJQTlFQyxzQkFBSSxnQ0FBVTthQUFkO1lBQ0UsTUFBTSxDQUFDLG9CQUFPLENBQUMsWUFBWSxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksU0FBUyxzRUFBbUUsQ0FBQyxDQUFDO2lCQUNySCxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUNSLElBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO29CQUN2QixJQUFNLEdBQUcsR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksU0FBUywyRUFBcUUsS0FBSyxHQUFHLENBQUMsT0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDN0gsUUFBUSxDQUFDLElBQUksQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ2hHLElBQUksQ0FBQyxVQUFDLEVBQStCOzRCQUE5QixZQUFJLEVBQUUsY0FBTTt3QkFDbEIsT0FBQSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTzs0QkFDNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0NBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENB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LDRCQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgZWxlbWVudCwgYnksIEtleSwgRWxlbWVudEZpbmRlciwgRWxlbWVudEFycmF5RmluZGVyLCBwcm9taXNlIH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmNvbnN0IG1vZGFsUGF0aCA9IGAvL25nYi1tb2RhbC13aW5kb3dbQGNsYXNzPSdtb2RhbCBmYWRlIHNob3cnXS8vYDtcblxuZXhwb3J0IGNsYXNzIEVkaXROb2RlIHtcbiAgZ2V0IGF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZmluZEVsZW1lbnRzKGJ5LnhwYXRoKGAke21vZGFsUGF0aH1kaXZbQGZvcm1hcnJheW5hbWU9J2F0dHJzJ10vL2Rpdltjb250YWlucyhAY2xhc3MsICdmb3JtLWlubGluZScpXWApKVxuICAgIC50aGVuKHJvd3MgPT4ge1xuICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgIHJvd3MuZm9yRWFjaCgocm93RSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgcm93ID0gZWxlbWVudChieS54cGF0aChgJHttb2RhbFBhdGh9ZGl2W0Bmb3JtYXJyYXluYW1lPSdhdHRycyddLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZm9ybS1pbmxpbmUnKV1bJHtpbmRleCArIDF9XWApKTtcbiAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlLmFsbChbcm93LmVsZW1lbnQoYnkuY2xhc3NOYW1lKCdrZXknKSksIHJvdy5lbGVtZW50KGJ5LmNsYXNzTmFtZSgndmFsdWUnKSldKVxuICAgICAgICAudGhlbigoW2tleUYsIHZhbHVlRl06IEVsZW1lbnRGaW5kZXJbXSkgPT5cbiAgICAgICAgICBrZXlGLmdldFRhZ05hbWUoKS50aGVuKHRhZ05hbWUgPT4ge1xuICAgICAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdsYWJlbCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGtleUYuZ2V0VGV4dCgpLnRoZW4oa2V5ID0+XG4gICAgICAgICAgICAgICAgdmFsdWVGLmdldEF0dHJpYnV0ZSgndmFsdWUnKVxuICAgICAgICAgICAgICAgICAgLnRoZW4odmFsdWUgPT4gKHsgdGFnTmFtZSwga2V5LCB2YWx1ZSB9KSksXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ga2V5Ri5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykudGhlbihrZXkgPT5cbiAgICAgICAgICAgICAgICB2YWx1ZUYuZ2V0QXR0cmlidXRlKCd2YWx1ZScpXG4gICAgICAgICAgICAgICAgICAudGhlbih2YWx1ZSA9PiAoeyB0YWdOYW1lLCBrZXksIHZhbHVlIH0pKSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICApKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbGxLZXkocm93TnVtYmVyLCBrZXkpIHtcbiAgICBjb25zdCByb3dTdHJpbmcgPSB0aGlzLnJvd051bWJlcihyb3dOdW1iZXIpO1xuICAgIGNvbnN0IHJvdyA9IGVsZW1lbnQoYnkueHBhdGgocm93U3RyaW5nKSk7XG4gICAgY29uc3QgaW5wdXQgPSByb3cuZWxlbWVudChieS54cGF0aChgaW5wdXRbQGZvcm1jb250cm9sbmFtZT0na2V5J11gKSk7XG4gICAgaW5wdXQuY2xlYXIoKTtcbiAgICBpbnB1dC5zZW5kS2V5cyhrZXkpO1xuICB9XG5cbiAgZ2V0S2V5KHJvd051bWJlcikge1xuICAgIGNvbnN0IHJvd1N0cmluZyA9IHRoaXMucm93TnVtYmVyKHJvd051bWJlcik7XG4gICAgY29uc3Qgcm93ID0gZWxlbWVudChieS54cGF0aChyb3dTdHJpbmcpKTtcbiAgICBjb25zdCBpbnB1dCA9IHJvdy5lbGVtZW50KGJ5LmNzcyhgbGFiZWxgKSk7XG4gICAgcmV0dXJuIGlucHV0LmdldFRleHQoKTtcbiAgfVxuXG4gIGZpbGxWYWx1ZShyb3dOdW1iZXIsIHZhbHVlKSB7XG4gICAgY29uc3Qgcm93U3RyaW5nID0gdGhpcy5yb3dOdW1iZXIocm93TnVtYmVyKTtcbiAgICBjb25zdCByb3cgPSBlbGVtZW50KGJ5LnhwYXRoKHJvd1N0cmluZykpO1xuICAgIGNvbnN0IGlucHV0ID0gcm93LmVsZW1lbnQoYnkueHBhdGgoYGlucHV0W0Bmb3JtY29udHJvbG5hbWU9J3ZhbHVlJ11gKSk7XG4gICAgaW5wdXQuY2xlYXIoKTtcbiAgICBpbnB1dC5zZW5kS2V5cyh2YWx1ZSk7XG4gIH1cblxuICBjbGVhclZhbHVlKHJvd051bWJlcikge1xuICAgIGNvbnN0IHJvd1N0cmluZyA9IHRoaXMucm93TnVtYmVyKHJvd051bWJlcik7XG4gICAgY29uc3Qgcm93ID0gZWxlbWVudChieS54cGF0aChyb3dTdHJpbmcpKTtcbiAgICBjb25zdCBpbnB1dCA9IHJvdy5lbGVtZW50KGJ5LnhwYXRoKGBpbnB1dFtAZm9ybWNvbnRyb2xuYW1lPSd2YWx1ZSddYCkpO1xuICAgIGlucHV0LmNsZWFyKCk7XG4gIH1cblxuICBnZXRFcnJvcihyb3dOdW1iZXIpIHtcbiAgICBjb25zdCByb3dTdHJpbmcgPSB0aGlzLnJvd051bWJlcihyb3dOdW1iZXIpO1xuICAgIGNvbnN0IHJvdyA9IGVsZW1lbnQoYnkueHBhdGgocm93U3RyaW5nKSk7XG4gICAgcmV0dXJuIHJvdy5lbGVtZW50KGJ5LnhwYXRoKGBkaXZbY29udGFpbnMoQGNsYXNzLCAnYWxlcnQtZGFuZ2VyJyldYCkpLmlzUHJlc2VudCgpLnRoZW4ocHJlc2VudCA9PiB7XG4gICAgICBpZiAocHJlc2VudCkge1xuICAgICAgICByZXR1cm4gcm93LmVsZW1lbnQoYnkueHBhdGgoYGRpdltjb250YWlucyhAY2xhc3MsICdhbGVydC1kYW5nZXInKV1gKSkuZ2V0VGV4dCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfVxuXG4gIHN3aXRjaFR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSBlbGVtZW50KGJ5LmlkKCdlbnRpdHlEcm9wZG93bk1lbnUnKSk7XG4gICAgZHJvcGRvd24uY2xpY2soKTtcbiAgICBjb25zdCB0YXJnZXRCdXR0b24gPSBlbGVtZW50KGJ5LmJ1dHRvblRleHQodHlwZSkpO1xuICAgIHRhcmdldEJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgcHJpdmF0ZSByb3dOdW1iZXIobnVtYmVyKSB7XG4gICAgcmV0dXJuIGAvL25nYi1tb2RhbC13aW5kb3dbQGNsYXNzPSdtb2RhbCBmYWRlIHNob3cnXS8vZGl2W0Bmb3JtYXJyYXluYW1lPSdhdHRycyddLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZm9ybS1pbmxpbmUnKV1bJHtudW1iZXJ9XWA7XG4gIH1cbn1cbiJdfQ==