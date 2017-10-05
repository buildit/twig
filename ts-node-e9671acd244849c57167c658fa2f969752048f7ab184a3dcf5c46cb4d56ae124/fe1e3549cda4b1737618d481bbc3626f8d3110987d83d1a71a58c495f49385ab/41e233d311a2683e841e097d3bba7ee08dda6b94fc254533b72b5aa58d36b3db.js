"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var environmentMenu_1 = require("./environmentMenu");
var filtersMenu_1 = require("./filtersMenu");
var eventsMenu_1 = require("./eventsMenu");
var gravityMenu_1 = require("./gravityMenu");
var Accordion = (function () {
    function Accordion() {
        this.environmentMenu = new environmentMenu_1.EnvironmentMenu(this);
        this.filtersMenu = new filtersMenu_1.FiltersMenu(this);
        this.eventsMenu = new eventsMenu_1.EventsMenu(this);
        this.gravityMenu = new gravityMenu_1.GravityMenu(this);
    }
    Object.defineProperty(Accordion.prototype, "activeMenu", {
        get: function () {
            var active = protractor_1.element(protractor_1.by.xpath("//app-twiglet-mode-left-bar//div[@class=\"card-header active\"]//a"));
            return active.isPresent().then(function (present) {
                if (present) {
                    return active.getText();
                }
                return undefined;
            });
        },
        enumerable: true,
        configurable: true
    });
    Accordion.prototype.goToMenu = function (text) {
        var elementToClick = protractor_1.element(protractor_1.by.xpath("//app-twiglet-mode-left-bar//div[contains(@class, \"card-header\")]//a[contains(text(), '" + text + "')]"));
        elementToClick.click();
    };
    return Accordion;
}());
exports.Accordion = Accordion;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9pbmRleC50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFrRDtBQUVsRCxxREFBb0Q7QUFDcEQsNkNBQTRDO0FBQzVDLDJDQUEwQztBQUMxQyw2Q0FBNEM7QUFFNUM7SUFNRTtRQUNFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxzQkFBSSxpQ0FBVTthQUFkO1lBQ0UsSUFBTSxNQUFNLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLG9FQUFrRSxDQUFDLENBQUMsQ0FBQztZQUNyRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1osTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDMUIsQ0FBQztnQkFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQzs7O09BQUE7SUFFRCw0QkFBUSxHQUFSLFVBQVMsSUFBOEQ7UUFDckUsSUFBTSxjQUFjLEdBQ2xCLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyw4RkFBMEYsSUFBSSxRQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pILGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBNUJELElBNEJDO0FBNUJZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgYnksIGVsZW1lbnQgfSBmcm9tICdwcm90cmFjdG9yJztcblxuaW1wb3J0IHsgRW52aXJvbm1lbnRNZW51IH0gZnJvbSAnLi9lbnZpcm9ubWVudE1lbnUnO1xuaW1wb3J0IHsgRmlsdGVyc01lbnUgfSBmcm9tICcuL2ZpbHRlcnNNZW51JztcbmltcG9ydCB7IEV2ZW50c01lbnUgfSBmcm9tICcuL2V2ZW50c01lbnUnO1xuaW1wb3J0IHsgR3Jhdml0eU1lbnUgfSBmcm9tICcuL2dyYXZpdHlNZW51JztcblxuZXhwb3J0IGNsYXNzIEFjY29yZGlvbiB7XG4gIGVudmlyb25tZW50TWVudTogRW52aXJvbm1lbnRNZW51O1xuICBmaWx0ZXJzTWVudTogRmlsdGVyc01lbnU7XG4gIGV2ZW50c01lbnU6IEV2ZW50c01lbnU7XG4gIGdyYXZpdHlNZW51OiBHcmF2aXR5TWVudTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVudmlyb25tZW50TWVudSA9IG5ldyBFbnZpcm9ubWVudE1lbnUodGhpcyk7XG4gICAgdGhpcy5maWx0ZXJzTWVudSA9IG5ldyBGaWx0ZXJzTWVudSh0aGlzKTtcbiAgICB0aGlzLmV2ZW50c01lbnUgPSBuZXcgRXZlbnRzTWVudSh0aGlzKTtcbiAgICB0aGlzLmdyYXZpdHlNZW51ID0gbmV3IEdyYXZpdHlNZW51KHRoaXMpO1xuICB9XG5cbiAgZ2V0IGFjdGl2ZU1lbnUoKSB7XG4gICAgY29uc3QgYWN0aXZlID0gZWxlbWVudChieS54cGF0aChgLy9hcHAtdHdpZ2xldC1tb2RlLWxlZnQtYmFyLy9kaXZbQGNsYXNzPVwiY2FyZC1oZWFkZXIgYWN0aXZlXCJdLy9hYCkpO1xuICAgIHJldHVybiBhY3RpdmUuaXNQcmVzZW50KCkudGhlbihwcmVzZW50ID0+IHtcbiAgICAgIGlmIChwcmVzZW50KSB7XG4gICAgICAgIHJldHVybiBhY3RpdmUuZ2V0VGV4dCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfVxuXG4gIGdvVG9NZW51KHRleHQ6ICdFbnZpcm9ubWVudCcgfCAnRmlsdGVyJyB8ICdWaWV3JyB8ICdFdmVudHMnIHwgJ0dyYXZpdHknKSB7XG4gICAgY29uc3QgZWxlbWVudFRvQ2xpY2sgPVxuICAgICAgZWxlbWVudChieS54cGF0aChgLy9hcHAtdHdpZ2xldC1tb2RlLWxlZnQtYmFyLy9kaXZbY29udGFpbnMoQGNsYXNzLCBcImNhcmQtaGVhZGVyXCIpXS8vYVtjb250YWlucyh0ZXh0KCksICcke3RleHR9JyldYCkpO1xuICAgIGVsZW1lbnRUb0NsaWNrLmNsaWNrKCk7XG4gIH1cbn1cbiJdfQ==