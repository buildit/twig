"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var ownTag = '//app-twiglet-model-view//';
var TwigletModel = (function () {
    function TwigletModel() {
    }
    Object.defineProperty(TwigletModel.prototype, "isOpen", {
        get: function () {
            return protractor_1.browser.isElementPresent(protractor_1.element(protractor_1.by.css('app-twiglet-model-view')));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TwigletModel.prototype, "removeButtonCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.css('.fa-trash')).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TwigletModel.prototype, "entityCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.xpath(ownTag + "div[contains(@class, 'entity-row')]")).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    return TwigletModel;
}());
exports.TwigletModel = TwigletModel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL3R3aWdsZXRNb2RlbC9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL3R3aWdsZXRNb2RlbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFrRDtBQUVsRCxJQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQztBQUU1QztJQUFBO0lBWUEsQ0FBQztJQVhDLHNCQUFJLGdDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwyQ0FBaUI7YUFBckI7WUFDRSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxZQUFZLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxNQUFNLEVBQWYsQ0FBZSxDQUFDLENBQUM7UUFDckYsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxxQ0FBVzthQUFmO1lBQ0UsTUFBTSxDQUFDLG9CQUFPLENBQUMsWUFBWSxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksTUFBTSx3Q0FBcUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLE1BQU0sRUFBZixDQUFlLENBQUMsQ0FBQztRQUMxSCxDQUFDOzs7T0FBQTtJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIsIGJ5LCBlbGVtZW50IH0gZnJvbSAncHJvdHJhY3Rvcic7XG5cbmNvbnN0IG93blRhZyA9ICcvL2FwcC10d2lnbGV0LW1vZGVsLXZpZXcvLyc7XG5cbmV4cG9ydCBjbGFzcyBUd2lnbGV0TW9kZWwge1xuICBnZXQgaXNPcGVuKCkge1xuICAgIHJldHVybiBicm93c2VyLmlzRWxlbWVudFByZXNlbnQoZWxlbWVudChieS5jc3MoJ2FwcC10d2lnbGV0LW1vZGVsLXZpZXcnKSkpO1xuICB9XG5cbiAgZ2V0IHJlbW92ZUJ1dHRvbkNvdW50KCkge1xuICAgIHJldHVybiBicm93c2VyLmZpbmRFbGVtZW50cyhieS5jc3MoJy5mYS10cmFzaCcpKS50aGVuKGVsZW1lbnRzID0+IGVsZW1lbnRzLmxlbmd0aCk7XG4gIH1cblxuICBnZXQgZW50aXR5Q291bnQoKSB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZmluZEVsZW1lbnRzKGJ5LnhwYXRoKGAke293blRhZ31kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LXJvdycpXWApKS50aGVuKGVsZW1lbnRzID0+IGVsZW1lbnRzLmxlbmd0aCk7XG4gIH1cbn1cbiJdfQ==