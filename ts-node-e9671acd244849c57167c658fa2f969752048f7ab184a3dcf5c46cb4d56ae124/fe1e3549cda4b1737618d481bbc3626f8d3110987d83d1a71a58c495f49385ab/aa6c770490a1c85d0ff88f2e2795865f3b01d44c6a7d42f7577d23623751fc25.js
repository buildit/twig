"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var viewMenu_1 = require("./viewMenu");
var protractor_1 = require("protractor");
var tabPath = "//app-header-twiglet";
var TwigletTab = (function () {
    function TwigletTab(header) {
        this.viewMenu = new viewMenu_1.ViewMenu();
        this.header = header;
    }
    /**
     * Gets the parent div of a label, used to quickly navigate around .form-groups
     *
     * @private
     * @param {any} labelText the text of the label
     * @returns {ElementFinder}
     *
     * @memberOf TwigletTab
     */
    TwigletTab.prototype.getParentOfTwigletGroup = function (twigletName) {
        return protractor_1.element(protractor_1.by.xpath("//app-twiglet-dropdown//div[@class='d-inline-block maindropdown dropdown show']"
            + ("/ul/li//span[text()=\"" + twigletName + "\"]/parent::*")));
    };
    TwigletTab.prototype.openTwigletMenu = function () {
        protractor_1.element(protractor_1.by.xpath('//button[@id="twigletDropdownMenu"]/span[1]')).click();
    };
    TwigletTab.prototype.openChangelogMenu = function () {
        protractor_1.element(protractor_1.by.css('.changelog-menu')).click();
    };
    TwigletTab.prototype.startNewTwigletProcess = function () {
        this.switchToCorrectTabIfNeeded();
        this.openTwigletMenu();
        var newTwigletButton = protractor_1.element(protractor_1.by.xpath("//app-splash//button[@class='clickable button no-margin btn-sm']/i[@class='fa fa-plus']"));
        newTwigletButton.click();
    };
    TwigletTab.prototype.startViewTwigletProcess = function (twigletName) {
        this.switchToCorrectTabIfNeeded();
        this.openTwigletMenu();
        var twigletButton = protractor_1.element(protractor_1.by.xpath("//div[@id='twigletTab-panel']//app-twiglet-dropdown//li[text()='" + twigletName + "']"));
        twigletButton.click();
    };
    TwigletTab.prototype.startDeleteTwigletProcess = function (twigletName) {
        this.switchToCorrectTabIfNeeded();
        this.openTwigletMenu();
        var parent = this.getParentOfTwigletGroup(twigletName);
        parent.element(protractor_1.by.css('i.fa-trash')).click();
    };
    TwigletTab.prototype.deleteTwigletIfNeeded = function (twigletName, page) {
        var _this = this;
        this.switchToCorrectTabIfNeeded();
        this.openTwigletMenu();
        return protractor_1.element.all(protractor_1.by.css('.clickable')).getText().then(function (twiglets) {
            if (twiglets.includes(twigletName)) {
                var parent_1 = _this.getParentOfTwigletGroup(twigletName);
                parent_1.element(protractor_1.by.css('i.fa-trash')).click();
                page.formForModals.fillInOnlyTextField(twigletName);
                page.formForModals.clickButton('Delete');
            }
        });
    };
    TwigletTab.prototype.switchToCorrectTabIfNeeded = function () {
        var _this = this;
        return this.header.activeTab.then(function (activeTabText) {
            if (activeTabText !== 'Twiglet') {
                return _this.header.goToTab('Twiglet');
            }
        });
    };
    return TwigletTab;
}());
exports.TwigletTab = TwigletTab;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci90d2lnbGV0VGFiL2luZGV4LnRzIiwic291cmNlcyI6WyIvdHdpZy9lMmUvUGFnZU9iamVjdHMvaGVhZGVyL3R3aWdsZXRUYWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBc0M7QUFDdEMseUNBQWlFO0FBS2pFLElBQU0sT0FBTyxHQUFHLHNCQUFzQixDQUFDO0FBQ3ZDO0lBR0Usb0JBQVksTUFBTTtRQURsQixhQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUE7UUFFdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssNENBQXVCLEdBQS9CLFVBQWdDLFdBQVc7UUFDekMsTUFBTSxDQUFDLG9CQUFPLENBQ1osZUFBRSxDQUFDLEtBQUssQ0FBQyxpRkFBaUY7ZUFDdEYsMkJBQXdCLFdBQVcsa0JBQWMsQ0FBQSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsb0NBQWUsR0FBZjtRQUNFLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDM0UsQ0FBQztJQUVELHNDQUFpQixHQUFqQjtRQUNFLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELDJDQUFzQixHQUF0QjtRQUNFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFNLGdCQUFnQixHQUNwQixvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMseUZBQXlGLENBQUMsQ0FBQyxDQUFDO1FBQy9HLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCw0Q0FBdUIsR0FBdkIsVUFBd0IsV0FBVztRQUNqQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBTSxhQUFhLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLHFFQUFtRSxXQUFXLE9BQUksQ0FBQyxDQUFDLENBQUM7UUFDNUgsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCw4Q0FBeUIsR0FBekIsVUFBMEIsV0FBVztRQUNuQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCwwQ0FBcUIsR0FBckIsVUFBc0IsV0FBVyxFQUFFLElBQUk7UUFBdkMsaUJBV0M7UUFWQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsTUFBTSxDQUFDLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQzlELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFNLFFBQU0sR0FBRyxLQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pELFFBQU0sQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3QyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sK0NBQTBCLEdBQWxDO1FBQUEsaUJBTUM7UUFMQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsYUFBYTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUF4RUQsSUF3RUM7QUF4RVksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaWV3TWVudSB9IGZyb20gJy4vdmlld01lbnUnO1xuaW1wb3J0IHsgYnJvd3NlciwgYnksIGVsZW1lbnQsIEVsZW1lbnRGaW5kZXIgfSBmcm9tICdwcm90cmFjdG9yJztcblxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSAnLi8uLi8nO1xuaW1wb3J0IHsgZGVsZXRlRGVmYXVsdEpzb25JbXBvcnRlZFR3aWdsZXQgfSBmcm9tICcuLy4uLy4uLy4uL3V0aWxzJztcblxuY29uc3QgdGFiUGF0aCA9IGAvL2FwcC1oZWFkZXItdHdpZ2xldGA7XG5leHBvcnQgY2xhc3MgVHdpZ2xldFRhYiB7XG4gIHByaXZhdGUgaGVhZGVyOiBIZWFkZXI7XG4gIHZpZXdNZW51ID0gbmV3IFZpZXdNZW51KClcbiAgY29uc3RydWN0b3IoaGVhZGVyKSB7XG4gICAgdGhpcy5oZWFkZXIgPSBoZWFkZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcGFyZW50IGRpdiBvZiBhIGxhYmVsLCB1c2VkIHRvIHF1aWNrbHkgbmF2aWdhdGUgYXJvdW5kIC5mb3JtLWdyb3Vwc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2FueX0gbGFiZWxUZXh0IHRoZSB0ZXh0IG9mIHRoZSBsYWJlbFxuICAgKiBAcmV0dXJucyB7RWxlbWVudEZpbmRlcn1cbiAgICpcbiAgICogQG1lbWJlck9mIFR3aWdsZXRUYWJcbiAgICovXG4gIHByaXZhdGUgZ2V0UGFyZW50T2ZUd2lnbGV0R3JvdXAodHdpZ2xldE5hbWUpOiBFbGVtZW50RmluZGVyIHtcbiAgICByZXR1cm4gZWxlbWVudChcbiAgICAgIGJ5LnhwYXRoKGAvL2FwcC10d2lnbGV0LWRyb3Bkb3duLy9kaXZbQGNsYXNzPSdkLWlubGluZS1ibG9jayBtYWluZHJvcGRvd24gZHJvcGRvd24gc2hvdyddYFxuICAgICAgICArIGAvdWwvbGkvL3NwYW5bdGV4dCgpPVwiJHt0d2lnbGV0TmFtZX1cIl0vcGFyZW50OjoqYCkpO1xuICB9XG5cbiAgb3BlblR3aWdsZXRNZW51KCkge1xuICAgIGVsZW1lbnQoYnkueHBhdGgoJy8vYnV0dG9uW0BpZD1cInR3aWdsZXREcm9wZG93bk1lbnVcIl0vc3BhblsxXScpKS5jbGljaygpO1xuICB9XG5cbiAgb3BlbkNoYW5nZWxvZ01lbnUoKSB7XG4gICAgZWxlbWVudChieS5jc3MoJy5jaGFuZ2Vsb2ctbWVudScpKS5jbGljaygpO1xuICB9XG5cbiAgc3RhcnROZXdUd2lnbGV0UHJvY2VzcygpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdFRhYklmTmVlZGVkKCk7XG4gICAgdGhpcy5vcGVuVHdpZ2xldE1lbnUoKTtcbiAgICBjb25zdCBuZXdUd2lnbGV0QnV0dG9uID1cbiAgICAgIGVsZW1lbnQoYnkueHBhdGgoYC8vYXBwLXNwbGFzaC8vYnV0dG9uW0BjbGFzcz0nY2xpY2thYmxlIGJ1dHRvbiBuby1tYXJnaW4gYnRuLXNtJ10vaVtAY2xhc3M9J2ZhIGZhLXBsdXMnXWApKTtcbiAgICBuZXdUd2lnbGV0QnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICBzdGFydFZpZXdUd2lnbGV0UHJvY2Vzcyh0d2lnbGV0TmFtZSkge1xuICAgIHRoaXMuc3dpdGNoVG9Db3JyZWN0VGFiSWZOZWVkZWQoKTtcbiAgICB0aGlzLm9wZW5Ud2lnbGV0TWVudSgpO1xuICAgIGNvbnN0IHR3aWdsZXRCdXR0b24gPSBlbGVtZW50KGJ5LnhwYXRoKGAvL2RpdltAaWQ9J3R3aWdsZXRUYWItcGFuZWwnXS8vYXBwLXR3aWdsZXQtZHJvcGRvd24vL2xpW3RleHQoKT0nJHt0d2lnbGV0TmFtZX0nXWApKTtcbiAgICB0d2lnbGV0QnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICBzdGFydERlbGV0ZVR3aWdsZXRQcm9jZXNzKHR3aWdsZXROYW1lKSB7XG4gICAgdGhpcy5zd2l0Y2hUb0NvcnJlY3RUYWJJZk5lZWRlZCgpO1xuICAgIHRoaXMub3BlblR3aWdsZXRNZW51KCk7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZlR3aWdsZXRHcm91cCh0d2lnbGV0TmFtZSk7XG4gICAgcGFyZW50LmVsZW1lbnQoYnkuY3NzKCdpLmZhLXRyYXNoJykpLmNsaWNrKCk7XG4gIH1cblxuICBkZWxldGVUd2lnbGV0SWZOZWVkZWQodHdpZ2xldE5hbWUsIHBhZ2UpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdFRhYklmTmVlZGVkKCk7XG4gICAgdGhpcy5vcGVuVHdpZ2xldE1lbnUoKTtcbiAgICByZXR1cm4gZWxlbWVudC5hbGwoYnkuY3NzKCcuY2xpY2thYmxlJykpLmdldFRleHQoKS50aGVuKHR3aWdsZXRzID0+IHtcbiAgICAgIGlmICh0d2lnbGV0cy5pbmNsdWRlcyh0d2lnbGV0TmFtZSkpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZlR3aWdsZXRHcm91cCh0d2lnbGV0TmFtZSk7XG4gICAgICAgIHBhcmVudC5lbGVtZW50KGJ5LmNzcygnaS5mYS10cmFzaCcpKS5jbGljaygpO1xuICAgICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuZmlsbEluT25seVRleHRGaWVsZCh0d2lnbGV0TmFtZSk7XG4gICAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignRGVsZXRlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvQ29ycmVjdFRhYklmTmVlZGVkKCkge1xuICAgIHJldHVybiB0aGlzLmhlYWRlci5hY3RpdmVUYWIudGhlbihhY3RpdmVUYWJUZXh0ID0+IHtcbiAgICAgIGlmIChhY3RpdmVUYWJUZXh0ICE9PSAnVHdpZ2xldCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhZGVyLmdvVG9UYWIoJ1R3aWdsZXQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19