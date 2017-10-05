"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var tabPath = '//app-twiglet-gravity';
var GravityMenu = (function () {
    function GravityMenu(accordion) {
        this.accordion = accordion;
    }
    GravityMenu.prototype.switchToCorrectMenuIfNeeded = function () {
        var _this = this;
        return this.accordion.activeMenu.then(function (activeTabText) {
            if (activeTabText !== 'Gravity') {
                return _this.accordion.goToMenu('Gravity');
            }
        });
    };
    GravityMenu.prototype.toggleGravityEditProcess = function () {
        var parent = protractor_1.element(protractor_1.by.xpath(tabPath + "//label[text()=\"Gravity Edit Mode\"]/parent::*"));
        var toggle = parent.element(protractor_1.by.css('.slider.round'));
        return toggle.click();
    };
    return GravityMenu;
}());
exports.GravityMenu = GravityMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9ncmF2aXR5TWVudS9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9ncmF2aXR5TWVudS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFpRTtBQUlqRSxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QztJQUVFLHFCQUFZLFNBQVM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVPLGlEQUEyQixHQUFuQztRQUFBLGlCQU1DO1FBTEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFBLGFBQWE7WUFDakQsRUFBRSxDQUFDLENBQUMsYUFBYSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsOENBQXdCLEdBQXhCO1FBQ0UsSUFBTSxNQUFNLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFJLE9BQU8sb0RBQStDLENBQUMsQ0FBQyxDQUFDO1FBQzVGLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQztBQW5CWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIsIGJ5LCBlbGVtZW50LCBFbGVtZW50RmluZGVyIH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vLi4vJztcblxuY29uc3QgdGFiUGF0aCA9ICcvL2FwcC10d2lnbGV0LWdyYXZpdHknO1xuZXhwb3J0IGNsYXNzIEdyYXZpdHlNZW51IHtcbiAgcHJpdmF0ZSBhY2NvcmRpb246IEFjY29yZGlvbjtcbiAgY29uc3RydWN0b3IoYWNjb3JkaW9uKSB7XG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvQ29ycmVjdE1lbnVJZk5lZWRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvcmRpb24uYWN0aXZlTWVudS50aGVuKGFjdGl2ZVRhYlRleHQgPT4ge1xuICAgICAgaWYgKGFjdGl2ZVRhYlRleHQgIT09ICdHcmF2aXR5Jykge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2NvcmRpb24uZ29Ub01lbnUoJ0dyYXZpdHknKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZUdyYXZpdHlFZGl0UHJvY2VzcygpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50KGJ5LnhwYXRoKGAke3RhYlBhdGh9Ly9sYWJlbFt0ZXh0KCk9XCJHcmF2aXR5IEVkaXQgTW9kZVwiXS9wYXJlbnQ6OipgKSk7XG4gICAgY29uc3QgdG9nZ2xlID0gcGFyZW50LmVsZW1lbnQoYnkuY3NzKCcuc2xpZGVyLnJvdW5kJykpO1xuICAgIHJldHVybiB0b2dnbGUuY2xpY2soKTtcbiAgfVxufVxuIl19