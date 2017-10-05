"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var accordion_1 = require("./accordion");
var FormsForModals_1 = require("./FormsForModals");
var header_1 = require("./header");
var ModelEditForm_1 = require("./ModelEditForm");
var ModelInfo_1 = require("./ModelInfo");
var NodeList_1 = require("./NodeList");
var twigletGraph_1 = require("./twigletGraph");
var twigletModel_1 = require("./twigletModel");
var user_1 = require("./user");
var TwigPage = (function () {
    function TwigPage() {
        this.header = new header_1.Header();
        this.accordion = new accordion_1.Accordion();
        this.formForModals = new FormsForModals_1.FormsForModals();
        this.modelInfo = new ModelInfo_1.ModelInfo();
        this.modelEditForm = new ModelEditForm_1.ModelEditForm();
        this.nodeList = new NodeList_1.NodeList();
        this.user = new user_1.User();
        this.twigletGraph = new twigletGraph_1.TwigletGraph();
        this.twigletModel = new twigletModel_1.TwigletModel();
    }
    TwigPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    TwigPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return TwigPage;
}());
exports.TwigPage = TwigPage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FwcC5wby50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FwcC5wby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFrRDtBQUVsRCx5Q0FBd0M7QUFDeEMsbURBQWtEO0FBQ2xELG1DQUFrQztBQUNsQyxpREFBZ0Q7QUFDaEQseUNBQXdDO0FBQ3hDLHVDQUFzQztBQUN0QywrQ0FBOEM7QUFDOUMsK0NBQThDO0FBQzlDLCtCQUE4QjtBQUU5QjtJQUFBO1FBQ0UsV0FBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7UUFDdEIsY0FBUyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFBO1FBQzNCLGtCQUFhLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDckMsY0FBUyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBQzVCLGtCQUFhLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7UUFDcEMsYUFBUSxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1FBQzFCLFNBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1FBQ2xCLGlCQUFZLEdBQUcsSUFBSSwyQkFBWSxFQUFFLENBQUM7UUFDbEMsaUJBQVksR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztJQVNwQyxDQUFDO0lBUEMsNkJBQVUsR0FBVjtRQUNFLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsbUNBQWdCLEdBQWhCO1FBQ0UsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQWxCRCxJQWtCQztBQWxCWSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIsIGJ5LCBlbGVtZW50IH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vYWNjb3JkaW9uJztcbmltcG9ydCB7IEZvcm1zRm9yTW9kYWxzIH0gZnJvbSAnLi9Gb3Jtc0Zvck1vZGFscyc7XG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuL2hlYWRlcic7XG5pbXBvcnQgeyBNb2RlbEVkaXRGb3JtIH0gZnJvbSAnLi9Nb2RlbEVkaXRGb3JtJztcbmltcG9ydCB7IE1vZGVsSW5mbyB9IGZyb20gJy4vTW9kZWxJbmZvJztcbmltcG9ydCB7IE5vZGVMaXN0IH0gZnJvbSAnLi9Ob2RlTGlzdCc7XG5pbXBvcnQgeyBUd2lnbGV0R3JhcGggfSBmcm9tICcuL3R3aWdsZXRHcmFwaCc7XG5pbXBvcnQgeyBUd2lnbGV0TW9kZWwgfSBmcm9tICcuL3R3aWdsZXRNb2RlbCc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyJztcblxuZXhwb3J0IGNsYXNzIFR3aWdQYWdlIHtcbiAgaGVhZGVyID0gbmV3IEhlYWRlcigpO1xuICBhY2NvcmRpb24gPSBuZXcgQWNjb3JkaW9uKClcbiAgZm9ybUZvck1vZGFscyA9IG5ldyBGb3Jtc0Zvck1vZGFscygpO1xuICBtb2RlbEluZm8gPSBuZXcgTW9kZWxJbmZvKCk7XG4gIG1vZGVsRWRpdEZvcm0gPSBuZXcgTW9kZWxFZGl0Rm9ybSgpO1xuICBub2RlTGlzdCA9IG5ldyBOb2RlTGlzdCgpO1xuICB1c2VyID0gbmV3IFVzZXIoKTtcbiAgdHdpZ2xldEdyYXBoID0gbmV3IFR3aWdsZXRHcmFwaCgpO1xuICB0d2lnbGV0TW9kZWwgPSBuZXcgVHdpZ2xldE1vZGVsKCk7XG5cbiAgbmF2aWdhdGVUbygpIHtcbiAgICByZXR1cm4gYnJvd3Nlci5nZXQoJy8nKTtcbiAgfVxuXG4gIGdldFBhcmFncmFwaFRleHQoKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQoYnkuY3NzKCdhcHAtcm9vdCBoMScpKS5nZXRUZXh0KCk7XG4gIH1cbn1cbiJdfQ==