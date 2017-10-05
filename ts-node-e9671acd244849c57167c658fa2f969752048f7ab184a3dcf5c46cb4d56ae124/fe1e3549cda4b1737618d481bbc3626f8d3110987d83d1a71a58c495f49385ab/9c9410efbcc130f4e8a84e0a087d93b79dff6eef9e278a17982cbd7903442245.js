"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var ownTag = '//app-twiglet-filters';
var FiltersMenu = (function () {
    function FiltersMenu(accordion) {
        this.accordion = accordion;
    }
    Object.defineProperty(FiltersMenu.prototype, "filterCount", {
        get: function () {
            this.switchToCorrectTabIfNeeded();
            return protractor_1.browser.findElements(protractor_1.by.xpath(ownTag + "//div[contains(@class, 'twiglet-filter')]")).then(function (elements) {
                return elements.length;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FiltersMenu.prototype, "filters", {
        get: function () {
            this.switchToCorrectTabIfNeeded();
            return new Proxy([], {
                get: function (target, propKey, receiver) {
                    return filter(ownTag + "//div[contains(@class, 'twiglet-filter')][" + (+propKey + 1) + "]");
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    FiltersMenu.prototype.addFilter = function () {
        this.switchToCorrectTabIfNeeded();
        protractor_1.element(protractor_1.by.xpath(ownTag + "//button[text()=\"Add Filter\"]")).click();
    };
    FiltersMenu.prototype.switchToCorrectTabIfNeeded = function () {
        var _this = this;
        return this.accordion.activeMenu.then(function (activeTabText) {
            if (activeTabText !== 'Filter') {
                return _this.accordion.goToMenu('Filter');
            }
        });
    };
    return FiltersMenu;
}());
exports.FiltersMenu = FiltersMenu;
function filter(groupString) {
    return {
        set type(type) {
            protractor_1.element(protractor_1.by.xpath(groupString + "/select[@formcontrolname=\"type\"]/option[text()=\"" + type + "\"]")).click();
        },
        set key(key) {
            protractor_1.element(protractor_1.by.xpath(groupString + "/select[@formcontrolname=\"key\"]/option[text()=\"" + key + "\"]")).click();
        },
        set param(value) {
            protractor_1.element(protractor_1.by.xpath(groupString + "/select[@formcontrolname=\"value\"]/option[text()=\"" + value + "\"]")).click();
        },
        addTarget: function () {
            protractor_1.element(protractor_1.by.xpath(groupString + "//button[text()=\"Add Target\"]")).click();
        },
        remove: function () {
            protractor_1.element(protractor_1.by.xpath(groupString + "//button[text()=\"Remove Filter\"]")).click();
        },
        get target() {
            var returner = filter(groupString + "//app-twiglet-filter-target/");
            delete returner.addTarget;
            delete returner.remove;
            return returner;
        }
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9maWx0ZXJzTWVudS9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9maWx0ZXJzTWVudS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFpRTtBQUlqRSxJQUFNLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQztBQUV2QztJQUlFLHFCQUFZLFNBQVM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVELHNCQUFJLG9DQUFXO2FBQWY7WUFDRSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxZQUFZLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBSSxNQUFNLDhDQUEyQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUN2RyxPQUFBLFFBQVEsQ0FBQyxNQUFNO1lBQWYsQ0FBZSxDQUNoQixDQUFDO1FBQ0osQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxnQ0FBTzthQUFYO1lBQ0UsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7WUFDbEMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDbkIsR0FBRyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUTtvQkFDM0IsTUFBTSxDQUFDLE1BQU0sQ0FBSSxNQUFNLG1EQUE2QyxDQUFFLE9BQWtCLEdBQUcsQ0FBQyxPQUFHLENBQUMsQ0FBQztnQkFDbkcsQ0FBQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7OztPQUFBO0lBRUQsK0JBQVMsR0FBVDtRQUNFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ2xDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBSSxNQUFNLG9DQUErQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0lBRU8sZ0RBQTBCLEdBQWxDO1FBQUEsaUJBTUM7UUFMQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUEsYUFBYTtZQUNqRCxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0M7QUFwQ1ksa0NBQVc7QUFzQ3hCLGdCQUFnQixXQUFXO0lBQ3pCLE1BQU0sQ0FBQztRQUNMLElBQUksSUFBSSxDQUFDLElBQUk7WUFDWCxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksV0FBVywyREFBbUQsSUFBSSxRQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZHLENBQUM7UUFDRCxJQUFJLEdBQUcsQ0FBQyxHQUFHO1lBQ1Qsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFJLFdBQVcsMERBQWtELEdBQUcsUUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyRyxDQUFDO1FBQ0QsSUFBSSxLQUFLLENBQUMsS0FBSztZQUNiLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBSSxXQUFXLDREQUFvRCxLQUFLLFFBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekcsQ0FBQztRQUNELFNBQVM7WUFDUCxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksV0FBVyxvQ0FBK0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0UsQ0FBQztRQUNELE1BQU07WUFDSixvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksV0FBVyx1Q0FBa0MsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUUsQ0FBQztRQUNELElBQUksTUFBTTtZQUNSLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBSSxXQUFXLGlDQUE4QixDQUFDLENBQUM7WUFDdEUsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzFCLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN2QixNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIsIGJ5LCBlbGVtZW50LCBFbGVtZW50RmluZGVyIH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vLi4vJztcblxuY29uc3Qgb3duVGFnID0gJy8vYXBwLXR3aWdsZXQtZmlsdGVycyc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJzTWVudSB7XG5cbiAgcHJpdmF0ZSBhY2NvcmRpb246IEFjY29yZGlvbjtcblxuICBjb25zdHJ1Y3RvcihhY2NvcmRpb24pIHtcbiAgICB0aGlzLmFjY29yZGlvbiA9IGFjY29yZGlvbjtcbiAgfVxuXG4gIGdldCBmaWx0ZXJDb3VudCgpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdFRhYklmTmVlZGVkKCk7XG4gICAgcmV0dXJuIGJyb3dzZXIuZmluZEVsZW1lbnRzKGJ5LnhwYXRoKGAke293blRhZ30vL2Rpdltjb250YWlucyhAY2xhc3MsICd0d2lnbGV0LWZpbHRlcicpXWApKS50aGVuKGVsZW1lbnRzID0+XG4gICAgICBlbGVtZW50cy5sZW5ndGhcbiAgICApO1xuICB9XG5cbiAgZ2V0IGZpbHRlcnMoKTogRmlsdGVyW10ge1xuICAgIHRoaXMuc3dpdGNoVG9Db3JyZWN0VGFiSWZOZWVkZWQoKTtcbiAgICByZXR1cm4gbmV3IFByb3h5KFtdLCB7XG4gICAgICBnZXQodGFyZ2V0LCBwcm9wS2V5LCByZWNlaXZlcikge1xuICAgICAgICByZXR1cm4gZmlsdGVyKGAke293blRhZ30vL2Rpdltjb250YWlucyhAY2xhc3MsICd0d2lnbGV0LWZpbHRlcicpXVskeysocHJvcEtleSBhcyBzdHJpbmcpICsgMX1dYCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhZGRGaWx0ZXIoKSB7XG4gICAgdGhpcy5zd2l0Y2hUb0NvcnJlY3RUYWJJZk5lZWRlZCgpO1xuICAgIGVsZW1lbnQoYnkueHBhdGgoYCR7b3duVGFnfS8vYnV0dG9uW3RleHQoKT1cIkFkZCBGaWx0ZXJcIl1gKSkuY2xpY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgc3dpdGNoVG9Db3JyZWN0VGFiSWZOZWVkZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3JkaW9uLmFjdGl2ZU1lbnUudGhlbihhY3RpdmVUYWJUZXh0ID0+IHtcbiAgICAgIGlmIChhY3RpdmVUYWJUZXh0ICE9PSAnRmlsdGVyJykge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2NvcmRpb24uZ29Ub01lbnUoJ0ZpbHRlcicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbHRlcihncm91cFN0cmluZyk6IEZpbHRlciB7XG4gIHJldHVybiB7XG4gICAgc2V0IHR5cGUodHlwZSkge1xuICAgICAgZWxlbWVudChieS54cGF0aChgJHtncm91cFN0cmluZ30vc2VsZWN0W0Bmb3JtY29udHJvbG5hbWU9XCJ0eXBlXCJdL29wdGlvblt0ZXh0KCk9XCIke3R5cGV9XCJdYCkpLmNsaWNrKCk7XG4gICAgfSxcbiAgICBzZXQga2V5KGtleSkge1xuICAgICAgZWxlbWVudChieS54cGF0aChgJHtncm91cFN0cmluZ30vc2VsZWN0W0Bmb3JtY29udHJvbG5hbWU9XCJrZXlcIl0vb3B0aW9uW3RleHQoKT1cIiR7a2V5fVwiXWApKS5jbGljaygpO1xuICAgIH0sXG4gICAgc2V0IHBhcmFtKHZhbHVlKSB7XG4gICAgICBlbGVtZW50KGJ5LnhwYXRoKGAke2dyb3VwU3RyaW5nfS9zZWxlY3RbQGZvcm1jb250cm9sbmFtZT1cInZhbHVlXCJdL29wdGlvblt0ZXh0KCk9XCIke3ZhbHVlfVwiXWApKS5jbGljaygpO1xuICAgIH0sXG4gICAgYWRkVGFyZ2V0KCkge1xuICAgICAgZWxlbWVudChieS54cGF0aChgJHtncm91cFN0cmluZ30vL2J1dHRvblt0ZXh0KCk9XCJBZGQgVGFyZ2V0XCJdYCkpLmNsaWNrKCk7XG4gICAgfSxcbiAgICByZW1vdmUoKSB7XG4gICAgICBlbGVtZW50KGJ5LnhwYXRoKGAke2dyb3VwU3RyaW5nfS8vYnV0dG9uW3RleHQoKT1cIlJlbW92ZSBGaWx0ZXJcIl1gKSkuY2xpY2soKTtcbiAgICB9LFxuICAgIGdldCB0YXJnZXQoKTogQmFzaWNGaWx0ZXIge1xuICAgICAgY29uc3QgcmV0dXJuZXIgPSBmaWx0ZXIoYCR7Z3JvdXBTdHJpbmd9Ly9hcHAtdHdpZ2xldC1maWx0ZXItdGFyZ2V0L2ApO1xuICAgICAgZGVsZXRlIHJldHVybmVyLmFkZFRhcmdldDtcbiAgICAgIGRlbGV0ZSByZXR1cm5lci5yZW1vdmU7XG4gICAgICByZXR1cm4gcmV0dXJuZXI7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbHRlciBleHRlbmRzIEJhc2ljRmlsdGVyIHtcbiAgYWRkVGFyZ2V0OiAoKSA9PiB2b2lkO1xuICByZW1vdmU6ICgpID0+IHZvaWQ7XG4gIHRhcmdldDogQmFzaWNGaWx0ZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzaWNGaWx0ZXIge1xuICB0eXBlOiBzdHJpbmc7XG4gIGtleTogc3RyaW5nO1xuICBwYXJhbTogc3RyaW5nO1xufVxuIl19