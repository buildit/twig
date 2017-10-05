"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var ownTag = 'app-twiglet-node-list';
var NodeList = (function () {
    function NodeList() {
    }
    Object.defineProperty(NodeList.prototype, "entityCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.xpath("//" + ownTag + "//div[contains(@class, 'entity-header')]")).then(function (elements) {
                return elements.length;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeList.prototype, "entities", {
        get: function () {
            return new Proxy({}, {
                get: function (target, entityName) {
                    return entityHeader("//app-twiglet-node-list//div[contains(@class, 'entity-header')]/span[contains(text(), '" + entityName + "')]/..");
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    return NodeList;
}());
exports.NodeList = NodeList;
function entityHeader(groupString) {
    return {
        get icon() {
            var classesToExclude = ['fa'];
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(groupString + "i[contains(@class, 'fa')]")).getAttribute('class')
                    .then(function (classString) {
                    return classString.split(' ').filter(function (className) { return !classesToExclude.includes[className]; })[0];
                })
                    .then(resolve)
                    .catch(reject);
            });
        },
        get color() {
            var parent = protractor_1.element(protractor_1.by.xpath(groupString));
            return new Promise(function (resolve, reject) {
                parent.getCssValue('color');
            });
        },
        get count() {
            var input = protractor_1.element(protractor_1.by.xpath(groupString + "/span[2]"));
            return new Promise(function (resolve, reject) {
                input.getText().then(function (text) { return +text.replace('(', '').replace(')', ''); })
                    .then(resolve)
                    .catch(reject);
            });
        },
        getNode: function (name) {
            return node(groupString, name);
        }
    };
}
function node(groupString, name) {
    var nodeTitle = "//div[contains(@class, 'card-header')]//span[contains(text(), '" + name + "')]";
    var nodeGroup = groupString + "/../.." + nodeTitle + "/../../../../..";
    return {
        get isOpen() {
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(nodeGroup)).getAttribute('aria-expanded').then(function (attribute) { return attribute === 'true'; })
                    .then(resolve)
                    .catch(reject);
            });
        },
        open: function () {
            protractor_1.element(protractor_1.by.xpath(nodeGroup)).click();
        },
        get color() {
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(nodeGroup + "/div/a/div/span/span[2]")).getCssValue('color')
                    .then(resolve)
                    .catch(reject);
            });
        },
        get type() {
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(nodeGroup + "//span[@class='node-info-type']/span[@class='param']")).getText()
                    .then(resolve)
                    .catch(reject);
            });
        },
        get location() {
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(nodeGroup + "//span[@class='node-info-location']/span[@class='param']")).getText()
                    .then(resolve)
                    .catch(function () { return undefined; });
            });
        },
        get startAt() {
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(nodeGroup + "//span[@class='node-info-start-at']/span[@class='param']")).getText()
                    .then(resolve)
                    .catch(function () { return undefined; });
            });
        },
        get endAt() {
            return new Promise(function (resolve, reject) {
                protractor_1.element(protractor_1.by.xpath(nodeGroup + "//span[@class='node-info-end-at']/span[@class='param']")).getText()
                    .then(resolve)
                    .catch(function () { return undefined; });
            });
        },
        get attributes() {
            return new Proxy({}, {
                get: function (target, key) {
                    try {
                        var keyGroup = "/span/span[contains(@class, \"key\") and contains(text(), " + key + ")]/..";
                        return protractor_1.element(protractor_1.by.xpath(nodeGroup + "//span[@class='node-info-attribute']" + keyGroup + "/span[@class=\"param\"]")).getText();
                    }
                    catch (error) {
                        return undefined;
                    }
                },
            });
        }
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL05vZGVMaXN0L2luZGV4LnRzIiwic291cmNlcyI6WyIvdHdpZy9lMmUvUGFnZU9iamVjdHMvTm9kZUxpc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUU7QUFDakUsSUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQUM7QUFFdkM7SUFBQTtJQWdCQSxDQUFDO0lBZEMsc0JBQUksaUNBQVc7YUFBZjtZQUNFLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLFlBQVksQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLE9BQUssTUFBTSw2Q0FBMEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFDeEcsT0FBQSxRQUFRLENBQUMsTUFBTTtZQUFmLENBQWUsQ0FDaEIsQ0FBQztRQUNKLENBQUM7OztPQUFBO0lBRUQsc0JBQUksOEJBQVE7YUFBWjtZQUNFLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ25CLEdBQUcsWUFBRSxNQUFNLEVBQUUsVUFBVTtvQkFDckIsTUFBTSxDQUFDLFlBQVksQ0FBQyw0RkFBMEYsVUFBVSxXQUFRLENBQUMsQ0FBQztnQkFDcEksQ0FBQzthQUNGLENBQUMsQ0FBQztRQUVMLENBQUM7OztPQUFBO0lBQ0gsZUFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFoQlksNEJBQVE7QUFrQnJCLHNCQUFzQixXQUFXO0lBQy9CLE1BQU0sQ0FBQztRQUNMLElBQUksSUFBSTtZQUNOLElBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsVUFBQyxPQUFPLEVBQUUsTUFBTTtnQkFDekMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFJLFdBQVcsOEJBQTJCLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7cUJBQ2pGLElBQUksQ0FBQyxVQUFBLFdBQVc7b0JBQ2Is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VUFBVTtZQUNaLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ25CLEdBQUcsWUFBRSxNQUFNLEVBQUUsR0FBRztvQkFDZCxJQUFJLENBQUM7d0JBQ0gsSUFBTSxRQUFRLEdBQUcsK0RBQTJELEdBQUcsVUFBTyxDQUFDO3dCQUN2RixNQUFNLENBQUMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFJLFNBQVMsNENBQXVDLFFBQVEsNEJBQXVCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN6SCxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ2YsTUFBTSxDQUFDLFNBQVMsQ0FBQztvQkFDbkIsQ0FBQztnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgZWxlbWVudCwgYnksIEVsZW1lbnRGaW5kZXIgfSBmcm9tICdwcm90cmFjdG9yJztcbmNvbnN0IG93blRhZyA9ICdhcHAtdHdpZ2xldC1ub2RlLWxpc3QnO1xuXG5leHBvcnQgY2xhc3MgTm9kZUxpc3Qge1xuXG4gIGdldCBlbnRpdHlDb3VudCgpIHtcbiAgICByZXR1cm4gYnJvd3Nlci5maW5kRWxlbWVudHMoYnkueHBhdGgoYC8vJHtvd25UYWd9Ly9kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LWhlYWRlcicpXWApKS50aGVuKGVsZW1lbnRzID0+XG4gICAgICBlbGVtZW50cy5sZW5ndGhcbiAgICApO1xuICB9XG5cbiAgZ2V0IGVudGl0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogRW50aXR5SGVhZGVyIH0ge1xuICAgIHJldHVybiBuZXcgUHJveHkoe30sIHtcbiAgICAgIGdldCAodGFyZ2V0LCBlbnRpdHlOYW1lKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlIZWFkZXIoYC8vYXBwLXR3aWdsZXQtbm9kZS1saXN0Ly9kaXZbY29udGFpbnMoQGNsYXNzLCAnZW50aXR5LWhlYWRlcicpXS9zcGFuW2NvbnRhaW5zKHRleHQoKSwgJyR7ZW50aXR5TmFtZX0nKV0vLi5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG59XG5cbmZ1bmN0aW9uIGVudGl0eUhlYWRlcihncm91cFN0cmluZyk6IEVudGl0eUhlYWRlciB7XG4gIHJldHVybiB7XG4gICAgZ2V0IGljb24oKSB7XG4gICAgICBjb25zdCBjbGFzc2VzVG9FeGNsdWRlID0gWydmYSddO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBlbGVtZW50KGJ5LnhwYXRoKGAke2dyb3VwU3RyaW5nfWlbY29udGFpbnMoQGNsYXNzLCAnZmEnKV1gKSkuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgICAgIC50aGVuKGNsYXNzU3RyaW5nID0+XG4gICAgICAgICAgICBjbGFzc1N0cmluZy5zcGxpdCgnICcpLmZpbHRlcihjbGFzc05hbWUgPT4gIWNsYXNzZXNUb0V4Y2x1ZGUuaW5jbHVkZXNbY2xhc3NOYW1lXSlbMF0pXG4gICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXQgY29sb3IoKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50KGJ5LnhwYXRoKGdyb3VwU3RyaW5nKSk7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHBhcmVudC5nZXRDc3NWYWx1ZSgnY29sb3InKVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXQgY291bnQoKSB7XG4gICAgICBjb25zdCBpbnB1dCA9IGVsZW1lbnQoYnkueHBhdGgoYCR7Z3JvdXBTdHJpbmd9L3NwYW5bMl1gKSk7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlucHV0LmdldFRleHQoKS50aGVuKHRleHQgPT4gK3RleHQucmVwbGFjZSgnKCcsICcnKS5yZXBsYWNlKCcpJywgJycpKVxuICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0Tm9kZShuYW1lKTogTm9kZSB7XG4gICAgICByZXR1cm4gbm9kZShncm91cFN0cmluZywgbmFtZSk7XG4gICAgfVxuICB9O1xufVxuXG5cbmZ1bmN0aW9uIG5vZGUoZ3JvdXBTdHJpbmcsIG5hbWUpOiBOb2RlIHtcbiAgY29uc3Qgbm9kZVRpdGxlID0gYC8vZGl2W2NvbnRhaW5zKEBjbGFzcywgJ2NhcmQtaGVhZGVyJyldLy9zcGFuW2NvbnRhaW5zKHRleHQoKSwgJyR7bmFtZX0nKV1gO1xuICBjb25zdCBub2RlR3JvdXAgPSBgJHtncm91cFN0cmluZ30vLi4vLi4ke25vZGVUaXRsZX0vLi4vLi4vLi4vLi4vLi5gO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IGlzT3BlbigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGVsZW1lbnQoYnkueHBhdGgobm9kZUdyb3VwKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykudGhlbihhdHRyaWJ1dGUgPT4gYXR0cmlidXRlID09PSAndHJ1ZScpXG4gICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvcGVuICgpIHtcbiAgICAgIGVsZW1lbnQoYnkueHBhdGgobm9kZUdyb3VwKSkuY2xpY2soKTtcbiAgICB9LFxuICAgIGdldCBjb2xvcigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZWxlbWVudChieS54cGF0aChgJHtub2RlR3JvdXB9L2Rpdi9hL2Rpdi9zcGFuL3NwYW5bMl1gKSkuZ2V0Q3NzVmFsdWUoJ2NvbG9yJylcbiAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldCB0eXBlKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBlbGVtZW50KGJ5LnhwYXRoKGAke25vZGVHcm91cH0vL3NwYW5bQGNsYXNzPSdub2RlLWluZm8tdHlwZSddL3NwYW5bQGNsYXNzPSdwYXJhbSddYCkpLmdldFRleHQoKVxuICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZXQgbG9jYXRpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGVsZW1lbnQoYnkueHBhdGgoYCR7bm9kZUdyb3VwfS8vc3BhbltAY2xhc3M9J25vZGUtaW5mby1sb2NhdGlvbiddL3NwYW5bQGNsYXNzPSdwYXJhbSddYCkpLmdldFRleHQoKVxuICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0IHN0YXJ0QXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGVsZW1lbnQoYnkueHBhdGgoYCR7bm9kZUdyb3VwfS8vc3BhbltAY2xhc3M9J25vZGUtaW5mby1zdGFydC1hdCddL3NwYW5bQGNsYXNzPSdwYXJhbSddYCkpLmdldFRleHQoKVxuICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0IGVuZEF0KCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBlbGVtZW50KGJ5LnhwYXRoKGAke25vZGVHcm91cH0vL3NwYW5bQGNsYXNzPSdub2RlLWluZm8tZW5kLWF0J10vc3BhbltAY2xhc3M9J3BhcmFtJ11gKSkuZ2V0VGV4dCgpXG4gICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgIC5jYXRjaCgoKSA9PiB1bmRlZmluZWQpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXQgYXR0cmlidXRlcygpIHtcbiAgICAgIHJldHVybiBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgZ2V0ICh0YXJnZXQsIGtleSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBrZXlHcm91cCA9IGAvc3Bhbi9zcGFuW2NvbnRhaW5zKEBjbGFzcywgXCJrZXlcIikgYW5kIGNvbnRhaW5zKHRleHQoKSwgJHtrZXl9KV0vLi5gO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQoYnkueHBhdGgoYCR7bm9kZUdyb3VwfS8vc3BhbltAY2xhc3M9J25vZGUtaW5mby1hdHRyaWJ1dGUnXSR7a2V5R3JvdXB9L3NwYW5bQGNsYXNzPVwicGFyYW1cIl1gKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlIZWFkZXIge1xuICBpY29uOiBQcm9taXNlPHN0cmluZz47XG4gIGNvbG9yOiBQcm9taXNlPHN0cmluZz47XG4gIGNvdW50OiBQcm9taXNlPG51bWJlcj47XG4gIGdldE5vZGU6IChuYW1lOiBzdHJpbmcpID0+IE5vZGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZSB7XG4gIGlzT3BlbjogUHJvbWlzZTxib29sZWFuPjtcbiAgb3BlbjogKCkgPT4gdm9pZDtcbiAgY29sb3I6IFByb21pc2U8c3RyaW5nPjtcbiAgdHlwZTogUHJvbWlzZTxzdHJpbmc+O1xuICBsb2NhdGlvbjogUHJvbWlzZTxzdHJpbmc+O1xuICBzdGFydEF0OiBQcm9taXNlPHN0cmluZz47XG4gIGVuZEF0OiBQcm9taXNlPHN0cmluZz47XG4gIGF0dHJpYnV0ZXM6IG9iamVjdDtcbn1cbiJdfQ==