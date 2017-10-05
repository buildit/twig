"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var ownTag = 'app-model-view';
var ModelInfo = (function () {
    function ModelInfo() {
    }
    Object.defineProperty(ModelInfo.prototype, "entityCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.xpath("//" + ownTag + "//div[contains(@class, 'entity-row')]")).then(function (elements) {
                return elements.length;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelInfo.prototype, "row", {
        get: function () {
            return new Proxy([], {
                get: function (target, propKey, receiver) {
                    return entity("//div[contains(@class, 'entity-row')][" + (propKey + 1) + "]");
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    return ModelInfo;
}());
exports.ModelInfo = ModelInfo;
function entity(rowString) {
    return {
        get type() {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='type']"));
            return input.getAttribute('value');
        },
        get color() {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='color']"));
            return input.getAttribute('value');
        },
        get size() {
            var input = protractor_1.element(protractor_1.by.xpath(rowString + "input[@formcontrolname='size']"));
            return input.getAttribute('value');
        },
        get icon() {
            var classesToExclude = ['fa', 'fa-2x'];
            return protractor_1.element(protractor_1.by.xpath(rowString + "i[contains(@class, 'fa-2x')]"))
                .getAttribute('class').then(function (classString) {
                return classString.split(' ').filter(function (className) { return !classesToExclude.includes[className]; })[0];
            });
        },
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL01vZGVsSW5mby9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL01vZGVsSW5mby9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFpRTtBQUNqRSxJQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztBQUdoQztJQUFBO0lBZUEsQ0FBQztJQWJDLHNCQUFJLGtDQUFXO2FBQWY7WUFDRSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxZQUFZLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFLLE1BQU0sMENBQXVDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ3JHLE9BQUEsUUFBUSxDQUFDLE1BQU07WUFBZixDQUFlLENBQ2hCLENBQUM7UUFDSixDQUFDOzs7T0FBQTtJQUVBLHNCQUFJLDBCQUFHO2FBQVA7WUFDQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUNuQixHQUFHLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRO29CQUMzQixNQUFNLENBQUMsTUFBTSxDQUFDLDRDQUF5QyxPQUFpQixHQUFHLENBQUMsT0FBRyxDQUFDLENBQUM7Z0JBQ25GLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDOzs7T0FBQTtJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWZELElBZUM7QUFmWSw4QkFBUztBQWlCdEIsZ0JBQWdCLFNBQVM7SUFDdkIsTUFBTSxDQUFDO1FBQ0wsSUFBSSxJQUFJO1lBQ04sSUFBTSxLQUFLLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFJLFNBQVMsbUNBQWdDLENBQUMsQ0FBQyxDQUFDO1lBQzlFLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxJQUFJLEtBQUs7WUFDUCxJQUFNLEtBQUssR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUksU0FBUyxvQ0FBaUMsQ0FBQyxDQUFDLENBQUM7WUFDL0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNELElBQUksSUFBSTtZQUNOLElBQU0sS0FBSyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBSSxTQUFTLG1DQUFnQyxDQUFDLENBQUMsQ0FBQztZQUM5RSxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQ0QsSUFBSSxJQUFJO1lBQ04sSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFJLFNBQVMsaUNBQThCLENBQUMsQ0FBQztpQkFDakUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFdBQVc7Z0JBQ3JDLE9BQUEsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFwRixDQUFvRixDQUFDLENBQUM7UUFDNUYsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgZWxlbWVudCwgYnksIEVsZW1lbnRGaW5kZXIgfSBmcm9tICdwcm90cmFjdG9yJztcbmNvbnN0IG93blRhZyA9ICdhcHAtbW9kZWwtdmlldyc7XG5cblxuZXhwb3J0IGNsYXNzIE1vZGVsSW5mbyB7XG5cbiAgZ2V0IGVudGl0eUNvdW50KCkge1xuICAgIHJldHVybiBicm93c2VyLmZpbmRFbGVtZW50cyhieS54cGF0aChgLy8ke293blRhZ30vL2Rpdltjb250YWlucyhAY2xhc3MsICdlbnRpdHktcm93JyldYCkpLnRoZW4oZWxlbWVudHMgPT5cbiAgICAgIGVsZW1lbnRzLmxlbmd0aFxuICAgICk7XG4gIH1cblxuICAgZ2V0IHJvdygpOiBFbnRpdHlbXSB7XG4gICAgcmV0dXJuIG5ldyBQcm94eShbXSwge1xuICAgICAgZ2V0KHRhcmdldCwgcHJvcEtleSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eShgLy9kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LXJvdycpXVske3Byb3BLZXkgYXMgbnVtYmVyICsgMX1dYCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW50aXR5KHJvd1N0cmluZykge1xuICByZXR1cm4ge1xuICAgIGdldCB0eXBlKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBlbGVtZW50KGJ5LnhwYXRoKGAke3Jvd1N0cmluZ31pbnB1dFtAZm9ybWNvbnRyb2xuYW1lPSd0eXBlJ11gKSk7XG4gICAgICByZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgIH0sXG4gICAgZ2V0IGNvbG9yKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBlbGVtZW50KGJ5LnhwYXRoKGAke3Jvd1N0cmluZ31pbnB1dFtAZm9ybWNvbnRyb2xuYW1lPSdjb2xvciddYCkpO1xuICAgICAgcmV0dXJuIGlucHV0LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBlbGVtZW50KGJ5LnhwYXRoKGAke3Jvd1N0cmluZ31pbnB1dFtAZm9ybWNvbnRyb2xuYW1lPSdzaXplJ11gKSk7XG4gICAgICByZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgIH0sXG4gICAgZ2V0IGljb24oKSB7XG4gICAgICBjb25zdCBjbGFzc2VzVG9FeGNsdWRlID0gWydmYScsICdmYS0yeCddO1xuICAgICAgcmV0dXJuIGVsZW1lbnQoYnkueHBhdGgoYCR7cm93U3RyaW5nfWlbY29udGFpbnMoQGNsYXNzLCAnZmEtMngnKV1gKSlcbiAgICAgICAgLmdldEF0dHJpYnV0ZSgnY2xhc3MnKS50aGVuKGNsYXNzU3RyaW5nID0+XG4gICAgICAgICAgY2xhc3NTdHJpbmcuc3BsaXQoJyAnKS5maWx0ZXIoY2xhc3NOYW1lID0+ICFjbGFzc2VzVG9FeGNsdWRlLmluY2x1ZGVzW2NsYXNzTmFtZV0pWzBdKTtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eSB7XG4gIHR5cGU6IHN0cmluZztcbiAgY29sb3I6IHN0cmluZztcbiAgc2l6ZTogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG59XG4iXX0=