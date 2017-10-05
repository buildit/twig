"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var basePath = "app-view-dropdown";
var ViewMenu = (function () {
    function ViewMenu() {
    }
    ViewMenu.prototype.getParentOfViewGroup = function (viewName) {
        return protractor_1.element(protractor_1.by.xpath("//" + basePath + "//li[contains(@class, 'view-list-item')]/span[text()=\"" + viewName + "\"]/parent::*"));
    };
    Object.defineProperty(ViewMenu.prototype, "viewCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.css(basePath + " li.view-list-item")).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    ViewMenu.prototype.openViewMenu = function () {
        return protractor_1.element(protractor_1.by.xpath("//" + basePath + "//button[@id=\"viewDropdownMenu\"]/span[1]")).click();
    };
    ViewMenu.prototype.startNewViewProcess = function () {
        this.openViewMenu();
        var newViewButton = protractor_1.element(protractor_1.by.xpath("//app-breadcrumb-navigation//button[@ngbtooltip=\"Create New View\"]"));
        newViewButton.click();
    };
    ViewMenu.prototype.startViewViewProcess = function (viewName) {
        this.openViewMenu();
        var viewButton = protractor_1.element(protractor_1.by.xpath("//" + basePath + "//li[contains(@class, 'view-list-item')]/span[text()=\"" + viewName + "\"]"));
        return viewButton.click();
    };
    ViewMenu.prototype.startEditViewProcess = function () {
        return protractor_1.element(protractor_1.by.xpath('//button[@ngbtooltip="Edit View"]')).click();
    };
    ViewMenu.prototype.startSaveViewProcess = function (viewName) {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet'));
        var button = self.element(protractor_1.by.cssContainingText('button', 'Save'));
        button.click();
    };
    ViewMenu.prototype.startDeleteViewProcess = function (viewName) {
        this.openViewMenu();
        var parent = this.getParentOfViewGroup(viewName);
        protractor_1.browser.waitForAngular();
        return parent.element(protractor_1.by.css('i.fa-trash')).click();
    };
    return ViewMenu;
}());
exports.ViewMenu = ViewMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci90d2lnbGV0VGFiL3ZpZXdNZW51L2luZGV4LnRzIiwic291cmNlcyI6WyIvdHdpZy9lMmUvUGFnZU9iamVjdHMvaGVhZGVyL3R3aWdsZXRUYWIvdmlld01lbnUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUU7QUFFakUsSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUM7QUFDckM7SUFBQTtJQTJDQSxDQUFDO0lBMUNTLHVDQUFvQixHQUE1QixVQUE2QixRQUFRO1FBQ25DLE1BQU0sQ0FBQyxvQkFBTyxDQUNaLGVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBSyxRQUFRLCtEQUF5RCxRQUFRLGtCQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzVHLENBQUM7SUFFRCxzQkFBSSwrQkFBUzthQUFiO1lBQ0UsTUFBTSxDQUFDLG9CQUFPLENBQUMsWUFBWSxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUksUUFBUSx1QkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLE1BQU0sRUFBZixDQUFlLENBQUMsQ0FBQztRQUN6RyxDQUFDOzs7T0FBQTtJQUVELCtCQUFZLEdBQVo7UUFDRSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLE9BQUssUUFBUSwrQ0FBMEMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUYsQ0FBQztJQUVELHNDQUFtQixHQUFuQjtRQUNFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFNLGFBQWEsR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMsc0VBQW9FLENBQUMsQ0FBQyxDQUFDO1FBQzlHLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsdUNBQW9CLEdBQXBCLFVBQXFCLFFBQVE7UUFDM0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQU0sVUFBVSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FDL0IsT0FBSyxRQUFRLCtEQUF5RCxRQUFRLFFBQUksQ0FBQyxDQUFDLENBQUM7UUFDekYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsdUNBQW9CLEdBQXBCO1FBQ0UsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEUsQ0FBQztJQUVELHVDQUFvQixHQUFwQixVQUFxQixRQUFRO1FBQzNCLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCx5Q0FBc0IsR0FBdEIsVUFBdUIsUUFBUTtRQUM3QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELG9CQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQTNDRCxJQTJDQztBQTNDWSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIsIGJ5LCBlbGVtZW50LCBFbGVtZW50RmluZGVyIH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmNvbnN0IGJhc2VQYXRoID0gYGFwcC12aWV3LWRyb3Bkb3duYDtcbmV4cG9ydCBjbGFzcyBWaWV3TWVudSB7XG4gIHByaXZhdGUgZ2V0UGFyZW50T2ZWaWV3R3JvdXAodmlld05hbWUpOiBFbGVtZW50RmluZGVyIHtcbiAgICByZXR1cm4gZWxlbWVudChcbiAgICAgIGJ5LnhwYXRoKGAvLyR7YmFzZVBhdGh9Ly9saVtjb250YWlucyhAY2xhc3MsICd2aWV3LWxpc3QtaXRlbScpXS9zcGFuW3RleHQoKT1cIiR7dmlld05hbWV9XCJdL3BhcmVudDo6KmApKTtcbiAgfVxuXG4gIGdldCB2aWV3Q291bnQoKSB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZmluZEVsZW1lbnRzKGJ5LmNzcyhgJHtiYXNlUGF0aH0gbGkudmlldy1saXN0LWl0ZW1gKSkudGhlbihlbGVtZW50cyA9PiBlbGVtZW50cy5sZW5ndGgpO1xuICB9XG5cbiAgb3BlblZpZXdNZW51KCkge1xuICAgIHJldHVybiBlbGVtZW50KGJ5LnhwYXRoKGAvLyR7YmFzZVBhdGh9Ly9idXR0b25bQGlkPVwidmlld0Ryb3Bkb3duTWVudVwiXS9zcGFuWzFdYCkpLmNsaWNrKCk7XG4gIH1cblxuICBzdGFydE5ld1ZpZXdQcm9jZXNzKCkge1xuICAgIHRoaXMub3BlblZpZXdNZW51KCk7XG4gICAgY29uc3QgbmV3Vmlld0J1dHRvbiA9IGVsZW1lbnQoYnkueHBhdGgoYC8vYXBwLWJyZWFkY3J1bWItbmF2aWdhdGlvbi8vYnV0dG9uW0BuZ2J0b29sdGlwPVwiQ3JlYXRlIE5ldyBWaWV3XCJdYCkpO1xuICAgIG5ld1ZpZXdCdXR0b24uY2xpY2soKTtcbiAgfVxuXG4gIHN0YXJ0Vmlld1ZpZXdQcm9jZXNzKHZpZXdOYW1lKSB7XG4gICAgdGhpcy5vcGVuVmlld01lbnUoKTtcbiAgICBjb25zdCB2aWV3QnV0dG9uID0gZWxlbWVudChieS54cGF0aChcbiAgICAgICAgYC8vJHtiYXNlUGF0aH0vL2xpW2NvbnRhaW5zKEBjbGFzcywgJ3ZpZXctbGlzdC1pdGVtJyldL3NwYW5bdGV4dCgpPVwiJHt2aWV3TmFtZX1cIl1gKSk7XG4gICAgcmV0dXJuIHZpZXdCdXR0b24uY2xpY2soKTtcbiAgfVxuXG4gIHN0YXJ0RWRpdFZpZXdQcm9jZXNzKCkge1xuICAgIHJldHVybiBlbGVtZW50KGJ5LnhwYXRoKCcvL2J1dHRvbltAbmdidG9vbHRpcD1cIkVkaXQgVmlld1wiXScpKS5jbGljaygpO1xuICB9XG5cbiAgc3RhcnRTYXZlVmlld1Byb2Nlc3Modmlld05hbWUpIHtcbiAgICBjb25zdCBzZWxmID0gZWxlbWVudChieS5jc3MoJ2FwcC1oZWFkZXItdHdpZ2xldCcpKTtcbiAgICBjb25zdCBidXR0b24gPSBzZWxmLmVsZW1lbnQoYnkuY3NzQ29udGFpbmluZ1RleHQoJ2J1dHRvbicsICdTYXZlJykpO1xuICAgIGJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgc3RhcnREZWxldGVWaWV3UHJvY2Vzcyh2aWV3TmFtZSkge1xuICAgIHRoaXMub3BlblZpZXdNZW51KCk7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZlZpZXdHcm91cCh2aWV3TmFtZSk7XG4gICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xuICAgIHJldHVybiBwYXJlbnQuZWxlbWVudChieS5jc3MoJ2kuZmEtdHJhc2gnKSkuY2xpY2soKTtcbiAgfVxufVxuIl19