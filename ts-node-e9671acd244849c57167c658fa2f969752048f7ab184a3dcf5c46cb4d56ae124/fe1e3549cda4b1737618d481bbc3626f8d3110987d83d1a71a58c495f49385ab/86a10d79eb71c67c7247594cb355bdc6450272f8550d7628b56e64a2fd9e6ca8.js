"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var app_po_1 = require("../PageObjects/app.po");
var utils_1 = require("../utils");
describe('Gravity Points', function () {
    var page;
    beforeAll(function () {
        page = new app_po_1.TwigPage();
        page.navigateTo();
        page.header.twigletTab.deleteTwigletIfNeeded(utils_1.twigletName, page);
        protractor_1.browser.waitForAngular();
        utils_1.createDefaultJsonImportedTwiglet(page);
        protractor_1.browser.waitForAngular();
    });
    afterAll(function () {
        // browser.manage().logs().get('browser').then(function(browserLog) {
        //   console.log('log: ' + require('util').inspect(browserLog));
        // });
        utils_1.deleteDefaultJsonImportedTwiglet(page);
    });
    describe('adding a gravity point', function () {
        beforeAll(function () {
            page.accordion.goToMenu('Gravity');
            page.accordion.gravityMenu.toggleGravityEditProcess();
        });
        it('pops up the edit gravity point modal', function () {
            page.twigletGraph.addGravityPoint();
            page.formForModals.fillInOnlyTextField('new name');
            page.formForModals.clickButton('Save Changes');
            page.formForModals.waitForModalToClose();
        });
        it('adds the gravity point', function () {
            expect(page.twigletGraph.gravityPointCount).toEqual(1);
        });
    });
    describe('editing a gravity point', function () {
        it('pops up the edit gravity modal', function () {
            page.twigletGraph.openEditGravityModal();
            expect(page.formForModals.modalTitle).toEqual('Gravity Point Editor');
        });
        it('can rename the gravity point', function () {
            page.formForModals.fillInOnlyTextField('new name');
            page.formForModals.clickButton('Save Changes');
            page.formForModals.waitForModalToClose();
            expect(page.twigletGraph.gravityPointName).toEqual('new name');
        });
    });
    describe('removing a gravity point', function () {
        it('can remove the gravity point', function () {
            page.twigletGraph.openEditGravityModal();
            page.formForModals.clickButton('Delete');
            expect(page.twigletGraph.gravityPointCount).toEqual(0);
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL2pvdXJuZXlzL3R3aWdsZXQtZ3Jhdml0eS5lMmUtc3BlYy50cyIsInNvdXJjZXMiOlsiL3R3aWcvZTJlL2pvdXJuZXlzL3R3aWdsZXQtZ3Jhdml0eS5lMmUtc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFxQztBQUVyQyxnREFBaUQ7QUFDakQsa0NBSWtCO0FBRWxCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixJQUFJLElBQWMsQ0FBQztJQUVuQixTQUFTLENBQUM7UUFDUixJQUFJLEdBQUcsSUFBSSxpQkFBUSxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLG1CQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEUsb0JBQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6Qix3Q0FBZ0MsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxvQkFBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDO1FBQ1AscUVBQXFFO1FBQ3JFLGdFQUFnRTtRQUNoRSxNQUFNO1FBQ04sd0NBQWdDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDakMsU0FBUyxDQUFDO1lBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1FBQ25DLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3Byb3RyYWN0b3InO1xuXG5pbXBvcnQgeyBUd2lnUGFnZSB9IGZyb20gJy4uL1BhZ2VPYmplY3RzL2FwcC5wbyc7XG5pbXBvcnQge1xuICBjcmVhdGVEZWZhdWx0SnNvbkltcG9ydGVkVHdpZ2xldCxcbiAgZGVsZXRlRGVmYXVsdEpzb25JbXBvcnRlZFR3aWdsZXQsXG4gIHR3aWdsZXROYW1lXG59IGZyb20gJy4uL3V0aWxzJztcblxuZGVzY3JpYmUoJ0dyYXZpdHkgUG9pbnRzJywgKCkgPT4ge1xuICBsZXQgcGFnZTogVHdpZ1BhZ2U7XG5cbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBwYWdlID0gbmV3IFR3aWdQYWdlKCk7XG4gICAgcGFnZS5uYXZpZ2F0ZVRvKCk7XG4gICAgcGFnZS5oZWFkZXIudHdpZ2xldFRhYi5kZWxldGVUd2lnbGV0SWZOZWVkZWQodHdpZ2xldE5hbWUsIHBhZ2UpO1xuICAgIGJyb3dzZXIud2FpdEZvckFuZ3VsYXIoKTtcbiAgICBjcmVhdGVEZWZhdWx0SnNvbkltcG9ydGVkVHdpZ2xldChwYWdlKTtcbiAgICBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gIH0pO1xuXG4gIGFmdGVyQWxsKCgpID0+IHtcbiAgICAvLyBicm93c2VyLm1hbmFnZSgpLmxvZ3MoKS5nZXQoJ2Jyb3dzZXInKS50aGVuKGZ1bmN0aW9uKGJyb3dzZXJMb2cpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdsb2c6ICcgKyByZXF1aXJlKCd1dGlsJykuaW5zcGVjdChicm93c2VyTG9nKSk7XG4gICAgLy8gfSk7XG4gICAgZGVsZXRlRGVmYXVsdEpzb25JbXBvcnRlZFR3aWdsZXQocGFnZSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhZGRpbmcgYSBncmF2aXR5IHBvaW50JywgKCkgPT4ge1xuICAgIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgICBwYWdlLmFjY29yZGlvbi5nb1RvTWVudSgnR3Jhdml0eScpO1xuICAgICAgcGFnZS5hY2NvcmRpb24uZ3Jhdml0eU1lbnUudG9nZ2xlR3Jhdml0eUVkaXRQcm9jZXNzKCk7XG4gICAgfSk7XG5cbiAgICBpdCgncG9wcyB1cCB0aGUgZWRpdCBncmF2aXR5IHBvaW50IG1vZGFsJywgKCkgPT4ge1xuICAgICAgcGFnZS50d2lnbGV0R3JhcGguYWRkR3Jhdml0eVBvaW50KCk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuZmlsbEluT25seVRleHRGaWVsZCgnbmV3IG5hbWUnKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignU2F2ZSBDaGFuZ2VzJyk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMud2FpdEZvck1vZGFsVG9DbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgdGhlIGdyYXZpdHkgcG9pbnQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QocGFnZS50d2lnbGV0R3JhcGguZ3Jhdml0eVBvaW50Q291bnQpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlZGl0aW5nIGEgZ3Jhdml0eSBwb2ludCcsICgpID0+IHtcbiAgICBpdCgncG9wcyB1cCB0aGUgZWRpdCBncmF2aXR5IG1vZGFsJywgKCkgPT4ge1xuICAgICAgcGFnZS50d2lnbGV0R3JhcGgub3BlbkVkaXRHcmF2aXR5TW9kYWwoKTtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMubW9kYWxUaXRsZSkudG9FcXVhbCgnR3Jhdml0eSBQb2ludCBFZGl0b3InKTtcbiAgICB9KTtcblxuICAgIGl0KCdjYW4gcmVuYW1lIHRoZSBncmF2aXR5IHBvaW50JywgKCkgPT4ge1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmZpbGxJbk9ubHlUZXh0RmllbGQoJ25ldyBuYW1lJyk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuY2xpY2tCdXR0b24oJ1NhdmUgQ2hhbmdlcycpO1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLndhaXRGb3JNb2RhbFRvQ2xvc2UoKTtcbiAgICAgIGV4cGVjdChwYWdlLnR3aWdsZXRHcmFwaC5ncmF2aXR5UG9pbnROYW1lKS50b0VxdWFsKCduZXcgbmFtZScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmVtb3ZpbmcgYSBncmF2aXR5IHBvaW50JywgKCkgPT4ge1xuICAgIGl0KCdjYW4gcmVtb3ZlIHRoZSBncmF2aXR5IHBvaW50JywgKCkgPT4ge1xuICAgICAgcGFnZS50d2lnbGV0R3JhcGgub3BlbkVkaXRHcmF2aXR5TW9kYWwoKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignRGVsZXRlJyk7XG4gICAgICBleHBlY3QocGFnZS50d2lnbGV0R3JhcGguZ3Jhdml0eVBvaW50Q291bnQpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=