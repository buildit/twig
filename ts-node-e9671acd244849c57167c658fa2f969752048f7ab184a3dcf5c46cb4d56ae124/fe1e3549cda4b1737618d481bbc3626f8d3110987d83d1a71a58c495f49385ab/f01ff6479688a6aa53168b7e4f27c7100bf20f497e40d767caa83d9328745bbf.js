"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var tabPath = "//app-header-model";
var ModelTab = (function () {
    function ModelTab(header) {
        this.header = header;
    }
    /**
     * Gets the parent div of a label, used to quickly navigate around .form-groups
     *
     * @private
     * @param {any} labelText the text of the label
     * @returns {ElementFinder}
     *
     * @memberOf ModelTab
     */
    ModelTab.prototype.getParentOfModelGroup = function (modelName) {
        return protractor_1.element(protractor_1.by.xpath("//app-model-dropdown//div[@class='d-inline-block maindropdown dropdown show']"
            + ("/ul/li//span[text()=\"" + modelName + "\"]/parent::*")));
    };
    ModelTab.prototype.openModelMenu = function () {
        protractor_1.element(protractor_1.by.xpath('//button[@id="modelDropdownMenu"]/span[1]')).click();
    };
    ModelTab.prototype.startNewModelProcess = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-model'));
        var button = self.element(protractor_1.by.className('fa fa-plus'));
        button.click();
    };
    ModelTab.prototype.startModelEditProcess = function (modelName) {
        this.switchToCorrectTabIfNeeded();
        this.openModelMenu();
        var parent = this.getParentOfModelGroup(modelName);
        var text = parent.element(protractor_1.by.className('clickable col-6'));
        text.click();
        protractor_1.element(protractor_1.by.xpath('//app-header-model//button[text()="Edit"]')).click();
    };
    ModelTab.prototype.startDeleteModelProcess = function (modelName) {
        this.switchToCorrectTabIfNeeded();
        this.openModelMenu();
        var parent = this.getParentOfModelGroup(modelName);
        parent.element(protractor_1.by.css('i.fa-trash')).click();
    };
    ModelTab.prototype.deleteModelIfNeeded = function (modelName, page) {
        var _this = this;
        this.switchToCorrectTabIfNeeded();
        this.openModelMenu();
        protractor_1.element.all(protractor_1.by.css('.clickable')).getText().then(function (models) {
            if (models.includes(modelName)) {
                var parent_1 = _this.getParentOfModelGroup(modelName);
                parent_1.element(protractor_1.by.css('i.fa-trash')).click();
                page.formForModals.fillInOnlyTextField(modelName);
                page.formForModals.clickButton('Delete');
            }
        });
    };
    ModelTab.prototype.switchToCorrectTabIfNeeded = function () {
        var _this = this;
        return this.header.activeTab.then(function (activeTabText) {
            if (activeTabText !== 'Model') {
                return _this.header.goToTab('Model');
            }
        });
    };
    return ModelTab;
}());
exports.ModelTab = ModelTab;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci9tb2RlbFRhYi9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci9tb2RlbFRhYi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFpRTtBQUlqRSxJQUFNLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQztBQUNyQztJQUVFLGtCQUFZLE1BQU07UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssd0NBQXFCLEdBQTdCLFVBQThCLFNBQVM7UUFDckMsTUFBTSxDQUFDLG9CQUFPLENBQ1osZUFBRSxDQUFDLEtBQUssQ0FBQywrRUFBK0U7ZUFDdEYsMkJBQXdCLFNBQVMsa0JBQWMsQ0FBQSxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsZ0NBQWEsR0FBYjtRQUNFLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekUsQ0FBQztJQUVELHVDQUFvQixHQUFwQjtRQUNFLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCx3Q0FBcUIsR0FBckIsVUFBc0IsU0FBUztRQUM3QixJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2Isb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6RSxDQUFDO0lBRUQsMENBQXVCLEdBQXZCLFVBQXdCLFNBQVM7UUFDL0IsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsc0NBQW1CLEdBQW5CLFVBQW9CLFNBQVMsRUFBRSxJQUFJO1FBQW5DLGlCQVdDO1FBVkMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFNLFFBQU0sR0FBRyxLQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JELFFBQU0sQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3QyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sNkNBQTBCLEdBQWxDO1FBQUEsaUJBTUM7UUFMQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsYUFBYTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQW5FRCxJQW1FQztBQW5FWSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIsIGJ5LCBlbGVtZW50LCBFbGVtZW50RmluZGVyIH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmltcG9ydCB7IEhlYWRlciB9IGZyb20gJy4vLi4vJztcblxuY29uc3QgdGFiUGF0aCA9IGAvL2FwcC1oZWFkZXItbW9kZWxgO1xuZXhwb3J0IGNsYXNzIE1vZGVsVGFiIHtcbiAgcHJpdmF0ZSBoZWFkZXI6IEhlYWRlcjtcbiAgY29uc3RydWN0b3IoaGVhZGVyKSB7XG4gICAgdGhpcy5oZWFkZXIgPSBoZWFkZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcGFyZW50IGRpdiBvZiBhIGxhYmVsLCB1c2VkIHRvIHF1aWNrbHkgbmF2aWdhdGUgYXJvdW5kIC5mb3JtLWdyb3Vwc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2FueX0gbGFiZWxUZXh0IHRoZSB0ZXh0IG9mIHRoZSBsYWJlbFxuICAgKiBAcmV0dXJucyB7RWxlbWVudEZpbmRlcn1cbiAgICpcbiAgICogQG1lbWJlck9mIE1vZGVsVGFiXG4gICAqL1xuICBwcml2YXRlIGdldFBhcmVudE9mTW9kZWxHcm91cChtb2RlbE5hbWUpOiBFbGVtZW50RmluZGVyIHtcbiAgICByZXR1cm4gZWxlbWVudChcbiAgICAgIGJ5LnhwYXRoKGAvL2FwcC1tb2RlbC1kcm9wZG93bi8vZGl2W0BjbGFzcz0nZC1pbmxpbmUtYmxvY2sgbWFpbmRyb3Bkb3duIGRyb3Bkb3duIHNob3cnXWBcbiAgICAgICsgYC91bC9saS8vc3Bhblt0ZXh0KCk9XCIke21vZGVsTmFtZX1cIl0vcGFyZW50OjoqYCkpO1xuICB9XG5cbiAgb3Blbk1vZGVsTWVudSgpIHtcbiAgICBlbGVtZW50KGJ5LnhwYXRoKCcvL2J1dHRvbltAaWQ9XCJtb2RlbERyb3Bkb3duTWVudVwiXS9zcGFuWzFdJykpLmNsaWNrKCk7XG4gIH1cblxuICBzdGFydE5ld01vZGVsUHJvY2VzcygpIHtcbiAgICBjb25zdCBzZWxmID0gZWxlbWVudChieS5jc3MoJ2FwcC1oZWFkZXItbW9kZWwnKSk7XG4gICAgY29uc3QgYnV0dG9uID0gc2VsZi5lbGVtZW50KGJ5LmNsYXNzTmFtZSgnZmEgZmEtcGx1cycpKTtcbiAgICBidXR0b24uY2xpY2soKTtcbiAgfVxuXG4gIHN0YXJ0TW9kZWxFZGl0UHJvY2Vzcyhtb2RlbE5hbWUpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdFRhYklmTmVlZGVkKCk7XG4gICAgdGhpcy5vcGVuTW9kZWxNZW51KCk7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZk1vZGVsR3JvdXAobW9kZWxOYW1lKTtcbiAgICBjb25zdCB0ZXh0ID0gcGFyZW50LmVsZW1lbnQoYnkuY2xhc3NOYW1lKCdjbGlja2FibGUgY29sLTYnKSk7XG4gICAgdGV4dC5jbGljaygpO1xuICAgIGVsZW1lbnQoYnkueHBhdGgoJy8vYXBwLWhlYWRlci1tb2RlbC8vYnV0dG9uW3RleHQoKT1cIkVkaXRcIl0nKSkuY2xpY2soKTtcbiAgfVxuXG4gIHN0YXJ0RGVsZXRlTW9kZWxQcm9jZXNzKG1vZGVsTmFtZSkge1xuICAgIHRoaXMuc3dpdGNoVG9Db3JyZWN0VGFiSWZOZWVkZWQoKTtcbiAgICB0aGlzLm9wZW5Nb2RlbE1lbnUoKTtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudE9mTW9kZWxHcm91cChtb2RlbE5hbWUpO1xuICAgIHBhcmVudC5lbGVtZW50KGJ5LmNzcygnaS5mYS10cmFzaCcpKS5jbGljaygpO1xuICB9XG5cbiAgZGVsZXRlTW9kZWxJZk5lZWRlZChtb2RlbE5hbWUsIHBhZ2UpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdFRhYklmTmVlZGVkKCk7XG4gICAgdGhpcy5vcGVuTW9kZWxNZW51KCk7XG4gICAgZWxlbWVudC5hbGwoYnkuY3NzKCcuY2xpY2thYmxlJykpLmdldFRleHQoKS50aGVuKG1vZGVscyA9PiB7XG4gICAgICBpZiAobW9kZWxzLmluY2x1ZGVzKG1vZGVsTmFtZSkpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZk1vZGVsR3JvdXAobW9kZWxOYW1lKTtcbiAgICAgICAgcGFyZW50LmVsZW1lbnQoYnkuY3NzKCdpLmZhLXRyYXNoJykpLmNsaWNrKCk7XG4gICAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5maWxsSW5Pbmx5VGV4dEZpZWxkKG1vZGVsTmFtZSk7XG4gICAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignRGVsZXRlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvQ29ycmVjdFRhYklmTmVlZGVkKCkge1xuICAgIHJldHVybiB0aGlzLmhlYWRlci5hY3RpdmVUYWIudGhlbihhY3RpdmVUYWJUZXh0ID0+IHtcbiAgICAgIGlmIChhY3RpdmVUYWJUZXh0ICE9PSAnTW9kZWwnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYWRlci5nb1RvVGFiKCdNb2RlbCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=