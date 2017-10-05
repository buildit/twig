"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var editModelTab_1 = require("./editModelTab");
var editTwigletTab_1 = require("./editTwigletTab");
var modelTab_1 = require("./modelTab");
var twigletTab_1 = require("./twigletTab");
var Header = (function () {
    function Header() {
        this.modelTab = new modelTab_1.ModelTab(this);
        this.modelEditTab = new editModelTab_1.EditModelTab(this);
        this.twigletTab = new twigletTab_1.TwigletTab(this);
        this.twigletEditTab = new editTwigletTab_1.EditTwigletTab(this);
    }
    Object.defineProperty(Header.prototype, "title", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('app-header-info-bar')).getText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Header.prototype, "activeTab", {
        get: function () {
            return protractor_1.element(protractor_1.by.xpath("//app-header//ul[@class=\"nav ml-auto justify-content-end\"]"
                + "//a[contains(concat(' ', @class, ' '), ' active ')]")).getText();
        },
        enumerable: true,
        configurable: true
    });
    Header.prototype.goToTab = function (text) {
        var elementToClick = protractor_1.element(protractor_1.by.xpath("//app-header//ul[@class=\"nav ml-auto justify-content-end\"]//a[contains(text(), \"" + text + "\")]"));
        elementToClick.click();
    };
    return Header;
}());
exports.Header = Header;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2hlYWRlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFrRDtBQUVsRCwrQ0FBOEM7QUFDOUMsbURBQWtEO0FBQ2xELHVDQUFzQztBQUN0QywyQ0FBMEM7QUFFMUM7SUFNRTtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSwyQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxzQkFBSSx5QkFBSzthQUFUO1lBQ0UsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw2QkFBUzthQUFiO1lBQ0UsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyw4REFBNEQ7a0JBQ2hGLHFEQUFxRCxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RSxDQUFDOzs7T0FBQTtJQUVELHdCQUFPLEdBQVAsVUFBUSxJQUE0QztRQUNsRCxJQUFNLGNBQWMsR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMsd0ZBQW1GLElBQUksU0FBSyxDQUFDLENBQUMsQ0FBQztRQUN2SSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDLEFBMUJELElBMEJDO0FBMUJZLHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgYnksIGVsZW1lbnQgfSBmcm9tICdwcm90cmFjdG9yJztcblxuaW1wb3J0IHsgRWRpdE1vZGVsVGFiIH0gZnJvbSAnLi9lZGl0TW9kZWxUYWInO1xuaW1wb3J0IHsgRWRpdFR3aWdsZXRUYWIgfSBmcm9tICcuL2VkaXRUd2lnbGV0VGFiJztcbmltcG9ydCB7IE1vZGVsVGFiIH0gZnJvbSAnLi9tb2RlbFRhYic7XG5pbXBvcnQgeyBUd2lnbGV0VGFiIH0gZnJvbSAnLi90d2lnbGV0VGFiJztcblxuZXhwb3J0IGNsYXNzIEhlYWRlciB7XG4gIG1vZGVsRWRpdFRhYjogRWRpdE1vZGVsVGFiO1xuICBtb2RlbFRhYjogTW9kZWxUYWI7XG4gIHR3aWdsZXRFZGl0VGFiOiBFZGl0VHdpZ2xldFRhYjtcbiAgdHdpZ2xldFRhYjogVHdpZ2xldFRhYjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1vZGVsVGFiID0gbmV3IE1vZGVsVGFiKHRoaXMpO1xuICAgIHRoaXMubW9kZWxFZGl0VGFiID0gbmV3IEVkaXRNb2RlbFRhYih0aGlzKTtcbiAgICB0aGlzLnR3aWdsZXRUYWIgPSBuZXcgVHdpZ2xldFRhYih0aGlzKTtcbiAgICB0aGlzLnR3aWdsZXRFZGl0VGFiID0gbmV3IEVkaXRUd2lnbGV0VGFiKHRoaXMpO1xuICB9XG5cbiAgZ2V0IHRpdGxlKCkge1xuICAgIHJldHVybiBlbGVtZW50KGJ5LmNzcygnYXBwLWhlYWRlci1pbmZvLWJhcicpKS5nZXRUZXh0KCk7XG4gIH1cblxuICBnZXQgYWN0aXZlVGFiKCkge1xuICAgIHJldHVybiBlbGVtZW50KGJ5LnhwYXRoKGAvL2FwcC1oZWFkZXIvL3VsW0BjbGFzcz1cIm5hdiBtbC1hdXRvIGp1c3RpZnktY29udGVudC1lbmRcIl1gXG4gICAgICArIGAvL2FbY29udGFpbnMoY29uY2F0KCcgJywgQGNsYXNzLCAnICcpLCAnIGFjdGl2ZSAnKV1gKSkuZ2V0VGV4dCgpO1xuICB9XG5cbiAgZ29Ub1RhYih0ZXh0OiAnSG9tZScgfCAnVHdpZ2xldCcgfCAnTW9kZWwnIHwgJ0Fib3V0Jykge1xuICAgIGNvbnN0IGVsZW1lbnRUb0NsaWNrID0gZWxlbWVudChieS54cGF0aChgLy9hcHAtaGVhZGVyLy91bFtAY2xhc3M9XCJuYXYgbWwtYXV0byBqdXN0aWZ5LWNvbnRlbnQtZW5kXCJdLy9hW2NvbnRhaW5zKHRleHQoKSwgXCIke3RleHR9XCIpXWApKTtcbiAgICBlbGVtZW50VG9DbGljay5jbGljaygpO1xuICB9XG59XG4iXX0=