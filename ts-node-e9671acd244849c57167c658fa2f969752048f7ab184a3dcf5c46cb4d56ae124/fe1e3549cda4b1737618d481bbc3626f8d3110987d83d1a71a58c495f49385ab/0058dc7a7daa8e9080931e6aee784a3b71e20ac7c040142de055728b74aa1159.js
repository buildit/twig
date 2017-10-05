"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var TwigletGraph = (function () {
    function TwigletGraph() {
    }
    Object.defineProperty(TwigletGraph.prototype, "nodeCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.css('g.node-group')).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TwigletGraph.prototype, "linkCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.css('g.link-group')).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TwigletGraph.prototype, "gravityPointCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.css('g.gravity-point-group')).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TwigletGraph.prototype, "gravityPointName", {
        get: function () {
            return protractor_1.element(protractor_1.by.css('text')).getText();
        },
        enumerable: true,
        configurable: true
    });
    TwigletGraph.prototype.startEditing = function (nodeName) {
        var node = this.getNodeGroup(nodeName);
        protractor_1.browser.actions().doubleClick(node).perform();
    };
    TwigletGraph.prototype.getNodeType = function (nodeName) {
        var node = this.getNodeGroup(nodeName);
        var image = node.element(protractor_1.by.className('node-image'));
        return image.getText();
    };
    TwigletGraph.prototype.createLink = function (node1Name, node2Name) {
        var node1 = this.getNodeGroup(node1Name);
        var node2 = this.getNodeGroup(node2Name);
        protractor_1.browser.driver.actions().mouseDown(node1).mouseMove(node2).mouseUp(node2).perform();
    };
    TwigletGraph.prototype.checkNodeLabels = function (nodeName, cls) {
        var nodeElement = this.getNodeLabel(nodeName);
        return nodeElement.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };
    TwigletGraph.prototype.addGravityPoint = function () {
        protractor_1.element(protractor_1.by.xpath("//app-gravity-list/button/i[contains(@class, 'fa-plus')]/parent::*")).click();
    };
    TwigletGraph.prototype.openEditGravityModal = function () {
        protractor_1.element(protractor_1.by.css('g.gravity-point-group')).click();
    };
    TwigletGraph.prototype.getNodeGroup = function (name) {
        return protractor_1.element(protractor_1.by.xpath("//app-twiglet-graph/*[name()='svg']//*[name()=\"text\" and contains(@class, \"node-name\") and text()=\"" + name + "\"]/.."));
    };
    TwigletGraph.prototype.getNodeLabel = function (name) {
        return protractor_1.element(protractor_1.by.xpath("//app-twiglet-graph/*[name()='svg']//*[name()=\"text\" and contains(@class, \"node-name\") and text()=\"" + name + "\"]"));
    };
    return TwigletGraph;
}());
exports.TwigletGraph = TwigletGraph;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL3R3aWdsZXRHcmFwaC9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL3R3aWdsZXRHcmFwaC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFrRDtBQUVsRDtJQUFBO0lBMkRBLENBQUM7SUF6REMsc0JBQUksbUNBQVM7YUFBYjtZQUNFLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLFlBQVksQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLE1BQU0sRUFBZixDQUFlLENBQUMsQ0FBQztRQUN4RixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLG1DQUFTO2FBQWI7WUFDRSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxZQUFZLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxNQUFNLEVBQWYsQ0FBZSxDQUFDLENBQUM7UUFDeEYsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwyQ0FBaUI7YUFBckI7WUFDRSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxZQUFZLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLE1BQU0sRUFBZixDQUFlLENBQUMsQ0FBQztRQUNqRyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDBDQUFnQjthQUFwQjtZQUNFLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMzQyxDQUFDOzs7T0FBQTtJQUVELG1DQUFZLEdBQVosVUFBYSxRQUFnQjtRQUMzQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLG9CQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFFRCxrQ0FBVyxHQUFYLFVBQVksUUFBZ0I7UUFDMUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxpQ0FBVSxHQUFWLFVBQVcsU0FBUyxFQUFFLFNBQVM7UUFDN0IsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLG9CQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RGLENBQUM7SUFFRCxzQ0FBZSxHQUFmLFVBQWdCLFFBQVEsRUFBRSxHQUFHO1FBQzNCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTztZQUNuRCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsc0NBQWUsR0FBZjtRQUNFLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEcsQ0FBQztJQUVELDJDQUFvQixHQUFwQjtRQUNFLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVPLG1DQUFZLEdBQXBCLFVBQXFCLElBQUk7UUFDdkIsTUFBTSxDQUFDLG9CQUFPLENBQ1osZUFBRSxDQUFDLEtBQUssQ0FBQyw2R0FBc0csSUFBSSxXQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2pJLENBQUM7SUFFTyxtQ0FBWSxHQUFwQixVQUFxQixJQUFJO1FBQ3ZCLE1BQU0sQ0FBQyxvQkFBTyxDQUNaLGVBQUUsQ0FBQyxLQUFLLENBQUMsNkdBQXNHLElBQUksUUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5SCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBM0RELElBMkRDO0FBM0RZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgYnksIGVsZW1lbnQgfSBmcm9tICdwcm90cmFjdG9yJztcblxuZXhwb3J0IGNsYXNzIFR3aWdsZXRHcmFwaCB7XG5cbiAgZ2V0IG5vZGVDb3VudCgpIHtcbiAgICByZXR1cm4gYnJvd3Nlci5maW5kRWxlbWVudHMoYnkuY3NzKCdnLm5vZGUtZ3JvdXAnKSkudGhlbihlbGVtZW50cyA9PiBlbGVtZW50cy5sZW5ndGgpO1xuICB9XG5cbiAgZ2V0IGxpbmtDb3VudCgpIHtcbiAgICByZXR1cm4gYnJvd3Nlci5maW5kRWxlbWVudHMoYnkuY3NzKCdnLmxpbmstZ3JvdXAnKSkudGhlbihlbGVtZW50cyA9PiBlbGVtZW50cy5sZW5ndGgpO1xuICB9XG5cbiAgZ2V0IGdyYXZpdHlQb2ludENvdW50KCkge1xuICAgIHJldHVybiBicm93c2VyLmZpbmRFbGVtZW50cyhieS5jc3MoJ2cuZ3Jhdml0eS1wb2ludC1ncm91cCcpKS50aGVuKGVsZW1lbnRzID0+IGVsZW1lbnRzLmxlbmd0aCk7XG4gIH1cblxuICBnZXQgZ3Jhdml0eVBvaW50TmFtZSgpIHtcbiAgICByZXR1cm4gZWxlbWVudChieS5jc3MoJ3RleHQnKSkuZ2V0VGV4dCgpO1xuICB9XG5cbiAgc3RhcnRFZGl0aW5nKG5vZGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5nZXROb2RlR3JvdXAobm9kZU5hbWUpO1xuICAgIGJyb3dzZXIuYWN0aW9ucygpLmRvdWJsZUNsaWNrKG5vZGUpLnBlcmZvcm0oKTtcbiAgfVxuXG4gIGdldE5vZGVUeXBlKG5vZGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5nZXROb2RlR3JvdXAobm9kZU5hbWUpO1xuICAgIGNvbnN0IGltYWdlID0gbm9kZS5lbGVtZW50KGJ5LmNsYXNzTmFtZSgnbm9kZS1pbWFnZScpKTtcbiAgICByZXR1cm4gaW1hZ2UuZ2V0VGV4dCgpO1xuICB9XG5cbiAgY3JlYXRlTGluayhub2RlMU5hbWUsIG5vZGUyTmFtZSkge1xuICAgIGNvbnN0IG5vZGUxID0gdGhpcy5nZXROb2RlR3JvdXAobm9kZTFOYW1lKTtcbiAgICBjb25zdCBub2RlMiA9IHRoaXMuZ2V0Tm9kZUdyb3VwKG5vZGUyTmFtZSk7XG4gICAgYnJvd3Nlci5kcml2ZXIuYWN0aW9ucygpLm1vdXNlRG93bihub2RlMSkubW91c2VNb3ZlKG5vZGUyKS5tb3VzZVVwKG5vZGUyKS5wZXJmb3JtKCk7XG4gIH1cblxuICBjaGVja05vZGVMYWJlbHMobm9kZU5hbWUsIGNscykge1xuICAgIGNvbnN0IG5vZGVFbGVtZW50ID0gdGhpcy5nZXROb2RlTGFiZWwobm9kZU5hbWUpO1xuICAgIHJldHVybiBub2RlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykudGhlbihjbGFzc2VzID0+IHtcbiAgICAgIHJldHVybiBjbGFzc2VzLnNwbGl0KCcgJykuaW5kZXhPZihjbHMpICE9PSAtMTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZEdyYXZpdHlQb2ludCgpIHtcbiAgICBlbGVtZW50KGJ5LnhwYXRoKGAvL2FwcC1ncmF2aXR5LWxpc3QvYnV0dG9uL2lbY29udGFpbnMoQGNsYXNzLCAnZmEtcGx1cycpXS9wYXJlbnQ6OipgKSkuY2xpY2soKTtcbiAgfVxuXG4gIG9wZW5FZGl0R3Jhdml0eU1vZGFsKCkge1xuICAgIGVsZW1lbnQoYnkuY3NzKCdnLmdyYXZpdHktcG9pbnQtZ3JvdXAnKSkuY2xpY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Tm9kZUdyb3VwKG5hbWUpIHtcbiAgICByZXR1cm4gZWxlbWVudChcbiAgICAgIGJ5LnhwYXRoKGAvL2FwcC10d2lnbGV0LWdyYXBoLypbbmFtZSgpPSdzdmcnXS8vKltuYW1lKCk9XCJ0ZXh0XCIgYW5kIGNvbnRhaW5zKEBjbGFzcywgXCJub2RlLW5hbWVcIikgYW5kIHRleHQoKT1cIiR7bmFtZX1cIl0vLi5gKSk7XG4gIH1cblxuICBwcml2YXRlIGdldE5vZGVMYWJlbChuYW1lKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQoXG4gICAgICBieS54cGF0aChgLy9hcHAtdHdpZ2xldC1ncmFwaC8qW25hbWUoKT0nc3ZnJ10vLypbbmFtZSgpPVwidGV4dFwiIGFuZCBjb250YWlucyhAY2xhc3MsIFwibm9kZS1uYW1lXCIpIGFuZCB0ZXh0KCk9XCIke25hbWV9XCJdYCkpO1xuICB9XG59XG4iXX0=