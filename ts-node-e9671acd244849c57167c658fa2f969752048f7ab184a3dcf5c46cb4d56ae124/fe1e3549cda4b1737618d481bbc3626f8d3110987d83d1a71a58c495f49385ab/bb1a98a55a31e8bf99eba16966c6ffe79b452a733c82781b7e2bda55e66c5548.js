"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var ownTag = '//app-model-form//';
var ModelEditForm = (function () {
    function ModelEditForm() {
    }
    ModelEditForm.prototype.startAddingEntity = function () {
        var button = protractor_1.element(protractor_1.by.cssContainingText('button.new-button', 'Add New Entity'));
        button.click();
    };
    ModelEditForm.prototype.addEntity = function (type, icon, color) {
        this.startAddingEntity();
        this.fillEntity(1, type, icon, color);
    };
    ModelEditForm.prototype.fillEntity = function (rowNumber, type, icon, color) {
        var e = this.row[rowNumber];
        e.type = type;
        e.color = color;
        e.icon = icon;
    };
    ModelEditForm.prototype.startAddingAttribute = function (rowNumber) {
        var showHide = protractor_1.element(protractor_1.by.xpath("//div[contains(@class, 'entity-row')][" + rowNumber + "]//span[@class=\"clickable\"]/span"));
        return showHide.getText().then(function (text) {
            if (text === 'Show Attributes') {
                return showHide.click();
            }
        })
            .then(function () { return protractor_1.element(protractor_1.by.xpath("//div[contains(@class, 'entity-row')][" + rowNumber + "]//i[@class=\"fa fa-plus\"]")).click(); })
            .then(function () { return protractor_1.browser.findElements(protractor_1.by.xpath("//div[contains(@class, 'entity-row')][" + rowNumber + "]//div[@formarrayname=\"attributes\"]" +
            "//div[contains(@class, 'form-row')]")); })
            .then(function (elements) {
            var rowString = "//div[contains(@class, 'entity-row')][" + rowNumber + "]//div[@formarrayname=\"attributes\"]" +
                ("//div[contains(@class, 'form-row')][" + (elements.length - 1) + "]//");
            return attribute(rowString);
        });
    };
    ModelEditForm.prototype.addAttribute = function (rowNumber, name, type, required) {
        if (required === void 0) { required = false; }
        var showHide = protractor_1.element(protractor_1.by.xpath("//div[contains(@class, 'entity-row')][" + rowNumber + "]//span[@class=\"clickable\"]/span"));
        return showHide.getText().then(function (text) {
            if (text === 'Show Attributes') {
                return showHide.click();
            }
        })
            .then(function () { return protractor_1.element(protractor_1.by.xpath("//div[contains(@class, 'entity-row')][" + rowNumber + "]//i[@class=\"fa fa-plus\"]")).click(); })
            .then(function () { return protractor_1.browser.findElements(protractor_1.by.xpath("//div[contains(@class, 'entity-row')][" + rowNumber + "]//div[@formarrayname=\"attributes\"]" +
            "//div[contains(@class, 'form-row')]")); })
            .then(function (elements) {
            var rowString = "//div[contains(@class, 'entity-row')][" + rowNumber + "]//div[@formarrayname=\"attributes\"]" +
                ("//div[contains(@class, 'form-row')][" + (elements.length - 1) + "]//");
            return rowString;
        })
            .then(function (rowString) {
            var newAttribute = attribute(rowString);
            newAttribute.name = name;
            newAttribute.type = type;
            newAttribute.required = required;
        });
    };
    ModelEditForm.prototype.fillAttribute = function (rowString, name, type, required) {
        if (required === void 0) { required = false; }
        var newAttribute = attribute(rowString);
        newAttribute.name = name;
        newAttribute.type = type;
        newAttribute.required = required;
    };
    ModelEditForm.prototype.clickButton = function (className) {
        protractor_1.element(protractor_1.by.css("." + className)).click();
    };
    ModelEditForm.prototype.startEditing = function () {
        protractor_1.element(protractor_1.by.tagName('app-model-info')).element(protractor_1.by.buttonText('Edit')).click();
        protractor_1.browser.waitForAngular();
    };
    ModelEditForm.prototype.saveModelEdits = function () {
        var button = protractor_1.element(protractor_1.by.cssContainingText('button', "Save"));
        button.click();
    };
    ModelEditForm.prototype.cancelModelEdits = function () {
        var button = protractor_1.element(protractor_1.by.cssContainingText('button', "Cancel"));
        button.click();
    };
    Object.defineProperty(ModelEditForm.prototype, "isOpen", {
        get: function () {
            return protractor_1.browser.isElementPresent(protractor_1.element(protractor_1.by.css('app-model-form')));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelEditForm.prototype, "isReadyToSave", {
        get: function () {
            var saveButton = protractor_1.element(protractor_1.by.xpath('//div[@class="edit-btn"]//button[text()="Save"]'));
            return saveButton.isEnabled();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelEditForm.prototype, "entityCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.xpath(ownTag + "div[contains(@class, 'entity-row')]")).then(function (elements) {
                return elements.length;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelEditForm.prototype, "row", {
        get: function () {
            return new Proxy([], {
                get: function (target, propKey, receiver) {
                    return entity(getRowString(propKey));
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    return ModelEditForm;
}());
exports.ModelEditForm = ModelEditForm;
function getRowString(row) {
    return "//div[contains(@class, 'form-row entity-row')][" + row + "]//";
}
function entity(rowString) {
    return {
        get type() {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='type']"));
            return new Promise(function (resolve, reject) {
                input.getAttribute('value')
                    .then(resolve)
                    .catch(reject);
            });
        },
        set type(type) {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='type']"));
            input.clear();
            input.sendKeys(type);
        },
        get color() {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='color']"));
            return new Promise(function (resolve, reject) {
                input.getAttribute('value')
                    .then(resolve)
                    .catch(reject);
            });
        },
        set color(color) {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='color']"));
            input.sendKeys(color);
        },
        get icon() {
            var classesToExclude = ['fa', 'fa-2x'];
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(rowString + "i[contains(@class, 'fa-2x')]"))
                    .getAttribute('class').then(function (classString) {
                    return classString.split(' ').filter(function (className) { return !classesToExclude.includes[className]; })[0];
                })
                    .then(resolve)
                    .catch(reject);
            });
        },
        set icon(icon) {
            protractor_1.element(protractor_1.by.xpath(rowString + "button[@id='iconDropdownMenu']")).click();
            var search = protractor_1.element(protractor_1.by.xpath(rowString + "input[@placeholder='search']"));
            search.clear();
            search.sendKeys(icon);
            protractor_1.element(protractor_1.by.xpath(rowString + "button[contains(text(), '" + icon + "')]")).click();
        },
    };
}
function attribute(rowString) {
    return {
        set name(name) {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='name']"));
            input.clear();
            input.sendKeys(name);
        },
        set type(type) {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "select[@formcontrolname='dataType']"));
            input.click();
            input.element(protractor_1.by.cssContainingText('option', type)).click();
        },
        set required(required) {
            if (required) {
                var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname=\"required\"]"));
                input.click();
            }
        }
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL01vZGVsRWRpdEZvcm0vaW5kZXgudHMiLCJzb3VyY2VzIjpbIi90d2lnL2UyZS9QYWdlT2JqZWN0cy9Nb2RlbEVkaXRGb3JtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQWlFO0FBRWpFLElBQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDO0FBRXBDO0lBQUE7SUEyR0EsQ0FBQztJQXpHQyx5Q0FBaUIsR0FBakI7UUFDRSxJQUFNLE1BQU0sR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDcEYsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxpQ0FBUyxHQUFULFVBQVUsSUFBWSxFQUFFLElBQVksRUFBRSxLQUFjO1FBQ2xELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELGtDQUFVLEdBQVYsVUFBVyxTQUFpQixFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsS0FBYztRQUN0RSxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDaEIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELDRDQUFvQixHQUFwQixVQUFxQixTQUFTO1FBQzVCLElBQU0sUUFBUSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQywyQ0FBeUMsU0FBUyx1Q0FBa0MsQ0FBQyxDQUFDLENBQUM7UUFDekgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxP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QzlELENBQUM7UUFDRCxJQUFJLFFBQVEsQ0FBQyxRQUFpQjtZQUM1QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQU0sS0FBSyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBSSxTQUFTLHlDQUFvQyxDQUFDLENBQUMsQ0FBQztnQkFDbEYsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLENBQUM7UUFDSCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBicm93c2VyLCBlbGVtZW50LCBieSwgRWxlbWVudEZpbmRlciB9IGZyb20gJ3Byb3RyYWN0b3InO1xuXG5jb25zdCBvd25UYWcgPSAnLy9hcHAtbW9kZWwtZm9ybS8vJztcblxuZXhwb3J0IGNsYXNzIE1vZGVsRWRpdEZvcm0ge1xuXG4gIHN0YXJ0QWRkaW5nRW50aXR5KCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGVsZW1lbnQoYnkuY3NzQ29udGFpbmluZ1RleHQoJ2J1dHRvbi5uZXctYnV0dG9uJywgJ0FkZCBOZXcgRW50aXR5JykpO1xuICAgIGJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgYWRkRW50aXR5KHR5cGU6IHN0cmluZywgaWNvbjogc3RyaW5nLCBjb2xvcj86IHN0cmluZykge1xuICAgIHRoaXMuc3RhcnRBZGRpbmdFbnRpdHkoKTtcbiAgICB0aGlzLmZpbGxFbnRpdHkoMSwgdHlwZSwgaWNvbiwgY29sb3IpO1xuICB9XG5cbiAgZmlsbEVudGl0eShyb3dOdW1iZXI6IG51bWJlciwgdHlwZTogc3RyaW5nLCBpY29uOiBzdHJpbmcsIGNvbG9yPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZSA9IHRoaXMucm93W3Jvd051bWJlcl07XG4gICAgZS50eXBlID0gdHlwZTtcbiAgICBlLmNvbG9yID0gY29sb3I7XG4gICAgZS5pY29uID0gaWNvbjtcbiAgfVxuXG4gIHN0YXJ0QWRkaW5nQXR0cmlidXRlKHJvd051bWJlcikge1xuICAgIGNvbnN0IHNob3dIaWRlID0gZWxlbWVudChieS54cGF0aChgLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LXJvdycpXVske3Jvd051bWJlcn1dLy9zcGFuW0BjbGFzcz1cImNsaWNrYWJsZVwiXS9zcGFuYCkpO1xuICAgIHJldHVybiBzaG93SGlkZS5nZXRUZXh0KCkudGhlbih0ZXh0ID0+IHtcbiAgICAgIGlmICh0ZXh0ID09PSAnU2hvdyBBdHRyaWJ1dGVzJykge1xuICAgICAgICByZXR1cm4gc2hvd0hpZGUuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC50aGVuKCgpID0+IGVsZW1lbnQoYnkueHBhdGgoYC8vZGl2W2NvbnRhaW5zKEBjbGFzcywgJ2VudGl0eS1yb3cnKV1bJHtyb3dOdW1iZXJ9XS8vaVtAY2xhc3M9XCJmYSBmYS1wbHVzXCJdYCkpLmNsaWNrKCkpXG4gICAgLnRoZW4oKCkgPT4gYnJvd3Nlci5maW5kRWxlbWVudHMoYnkueHBhdGgoYC8vZGl2W2NvbnRhaW5zKEBjbGFzcywgJ2VudGl0eS1yb3cnKV1bJHtyb3dOdW1iZXJ9XS8vZGl2W0Bmb3JtYXJyYXluYW1lPVwiYXR0cmlidXRlc1wiXWAgK1xuICAgICAgICAgIGAvL2Rpdltjb250YWlucyhAY2xhc3MsICdmb3JtLXJvdycpXWApKSlcbiAgICAudGhlbihlbGVtZW50cyA9PiB7XG4gICAgICBjb25zdCByb3dTdHJpbmcgPSBgLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LXJvdycpXVske3Jvd051bWJlcn1dLy9kaXZbQGZvcm1hcnJheW5hbWU9XCJhdHRyaWJ1dGVzXCJdYCArXG4gICAgICAgICAgYC8vZGl2W2NvbnRhaW5zKEBjbGFzcywgJ2Zvcm0tcm93JyldWyR7ZWxlbWVudHMubGVuZ3RoIC0gMX1dLy9gO1xuICAgICAgcmV0dXJuIGF0dHJpYnV0ZShyb3dTdHJpbmcpO1xuICAgIH0pXG4gIH1cblxuICBhZGRBdHRyaWJ1dGUocm93TnVtYmVyLCBuYW1lLCB0eXBlLCByZXF1aXJlZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2hvd0hpZGUgPSBlbGVtZW50KGJ5LnhwYXRoKGAvL2Rpdltjb250YWlucyhAY2xhc3MsICdlbnRpdHktcm93JyldWyR7cm93TnVtYmVyfV0vL3NwYW5bQGNsYXNzPVwiY2xpY2thYmxlXCJdL3NwYW5gKSk7XG4gICAgcmV0dXJuIHNob3dIaWRlLmdldFRleHQoKS50aGVuKHRleHQgPT4ge1xuICAgICAgaWYgKHRleHQgPT09ICdTaG93IEF0dHJpYnV0ZXMnKSB7XG4gICAgICAgIHJldHVybiBzaG93SGlkZS5jbGljaygpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4gZWxlbWVudChieS54cGF0aChgLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LXJvdycpXVske3Jvd051bWJlcn1dLy9pW0BjbGFzcz1cImZhIGZhLXBsdXNcIl1gKSkuY2xpY2soKSlcbiAgICAudGhlbigoKSA9PiBicm93c2VyLmZpbmRFbGVtZW50cyhieS54cGF0aChgLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LXJvdycpXVske3Jvd051bWJlcn1dLy9kaXZbQGZvcm1hcnJheW5hbWU9XCJhdHRyaWJ1dGVzXCJdYCArXG4gICAgICAgICAgYC8vZGl2W2NvbnRhaW5zKEBjbGFzcywgJ2Zvcm0tcm93JyldYCkpKVxuICAgIC50aGVuKGVsZW1lbnRzID0+IHtcbiAgICAgIGNvbnN0IHJvd1N0cmluZyA9IGAvL2Rpdltjb250YWlucyhAY2xhc3MsICdlbnRpdHktcm93JyldWyR7cm93TnVtYmVyfV0vL2RpdltAZm9ybWFycmF5bmFtZT1cImF0dHJpYnV0ZXNcIl1gICtcbiAgICAgICAgICBgLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZm9ybS1yb3cnKV1bJHtlbGVtZW50cy5sZW5ndGggLSAxfV0vL2A7XG4gICAgICByZXR1cm4gcm93U3RyaW5nO1xuICAgIH0pXG4gICAgLnRoZW4ocm93U3RyaW5nID0+IHtcbiAgICAgIGNvbnN0IG5ld0F0dHJpYnV0ZSA9IGF0dHJpYnV0ZShyb3dTdHJpbmcpO1xuICAgICAgbmV3QXR0cmlidXRlLm5hbWUgPSBuYW1lO1xuICAgICAgbmV3QXR0cmlidXRlLnR5cGUgPSB0eXBlO1xuICAgICAgbmV3QXR0cmlidXRlLnJlcXVpcmVkID0gcmVxdWlyZWQ7XG4gICAgfSk7XG4gIH1cblxuICBmaWxsQXR0cmlidXRlKHJvd1N0cmluZywgbmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIHJlcXVpcmVkID0gZmFsc2UpIHtcbiAgICBjb25zdCBuZXdBdHRyaWJ1dGUgPSBhdHRyaWJ1dGUocm93U3RyaW5nKTtcbiAgICBuZXdBdHRyaWJ1dGUubmFtZSA9IG5hbWU7XG4gICAgbmV3QXR0cmlidXRlLnR5cGUgPSB0eXBlO1xuICAgIG5ld0F0dHJpYnV0ZS5yZXF1aXJlZCA9IHJlcXVpcmVkO1xuICB9XG5cbiAgY2xpY2tCdXR0b24oY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICBlbGVtZW50KGJ5LmNzcyhgLiR7Y2xhc3NOYW1lfWApKS5jbGljaygpO1xuICB9XG5cbiAgc3RhcnRFZGl0aW5nKCkge1xuICAgIGVsZW1lbnQoYnkudGFnTmFtZSgnYXBwLW1vZGVsLWluZm8nKSkuZWxlbWVudChieS5idXR0b25UZXh0KCdFZGl0JykpLmNsaWNrKCk7XG4gICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xuICB9XG5cbiAgc2F2ZU1vZGVsRWRpdHMoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZWxlbWVudChieS5jc3NDb250YWluaW5nVGV4dCgnYnV0dG9uJywgYFNhdmVgKSk7XG4gICAgYnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICBjYW5jZWxNb2RlbEVkaXRzKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGVsZW1lbnQoYnkuY3NzQ29udGFpbmluZ1RleHQoJ2J1dHRvbicsIGBDYW5jZWxgKSk7XG4gICAgYnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICBnZXQgaXNPcGVuKCkge1xuICAgIHJldHVybiBicm93c2VyLmlzRWxlbWVudFByZXNlbnQoZWxlbWVudChieS5jc3MoJ2FwcC1tb2RlbC1mb3JtJykpKTtcbiAgfVxuXG4gIGdldCBpc1JlYWR5VG9TYXZlKCkge1xuICAgIGNvbnN0IHNhdmVCdXR0b24gPSBlbGVtZW50KGJ5LnhwYXRoKCcvL2RpdltAY2xhc3M9XCJlZGl0LWJ0blwiXS8vYnV0dG9uW3RleHQoKT1cIlNhdmVcIl0nKSk7XG4gICAgcmV0dXJuIHNhdmVCdXR0b24uaXNFbmFibGVkKCk7XG4gIH1cblxuICBnZXQgZW50aXR5Q291bnQoKSB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZmluZEVsZW1lbnRzKGJ5LnhwYXRoKGAke293blRhZ31kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LXJvdycpXWApKS50aGVuKGVsZW1lbnRzID0+XG4gICAgICBlbGVtZW50cy5sZW5ndGhcbiAgICApO1xuICB9XG5cbiAgZ2V0IHJvdygpOiBFbnRpdHlbXSB7XG4gICAgcmV0dXJuIG5ldyBQcm94eShbXSwge1xuICAgICAgZ2V0KHRhcmdldCwgcHJvcEtleSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eShnZXRSb3dTdHJpbmcocHJvcEtleSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJvd1N0cmluZyhyb3cpIHtcbiAgcmV0dXJuIGAvL2Rpdltjb250YWlucyhAY2xhc3MsICdmb3JtLXJvdyBlbnRpdHktcm93JyldWyR7cm93fV0vL2A7XG59XG5cbmZ1bmN0aW9uIGVudGl0eShyb3dTdHJpbmcpIHtcbiAgcmV0dXJuIHtcbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gZWxlbWVudChieS54cGF0aChgJHtyb3dTdHJpbmd9aW5wdXRbQGZvcm1jb250cm9sbmFtZT0ndHlwZSddYCkpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaW5wdXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpXG4gICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgfSlcbiAgICB9LFxuICAgIHNldCB0eXBlKHR5cGU6IHN0cmluZyB8IFByb21pc2U8c3RyaW5nPikge1xuICAgICAgY29uc3QgaW5wdXQgPSBlbGVtZW50KGJ5LnhwYXRoKGAke3Jvd1N0cmluZ31pbnB1dFtAZm9ybWNvbnRyb2xuYW1lPSd0eXBlJ11gKSk7XG4gICAgICBpbnB1dC5jbGVhcigpO1xuICAgICAgaW5wdXQuc2VuZEtleXModHlwZSBhcyBzdHJpbmcpO1xuICAgIH0sXG4gICAgZ2V0IGNvbG9yKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBlbGVtZW50KGJ5LnhwYXRoKGAke3Jvd1N0cmluZ31pbnB1dFtAZm9ybWNvbnRyb2xuYW1lPSdjb2xvciddYCkpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaW5wdXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpXG4gICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXQgY29sb3IoY29sb3I6IHN0cmluZyB8IFByb21pc2U8c3RyaW5nPikge1xuICAgICAgY29uc3QgaW5wdXQgPSBlbGVtZW50KGJ5LnhwYXRoKGAke3Jvd1N0cmluZ31pbnB1dFtAZm9ybWNvbnRyb2xuYW1lPSdjb2xvciddYCkpO1xuICAgICAgaW5wdXQuc2VuZEtleXMoY29sb3IgYXMgc3RyaW5nKTtcbiAgICB9LFxuICAgIGdldCBpY29uKCkge1xuICAgICAgY29uc3QgY2xhc3Nlc1RvRXhjbHVkZSA9IFsnZmEnLCAnZmEtMngnXTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGVsZW1lbnQoYnkueHBhdGgoYCR7cm93U3RyaW5nfWlbY29udGFpbnMoQGNsYXNzLCAnZmEtMngnKV1gKSlcbiAgICAgICAgICAuZ2V0QXR0cmlidXRlKCdjbGFzcycpLnRoZW4oY2xhc3NTdHJpbmcgPT5cbiAgICAgICAgICAgIGNsYXNzU3RyaW5nLnNwbGl0KCcgJykuZmlsdGVyKGNsYXNzTmFtZSA9PiAhY2xhc3Nlc1RvRXhjbHVkZS5pbmNsdWRlc1tjbGFzc05hbWVdKVswXSlcbiAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNldCBpY29uKGljb246IHN0cmluZyB8IFByb21pc2U8c3RyaW5nPikge1xuICAgICAgZWxlbWVudChieS54cGF0aChgJHtyb3dTdHJpbmd9YnV0dG9uW0BpZD0naWNvbkRyb3Bkb3duTWVudSddYCkpLmNsaWNrKCk7XG4gICAgICBjb25zdCBzZWFyY2ggPSBlbGVtZW50KGJ5LnhwYXRoKGAke3Jvd1N0cmluZ31pbnB1dFtAcGxhY2Vob2xkZXI9J3NlYXJjaCddYCkpO1xuICAgICAgc2VhcmNoLmNsZWFyKCk7XG4gICAgICBzZWFyY2guc2VuZEtleXMoaWNvbiBhcyBzdHJpbmcpO1xuICAgICAgZWxlbWVudChieS54cGF0aChgJHtyb3dTdHJpbmd9YnV0dG9uW2NvbnRhaW5zKHRleHQoKSwgJyR7aWNvbn0nKV1gKSkuY2xpY2soKTtcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyaWJ1dGUocm93U3RyaW5nKSB7XG4gIHJldHVybiB7XG4gICAgc2V0IG5hbWUobmFtZTogc3RyaW5nKSB7XG4gICAgICBjb25zdCBpbnB1dCA9IGVsZW1lbnQoYnkueHBhdGgoYCR7cm93U3RyaW5nfWlucHV0W0Bmb3JtY29udHJvbG5hbWU9J25hbWUnXWApKTtcbiAgICAgIGlucHV0LmNsZWFyKCk7XG4gICAgICBpbnB1dC5zZW5kS2V5cyhuYW1lIGFzIHN0cmluZyk7XG4gICAgfSxcbiAgICBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gZWxlbWVudChieS54cGF0aChgJHtyb3dTdHJpbmd9c2VsZWN0W0Bmb3JtY29udHJvbG5hbWU9J2RhdGFUeXBlJ11gKSk7XG4gICAgICBpbnB1dC5jbGljaygpO1xuICAgICAgaW5wdXQuZWxlbWVudChieS5jc3NDb250YWluaW5nVGV4dCgnb3B0aW9uJywgdHlwZSkpLmNsaWNrKCk7XG4gICAgfSxcbiAgICBzZXQgcmVxdWlyZWQocmVxdWlyZWQ6IGJvb2xlYW4pIHtcbiAgICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IGVsZW1lbnQoYnkueHBhdGgoYCR7cm93U3RyaW5nfWlucHV0W0Bmb3JtY29udHJvbG5hbWU9XCJyZXF1aXJlZFwiXWApKTtcbiAgICAgICAgaW5wdXQuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5IHtcbiAgdHlwZTogc3RyaW5nIHwgUHJvbWlzZUxpa2U8c3RyaW5nPjtcbiAgY29sb3I6IHN0cmluZyB8IFByb21pc2VMaWtlPHN0cmluZz47XG4gIGljb246IHN0cmluZyB8IFByb21pc2VMaWtlPHN0cmluZz47XG4gIGNsaWNrU2F2ZTogRnVuY3Rpb247XG59XG4iXX0=