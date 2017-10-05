"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var icons_1 = require("../../../../src/non-angular/utils/icons");
var EditTwigletTab = (function () {
    function EditTwigletTab(header) {
        this.header = header;
        // this.self = element(by.css('app-header-twiglet-edit'));
        this.icons = icons_1.iconsObject();
    }
    Object.defineProperty(EditTwigletTab.prototype, "mode", {
        get: function () {
            var self = protractor_1.element(protractor_1.by.css('app-header-twiglet'));
            return this.header.activeTab.then(function (activeTabText) {
                if (activeTabText !== 'Edit') {
                    return 'viewing';
                }
                return self.isElementPresent(protractor_1.by.cssContainingText('button', "Edit"))
                    .then(function (present) { return present ? 'editing' : 'viewing'; });
            });
        },
        enumerable: true,
        configurable: true
    });
    EditTwigletTab.prototype.startTwigletEditProcess = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet'));
        var button = self.element(protractor_1.by.cssContainingText('button', 'Edit'));
        button.click();
    };
    EditTwigletTab.prototype.startTwigletModelEditProcess = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet'));
        var tab = self.element(protractor_1.by.cssContainingText('span.edit-tab', "Twiglet's Model"));
        tab.click();
    };
    EditTwigletTab.prototype.switchToTwigletEditProcess = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet'));
        var tab = self.element(protractor_1.by.cssContainingText('span.edit-tab', 'Twiglet'));
        tab.click();
    };
    EditTwigletTab.prototype.copyNode = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet-edit'));
        var button = self.element(protractor_1.by.css('.fa.fa-clone'));
        button.click();
    };
    EditTwigletTab.prototype.pasteNode = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet-edit'));
        var button = self.element(protractor_1.by.css('.fa.fa-clipboard'));
        button.click();
    };
    EditTwigletTab.prototype.addNodeByTooltip = function (tooltip, location) {
        var button = protractor_1.element(protractor_1.by.xpath("//app-header-twiglet-edit//button[@type='" + tooltip + "']"));
        if (location) {
            return protractor_1.browser.driver.actions().dragAndDrop(button, location).perform();
        }
        var target = protractor_1.element(protractor_1.by.css('app-twiglet-graph'));
        return protractor_1.browser.driver.actions().dragAndDrop(button, target).perform();
    };
    EditTwigletTab.prototype.saveEdits = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet'));
        var button = self.element(protractor_1.by.cssContainingText('button', 'Save'));
        button.click();
    };
    EditTwigletTab.prototype.cancelEditProcess = function () {
        var self = protractor_1.element(protractor_1.by.css('app-header-twiglet'));
        var button = self.element(protractor_1.by.cssContainingText('button', 'Cancel'));
        button.click();
    };
    return EditTwigletTab;
}());
exports.EditTwigletTab = EditTwigletTab;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci9lZGl0VHdpZ2xldFRhYi9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci9lZGl0VHdpZ2xldFRhYi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFpRTtBQUdqRSxpRUFBc0U7QUFFdEU7SUFLRSx3QkFBb0IsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDaEMsMERBQTBEO1FBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsbUJBQVcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxzQkFBSSxnQ0FBSTthQUFSO1lBQ0UsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsYUFBYTtnQkFDN0MsRUFBRSxDQUFDLENBQUMsYUFBYSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFFLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUNuRSxJQUFJLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLEdBQUcsU0FBUyxHQUFHLFNBQVMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQzs7O09BQUE7SUFFRCxnREFBdUIsR0FBdkI7UUFDRSxJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFB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QUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBeEVELElBd0VDO0FBeEVZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgYnksIGVsZW1lbnQsIEVsZW1lbnRGaW5kZXIgfSBmcm9tICdwcm90cmFjdG9yJztcblxuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSAnLi8uLi8nO1xuaW1wb3J0IHsgaWNvbnNPYmplY3QgfSBmcm9tICcuLi8uLi8uLi8uLi9zcmMvbm9uLWFuZ3VsYXIvdXRpbHMvaWNvbnMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdFR3aWdsZXRUYWIge1xuXG4gIC8vIHNlbGY6IEVsZW1lbnRGaW5kZXI7XG4gIGljb25zOiBPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBoZWFkZXI6IEhlYWRlcikge1xuICAgIC8vIHRoaXMuc2VsZiA9IGVsZW1lbnQoYnkuY3NzKCdhcHAtaGVhZGVyLXR3aWdsZXQtZWRpdCcpKTtcbiAgICB0aGlzLmljb25zID0gaWNvbnNPYmplY3QoKTtcbiAgfVxuXG4gIGdldCBtb2RlKCkge1xuICAgIGNvbnN0IHNlbGYgPSBlbGVtZW50KGJ5LmNzcygnYXBwLWhlYWRlci10d2lnbGV0JykpO1xuICAgIHJldHVybiB0aGlzLmhlYWRlci5hY3RpdmVUYWIudGhlbihhY3RpdmVUYWJUZXh0ID0+IHtcbiAgICAgIGlmIChhY3RpdmVUYWJUZXh0ICE9PSAnRWRpdCcpIHtcbiAgICAgICAgcmV0dXJuICd2aWV3aW5nJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmlzRWxlbWVudFByZXNlbnQoYnkuY3NzQ29udGFpbmluZ1RleHQoJ2J1dHRvbicsIGBFZGl0YCkpXG4gICAgICAudGhlbihwcmVzZW50ID0+IHByZXNlbnQgPyAnZWRpdGluZycgOiAndmlld2luZycpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhcnRUd2lnbGV0RWRpdFByb2Nlc3MoKSB7XG4gICAgY29uc3Qgc2VsZiA9IGVsZW1lbnQoYnkuY3NzKCdhcHAtaGVhZGVyLXR3aWdsZXQnKSk7XG4gICAgY29uc3QgYnV0dG9uID0gc2VsZi5lbGVtZW50KGJ5LmNzc0NvbnRhaW5pbmdUZXh0KCdidXR0b24nLCAnRWRpdCcpKTtcbiAgICBidXR0b24uY2xpY2soKTtcbiAgfVxuXG4gIHN0YXJ0VHdpZ2xldE1vZGVsRWRpdFByb2Nlc3MoKSB7XG4gICAgY29uc3Qgc2VsZiA9IGVsZW1lbnQoYnkuY3NzKCdhcHAtaGVhZGVyLXR3aWdsZXQnKSk7XG4gICAgY29uc3QgdGFiID0gc2VsZi5lbGVtZW50KGJ5LmNzc0NvbnRhaW5pbmdUZXh0KCdzcGFuLmVkaXQtdGFiJywgYFR3aWdsZXQncyBNb2RlbGApKTtcbiAgICB0YWIuY2xpY2soKTtcbiAgfVxuXG4gIHN3aXRjaFRvVHdpZ2xldEVkaXRQcm9jZXNzKCkge1xuICAgIGNvbnN0IHNlbGYgPSBlbGVtZW50KGJ5LmNzcygnYXBwLWhlYWRlci10d2lnbGV0JykpO1xuICAgIGNvbnN0IHRhYiA9IHNlbGYuZWxlbWVudChieS5jc3NDb250YWluaW5nVGV4dCgnc3Bhbi5lZGl0LXRhYicsICdUd2lnbGV0JykpO1xuICAgIHRhYi5jbGljaygpO1xuICB9XG5cbiAgY29weU5vZGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IGVsZW1lbnQoYnkuY3NzKCdhcHAtaGVhZGVyLXR3aWdsZXQtZWRpdCcpKTtcbiAgICBjb25zdCBidXR0b24gPSBzZWxmLmVsZW1lbnQoYnkuY3NzKCcuZmEuZmEtY2xvbmUnKSk7XG4gICAgYnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICBwYXN0ZU5vZGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IGVsZW1lbnQoYnkuY3NzKCdhcHAtaGVhZGVyLXR3aWdsZXQtZWRpdCcpKTtcbiAgICBjb25zdCBidXR0b24gPSBzZWxmLmVsZW1lbnQoYnkuY3NzKCcuZmEuZmEtY2xpcGJvYXJkJykpO1xuICAgIGJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgYWRkTm9kZUJ5VG9vbHRpcCh0b29sdGlwLCBsb2NhdGlvbj86IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGVsZW1lbnQoYnkueHBhdGgoYC8vYXBwLWhlYWRlci10d2lnbGV0LWVkaXQvL2J1dHRvbltAdHlwZT0nJHt0b29sdGlwfSddYCkpO1xuICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgcmV0dXJuIGJyb3dzZXIuZHJpdmVyLmFjdGlvbnMoKS5kcmFnQW5kRHJvcChidXR0b24sIGxvY2F0aW9uKS5wZXJmb3JtKCk7XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldCA9IGVsZW1lbnQoYnkuY3NzKCdhcHAtdHdpZ2xldC1ncmFwaCcpKTtcbiAgICByZXR1cm4gYnJvd3Nlci5kcml2ZXIuYWN0aW9ucygpLmRyYWdBbmREcm9wKGJ1dHRvbiwgdGFyZ2V0KS5wZXJmb3JtKCk7XG4gIH1cblxuXG4gIHNhdmVFZGl0cygpIHtcbiAgICBjb25zdCBzZWxmID0gZWxlbWVudChieS5jc3MoJ2FwcC1oZWFkZXItdHdpZ2xldCcpKTtcbiAgICBjb25zdCBidXR0b24gPSBzZWxmLmVsZW1lbnQoYnkuY3NzQ29udGFpbmluZ1RleHQoJ2J1dHRvbicsICdTYXZlJykpO1xuICAgIGJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgY2FuY2VsRWRpdFByb2Nlc3MoKSB7XG4gICAgY29uc3Qgc2VsZiA9IGVsZW1lbnQoYnkuY3NzKCdhcHAtaGVhZGVyLXR3aWdsZXQnKSk7XG4gICAgY29uc3QgYnV0dG9uID0gc2VsZi5lbGVtZW50KGJ5LmNzc0NvbnRhaW5pbmdUZXh0KCdidXR0b24nLCAnQ2FuY2VsJykpO1xuICAgIGJ1dHRvbi5jbGljaygpO1xuICB9XG59XG4iXX0=