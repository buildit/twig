"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var tabPath = "//app-environment-controls";
var EnvironmentMenu = (function () {
    function EnvironmentMenu(accordion) {
        this.accordion = accordion;
    }
    EnvironmentMenu.prototype.toggleByLabel = function (labelName) {
        var parent = this.getGroupByLabel(labelName);
        var toggle = parent.element(protractor_1.by.css('.slider.round'));
        return toggle.click();
    };
    EnvironmentMenu.prototype.getGroupByLabel = function (labelName) {
        return protractor_1.element(protractor_1.by.xpath(tabPath + "//label[text()=\"" + labelName + "\"]/parent::*"));
    };
    EnvironmentMenu.prototype.switchToCorrectMenuIfNeeded = function () {
        var _this = this;
        return this.accordion.activeMenu.then(function (activeTabText) {
            if (activeTabText !== 'Environment') {
                return _this.accordion.goToMenu('Environment');
            }
        });
    };
    return EnvironmentMenu;
}());
exports.EnvironmentMenu = EnvironmentMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9lbnZpcm9ubWVudE1lbnUvaW5kZXgudHMiLCJzb3VyY2VzIjpbIi90d2lnL2UyZS9QYWdlT2JqZWN0cy9hY2NvcmRpb24vZW52aXJvbm1lbnRNZW51L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQWlFO0FBSWpFLElBQU0sT0FBTyxHQUFHLDRCQUE0QixDQUFDO0FBQzdDO0lBRUUseUJBQVksU0FBUztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsdUNBQWEsR0FBYixVQUFjLFNBQWlCO1FBQzdCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU8seUNBQWUsR0FBdkIsVUFBd0IsU0FBaUI7UUFDdkMsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBSSxPQUFPLHlCQUFtQixTQUFTLGtCQUFjLENBQUMsQ0FBQyxDQUFBO0lBQ2hGLENBQUM7SUFFTyxxREFBMkIsR0FBbkM7UUFBQSxpQkFNQztRQUxDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBQSxhQUFhO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQXZCRCxJQXVCQztBQXZCWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIsIGJ5LCBlbGVtZW50LCBFbGVtZW50RmluZGVyIH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vLi4vJztcblxuY29uc3QgdGFiUGF0aCA9IGAvL2FwcC1lbnZpcm9ubWVudC1jb250cm9sc2A7XG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRNZW51IHtcbiAgcHJpdmF0ZSBhY2NvcmRpb246IEFjY29yZGlvbjtcbiAgY29uc3RydWN0b3IoYWNjb3JkaW9uKSB7XG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG4gIH1cblxuICB0b2dnbGVCeUxhYmVsKGxhYmVsTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRHcm91cEJ5TGFiZWwobGFiZWxOYW1lKTtcbiAgICBjb25zdCB0b2dnbGUgPSBwYXJlbnQuZWxlbWVudChieS5jc3MoJy5zbGlkZXIucm91bmQnKSk7XG4gICAgcmV0dXJuIHRvZ2dsZS5jbGljaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcm91cEJ5TGFiZWwobGFiZWxOYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gZWxlbWVudChieS54cGF0aChgJHt0YWJQYXRofS8vbGFiZWxbdGV4dCgpPVwiJHtsYWJlbE5hbWV9XCJdL3BhcmVudDo6KmApKVxuICB9XG5cbiAgcHJpdmF0ZSBzd2l0Y2hUb0NvcnJlY3RNZW51SWZOZWVkZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3JkaW9uLmFjdGl2ZU1lbnUudGhlbihhY3RpdmVUYWJUZXh0ID0+IHtcbiAgICAgIGlmIChhY3RpdmVUYWJUZXh0ICE9PSAnRW52aXJvbm1lbnQnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjY29yZGlvbi5nb1RvTWVudSgnRW52aXJvbm1lbnQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19