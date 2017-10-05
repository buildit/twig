"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = require("querystring");
var protractor_1 = require("protractor");
var app_po_1 = require("../PageObjects/app.po");
var utils_1 = require("../utils");
describe('View Lifecycle', function () {
    var page;
    var viewName = 'Test View';
    var newViewName = 'Test View 2';
    beforeAll(function () {
        var height = 650;
        var width = 1200;
        protractor_1.browser.driver.manage().window().setSize(width, height);
        page = new app_po_1.TwigPage();
        page.navigateTo();
        page.user.loginDefaultTestUser();
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
    describe('Create a View', function () {
        it('pops up the create view modal when the button is pressed', function () {
            page.accordion.goToMenu('Environment');
            page.accordion.environmentMenu.toggleByLabel('Node Labels');
            page.accordion.filtersMenu.filters[0].type = 'ent1';
            page.header.twigletTab.viewMenu.startNewViewProcess();
            expect(page.formForModals.modalTitle).toEqual('Create New View');
        });
        it('does not start out showing any form errors', function () {
            expect(page.formForModals.formErrorCount).toEqual(0);
        });
        it('should close the modal when the submit button is clicked with a name', function () {
            page.formForModals.fillInTextFieldByLabel('Name', viewName);
            page.formForModals.clickButton('Save');
            page.formForModals.waitForModalToClose();
            expect(page.formForModals.isModalOpen).toBeFalsy();
        });
        it('should redirect to the view page', function () {
            protractor_1.browser.getCurrentUrl().then(function (url) {
                expect(url.endsWith("/view/" + querystring_1.escape(viewName))).toEqual(true);
            });
        });
        it('should display the correct number of views', function () {
            expect(page.header.twigletTab.viewMenu.viewCount).toEqual(3);
        });
    });
    describe('Viewing a View', function () {
        it('should redirect to the view page', function () {
            return protractor_1.browser.getCurrentUrl().then(function (url) {
                expect(url.endsWith("/view/" + querystring_1.escape(viewName))).toEqual(true);
                return protractor_1.browser.waitForAngular();
            });
        });
        it('displays the view when view is clicked', function () {
            page.header.twigletTab.viewMenu.startViewViewProcess(viewName);
            expect(page.twigletGraph.checkNodeLabels('node1-1', 'invisible')).toBeFalsy();
        });
        it('displays the correct number of nodes', function () {
            expect(page.twigletGraph.nodeCount).toEqual(2);
        });
    });
    describe('Overwriting a View', function () {
        it('brings up the save view modal when the overwrite button is clicked', function () {
            page.header.twigletTab.viewMenu.startEditViewProcess();
            page.accordion.goToMenu('Environment');
            page.accordion.environmentMenu.toggleByLabel('Node Labels');
            page.header.twigletTab.viewMenu.startSaveViewProcess(viewName);
            expect(page.formForModals.modalTitle).toEqual("Overwrite " + viewName);
        });
        it('should close the modal when the save button is clicked', function () {
            page.formForModals.fillInTextFieldByLabel('Name', newViewName);
            page.formForModals.clickButton('Save');
            page.formForModals.waitForModalToClose();
            expect(page.formForModals.isModalOpen).toBeFalsy();
        });
        it('should redirect to the view page with new name', function () {
            return protractor_1.browser.getCurrentUrl().then(function (url) {
                expect(url.endsWith("/view/" + querystring_1.escape(newViewName))).toEqual(true);
                return protractor_1.browser.waitForAngular();
            });
        });
        it('displays the updated view', function () {
            expect(page.twigletGraph.checkNodeLabels('node1-1', 'invisible')).toBeTruthy();
        });
    });
    describe('Deleting Views', function () {
        it('can bring up the delete view modal', function () {
            page.header.twigletTab.viewMenu.startDeleteViewProcess(newViewName);
            protractor_1.browser.waitForAngular();
            expect(page.formForModals.modalTitle).toEqual("Delete " + newViewName);
        });
        it('disables the "Delete" button if the name does not match', function () {
            expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
        });
        it('enables the button if the form is filled out correctly', function () {
            page.formForModals.fillInOnlyTextField(newViewName);
            expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
        });
        it('should close the modal when the Delete button is pressed', function () {
            page.formForModals.clickButton('Delete');
            page.formForModals.waitForModalToClose();
            expect(page.formForModals.isModalOpen).toBeFalsy();
        });
        it('should redirect to the twiglet page', function () {
            return protractor_1.browser.getCurrentUrl().then(function (url) {
                expect(url.endsWith("/twiglet/" + querystring_1.escape(utils_1.twigletName))).toEqual(true);
                return protractor_1.browser.waitForAngular();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL2pvdXJuZXlzL3ZpZXcuZTJlLXNwZWMudHMiLCJzb3VyY2VzIjpbIi90d2lnL2UyZS9qb3VybmV5cy92aWV3LmUyZS1zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQXFDO0FBQ3JDLHlDQUFxQztBQUVyQyxnREFBaUQ7QUFDakQsa0NBSWtCO0FBRWxCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixJQUFJLElBQWMsQ0FBQztJQUNuQixJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUM7SUFDN0IsSUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDO0lBRWxDLFNBQVMsQ0FBQztRQUNSLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNuQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbkIsb0JBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4RCxJQUFJLEdBQUcsSUFBSSxpQkFBUSxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hFLG9CQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekIsd0NBQWdDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsb0JBQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQztRQUNQLHFFQUFxRTtRQUNyRSxnRUFBZ0U7UUFDaEUsTUFBTTtRQUNOLHdDQUFnQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4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QUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsTUFBTSxDQUFDLG9CQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztnQkFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBWSxvQkFBTSxDQUFDLG1CQUFXLENBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0RSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGVzY2FwZSB9IGZyb20gJ3F1ZXJ5c3RyaW5nJztcbmltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICdwcm90cmFjdG9yJztcblxuaW1wb3J0IHsgVHdpZ1BhZ2UgfSBmcm9tICcuLi9QYWdlT2JqZWN0cy9hcHAucG8nO1xuaW1wb3J0IHtcbiAgY3JlYXRlRGVmYXVsdEpzb25JbXBvcnRlZFR3aWdsZXQsXG4gIGRlbGV0ZURlZmF1bHRKc29uSW1wb3J0ZWRUd2lnbGV0LFxuICB0d2lnbGV0TmFtZVxufSBmcm9tICcuLi91dGlscyc7XG5cbmRlc2NyaWJlKCdWaWV3IExpZmVjeWNsZScsICgpID0+IHtcbiAgbGV0IHBhZ2U6IFR3aWdQYWdlO1xuICBjb25zdCB2aWV3TmFtZSA9ICdUZXN0IFZpZXcnO1xuICBjb25zdCBuZXdWaWV3TmFtZSA9ICdUZXN0IFZpZXcgMic7XG5cbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBjb25zdCBoZWlnaHQgPSA2NTA7XG4gICAgY29uc3Qgd2lkdGggPSAxMjAwO1xuICAgIGJyb3dzZXIuZHJpdmVyLm1hbmFnZSgpLndpbmRvdygpLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgcGFnZSA9IG5ldyBUd2lnUGFnZSgpO1xuICAgIHBhZ2UubmF2aWdhdGVUbygpO1xuICAgIHBhZ2UudXNlci5sb2dpbkRlZmF1bHRUZXN0VXNlcigpO1xuICAgIHBhZ2UuaGVhZGVyLnR3aWdsZXRUYWIuZGVsZXRlVHdpZ2xldElmTmVlZGVkKHR3aWdsZXROYW1lLCBwYWdlKTtcbiAgICBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gICAgY3JlYXRlRGVmYXVsdEpzb25JbXBvcnRlZFR3aWdsZXQocGFnZSk7XG4gICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xuICB9KTtcblxuICBhZnRlckFsbCgoKSA9PiB7XG4gICAgLy8gYnJvd3Nlci5tYW5hZ2UoKS5sb2dzKCkuZ2V0KCdicm93c2VyJykudGhlbihmdW5jdGlvbihicm93c2VyTG9nKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnbG9nOiAnICsgcmVxdWlyZSgndXRpbCcpLmluc3BlY3QoYnJvd3NlckxvZykpO1xuICAgIC8vIH0pO1xuICAgIGRlbGV0ZURlZmF1bHRKc29uSW1wb3J0ZWRUd2lnbGV0KHBhZ2UpO1xuICB9KTtcblxuICBkZXNjcmliZSgnQ3JlYXRlIGEgVmlldycsICgpID0+IHtcbiAgICBpdCgncG9wcyB1cCB0aGUgY3JlYXRlIHZpZXcgbW9kYWwgd2hlbiB0aGUgYnV0dG9uIGlzIHByZXNzZWQnLCAoKSA9PiB7XG4gICAgICBwYWdlLmFjY29yZGlvbi5nb1RvTWVudSgnRW52aXJvbm1lbnQnKTtcbiAgICAgIHBhZ2UuYWNjb3JkaW9uLmVudmlyb25tZW50TWVudS50b2dnbGVCeUxhYmVsKCdOb2RlIExhYmVscycpO1xuICAgICAgcGFnZS5hY2NvcmRpb24uZmlsdGVyc01lbnUuZmlsdGVyc1swXS50eXBlID0gJ2VudDEnO1xuICAgICAgcGFnZS5oZWFkZXIudHdpZ2xldFRhYi52aWV3TWVudS5zdGFydE5ld1ZpZXdQcm9jZXNzKCk7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLm1vZGFsVGl0bGUpLnRvRXF1YWwoJ0NyZWF0ZSBOZXcgVmlldycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXMgbm90IHN0YXJ0IG91dCBzaG93aW5nIGFueSBmb3JtIGVycm9ycycsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMuZm9ybUVycm9yQ291bnQpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIHRoZSBtb2RhbCB3aGVuIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWQgd2l0aCBhIG5hbWUnLCAoKSA9PiB7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuZmlsbEluVGV4dEZpZWxkQnlMYWJlbCgnTmFtZScsIHZpZXdOYW1lKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignU2F2ZScpO1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLndhaXRGb3JNb2RhbFRvQ2xvc2UoKTtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMuaXNNb2RhbE9wZW4pLnRvQmVGYWxzeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZWRpcmVjdCB0byB0aGUgdmlldyBwYWdlJywgKCkgPT4ge1xuICAgICAgYnJvd3Nlci5nZXRDdXJyZW50VXJsKCkudGhlbih1cmwgPT4ge1xuICAgICAgICBleHBlY3QodXJsLmVuZHNXaXRoKGAvdmlldy8ke2VzY2FwZSh2aWV3TmFtZSl9YCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSB0aGUgY29ycmVjdCBudW1iZXIgb2Ygdmlld3MnLCAoKSA9PiB7XG4gICAgICBleHBlY3QocGFnZS5oZWFkZXIudHdpZ2xldFRhYi52aWV3TWVudS52aWV3Q291bnQpLnRvRXF1YWwoMyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdWaWV3aW5nIGEgVmlldycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IHRvIHRoZSB2aWV3IHBhZ2UnLCAoKSA9PiB7XG4gICAgICByZXR1cm4gYnJvd3Nlci5nZXRDdXJyZW50VXJsKCkudGhlbih1cmwgPT4ge1xuICAgICAgICBleHBlY3QodXJsLmVuZHNXaXRoKGAvdmlldy8ke2VzY2FwZSh2aWV3TmFtZSl9YCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIHJldHVybiBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdkaXNwbGF5cyB0aGUgdmlldyB3aGVuIHZpZXcgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHBhZ2UuaGVhZGVyLnR3aWdsZXRUYWIudmlld01lbnUuc3RhcnRWaWV3Vmlld1Byb2Nlc3Modmlld05hbWUpO1xuICAgICAgZXhwZWN0KHBhZ2UudHdpZ2xldEdyYXBoLmNoZWNrTm9kZUxhYmVscygnbm9kZTEtMScsICdpbnZpc2libGUnKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGlzcGxheXMgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIG5vZGVzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBhZ2UudHdpZ2xldEdyYXBoLm5vZGVDb3VudCkudG9FcXVhbCgyKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ092ZXJ3cml0aW5nIGEgVmlldycsICgpID0+IHtcbiAgICBpdCgnYnJpbmdzIHVwIHRoZSBzYXZlIHZpZXcgbW9kYWwgd2hlbiB0aGUgb3ZlcndyaXRlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcGFnZS5oZWFkZXIudHdpZ2xldFRhYi52aWV3TWVudS5zdGFydEVkaXRWaWV3UHJvY2VzcygpO1xuICAgICAgcGFnZS5hY2NvcmRpb24uZ29Ub01lbnUoJ0Vudmlyb25tZW50Jyk7XG4gICAgICBwYWdlLmFjY29yZGlvbi5lbnZpcm9ubWVudE1lbnUudG9nZ2xlQnlMYWJlbCgnTm9kZSBMYWJlbHMnKTtcbiAgICAgIHBhZ2UuaGVhZGVyLnR3aWdsZXRUYWIudmlld01lbnUuc3RhcnRTYXZlVmlld1Byb2Nlc3Modmlld05hbWUpO1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5tb2RhbFRpdGxlKS50b0VxdWFsKGBPdmVyd3JpdGUgJHt2aWV3TmFtZX1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgdGhlIG1vZGFsIHdoZW4gdGhlIHNhdmUgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuZmlsbEluVGV4dEZpZWxkQnlMYWJlbCgnTmFtZScsIG5ld1ZpZXdOYW1lKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignU2F2ZScpO1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLndhaXRGb3JNb2RhbFRvQ2xvc2UoKTtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMuaXNNb2RhbE9wZW4pLnRvQmVGYWxzeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZWRpcmVjdCB0byB0aGUgdmlldyBwYWdlIHdpdGggbmV3IG5hbWUnLCAoKSA9PiB7XG4gICAgICByZXR1cm4gYnJvd3Nlci5nZXRDdXJyZW50VXJsKCkudGhlbih1cmwgPT4ge1xuICAgICAgICBleHBlY3QodXJsLmVuZHNXaXRoKGAvdmlldy8ke2VzY2FwZShuZXdWaWV3TmFtZSl9YCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIHJldHVybiBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdkaXNwbGF5cyB0aGUgdXBkYXRlZCB2aWV3JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBhZ2UudHdpZ2xldEdyYXBoLmNoZWNrTm9kZUxhYmVscygnbm9kZTEtMScsICdpbnZpc2libGUnKSkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnRGVsZXRpbmcgVmlld3MnLCAoKSA9PiB7XG4gICAgaXQoJ2NhbiBicmluZyB1cCB0aGUgZGVsZXRlIHZpZXcgbW9kYWwnLCAoKSA9PiB7XG4gICAgICBwYWdlLmhlYWRlci50d2lnbGV0VGFiLnZpZXdNZW51LnN0YXJ0RGVsZXRlVmlld1Byb2Nlc3MobmV3Vmlld05hbWUpO1xuICAgICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5tb2RhbFRpdGxlKS50b0VxdWFsKGBEZWxldGUgJHtuZXdWaWV3TmFtZX1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdkaXNhYmxlcyB0aGUgXCJEZWxldGVcIiBidXR0b24gaWYgdGhlIG5hbWUgZG9lcyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLmNoZWNrSWZCdXR0b25FbmFibGVkKCdEZWxldGUnKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZW5hYmxlcyB0aGUgYnV0dG9uIGlmIHRoZSBmb3JtIGlzIGZpbGxlZCBvdXQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmZpbGxJbk9ubHlUZXh0RmllbGQobmV3Vmlld05hbWUpO1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5jaGVja0lmQnV0dG9uRW5hYmxlZCgnRGVsZXRlJykpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgdGhlIG1vZGFsIHdoZW4gdGhlIERlbGV0ZSBidXR0b24gaXMgcHJlc3NlZCcsICgpID0+IHtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignRGVsZXRlJyk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMud2FpdEZvck1vZGFsVG9DbG9zZSgpO1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5pc01vZGFsT3BlbikudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IHRvIHRoZSB0d2lnbGV0IHBhZ2UnLCAoKSA9PiB7XG4gICAgICByZXR1cm4gYnJvd3Nlci5nZXRDdXJyZW50VXJsKCkudGhlbih1cmwgPT4ge1xuICAgICAgICBleHBlY3QodXJsLmVuZHNXaXRoKGAvdHdpZ2xldC8ke2VzY2FwZSh0d2lnbGV0TmFtZSl9YCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIHJldHVybiBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==