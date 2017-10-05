"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var app_po_1 = require("../PageObjects/app.po");
var index_1 = require("./../PageObjects/EditNodeModal/index");
var utils_1 = require("../utils");
describe('Twiglet Lifecycle', function () {
    var page;
    var twigletName = 'Test Twiglet';
    beforeAll(function () {
        page = new app_po_1.TwigPage();
        page.navigateTo();
        page.user.loginDefaultTestUser();
        protractor_1.browser.waitForAngular();
        page.header.twigletTab.deleteTwigletIfNeeded(twigletName, page);
        protractor_1.browser.waitForAngular();
        page.header.modelTab.deleteModelIfNeeded(utils_1.modelName, page);
        protractor_1.browser.waitForAngular();
        utils_1.createDefaultModel(page);
    });
    afterAll(function () {
        // browser.manage().logs().get('browser').then(function(browserLog) {
        //   console.log('log: ' + require('util').inspect(browserLog));
        // });
        utils_1.deleteDefaultModel(page);
    });
    describe('Create a Twiglet', function () {
        beforeAll(function () {
            page.header.goToTab('Twiglet');
        });
        it('pops up the create twiglet modal when the button is pressed', function () {
            page.header.twigletTab.startNewTwigletProcess();
            expect(page.formForModals.modalTitle).toEqual('Create New Twiglet');
        });
        it('starts with the "Create" being disabled', function () {
            expect(page.formForModals.checkIfButtonEnabled('Create')).toBeFalsy();
        });
        it('does not start out showing any form errors', function () {
            expect(page.formForModals.formErrorCount).toEqual(0);
        });
        it('displays an error if the name is empty', function () {
            page.formForModals.makeInputFieldDirtyByLabel('Name');
            expect(page.formForModals.getErrorByLabel('Name')).toEqual('A name is required.');
        });
        it('removes the error if a value is put into the name field', function () {
            page.formForModals.fillInTextFieldByLabel('Name', twigletName);
            expect(page.formForModals.getErrorByLabel('Name')).toBeUndefined();
        });
        it('displays an error if the model is not selected', function () {
            page.formForModals.makeSelectDirtyByLabel('Model');
            expect(page.formForModals.getErrorByLabel('Model')).toEqual('A model from the list is required.');
        });
        it('removes the error if a model is selected', function () {
            page.formForModals.selectOptionByLabel('Model', utils_1.modelName);
            expect(page.formForModals.getErrorByLabel('Model')).toBeUndefined();
        });
        it('should enable the "Create" button once the minimum is filled out', function () {
            expect(page.formForModals.checkIfButtonEnabled('Create')).toBeTruthy();
        });
        it('should close the modal when the submit button is pressed', function () {
            page.formForModals.clickButton('Create');
            page.formForModals.waitForModalToClose();
            protractor_1.browser.waitForAngular();
            expect(page.formForModals.isModalOpen).toBeFalsy();
        });
    });
    describe('Adding nodes and links', function () {
        beforeAll(function () {
            page.header.twigletEditTab.startTwigletEditProcess();
            protractor_1.browser.waitForAngular();
        });
        it('can add a node to the canvas', function () {
            page.header.twigletEditTab.addNodeByTooltip('ent1');
            expect(page.twigletGraph.nodeCount).toEqual(1);
        });
        it('pops up the add node modal', function () {
            expect(page.formForModals.modalTitle).toEqual('Node Editor');
        });
        it('can save the node', function () {
            page.formForModals.fillInTextFieldByLabel('Name', 'node 1');
            var editNode = new index_1.EditNode();
            page.formForModals.clickButton('Show Attributes');
            page.formForModals.clickButtonByClassName('fa-plus');
            editNode.fillKey(1, 'key1');
            editNode.fillValue(1, 'value1');
            page.formForModals.clickButtonByClassName('fa-plus');
            editNode.fillKey(2, 'key2');
            editNode.fillValue(2, 'value2');
            page.formForModals.clickButton('Add Node');
            page.formForModals.waitForModalToClose();
            expect(page.formForModals.isModalOpen).toBeFalsy();
        });
    });
    describe('same-type-nodes add attributes keys to each other', function () {
        it('adds attributes to other nodes', function () {
            page.header.twigletEditTab.addNodeByTooltip('ent1');
            var editNode = new index_1.EditNode();
            expect(editNode.getKey(1)).toEqual("key1 (string)");
            expect(editNode.getKey(2)).toEqual("key2 (string)");
            page.formForModals.clickButton('Delete');
        });
    });
    describe('switching a node type', function () {
        var editNode;
        var attributes;
        var nodeName = 'Switching Type 2 -> 3';
        var requiredSymbol = '*';
        var diamond = '';
        beforeAll(function () {
            editNode = new index_1.EditNode();
            page.header.twigletEditTab.addNodeByTooltip('ent2', { x: 10, y: 100 });
            page.formForModals.fillInTextFieldByLabel('Name', nodeName);
            editNode.fillValue(1, 'abc 123 @#$');
            editNode.fillValue(2, 2);
            editNode.fillValue(3, '3.5');
            page.formForModals.clickButton('Add Node');
        });
        it('starts the editing process', function () {
            page.twigletGraph.startEditing(nodeName);
            return editNode.attributes.then(function (_attributes) {
                attributes = _attributes;
                expect(attributes.length).toEqual(4);
            });
        });
        it('can change the type of node', function () {
            editNode.switchType('ent3');
            protractor_1.browser.sleep(5000);
        });
        it('updates the attributes on a node change', function () {
            return editNode.attributes.then(function (_attributes) {
                attributes = _attributes;
                expect(attributes.length).toEqual(5);
            });
        });
        it('keeps the old attributes with values', function () {
            var oldFilledInKeys = ['key1', 'key2', 'key3'];
            var attributeKeys = attributes.map(function (attribute) { return attribute.key; });
            expect(attributeKeys.filter(function (key) { return oldFilledInKeys.some(function (oldKey) { return key.includes(oldKey); }); }).length).toEqual(3);
        });
        it('removes the requirements from old keys', function () {
            var oldRequirements = ['key1', 'key3'];
            var attributeKeys = attributes.map(function (attribute) { return attribute.key; });
            var updatedVersionsOfOldKeys = attributeKeys.filter(function (key) { return oldRequirements.some(function (oldKey) { return key.includes(oldKey); }); });
            expect(updatedVersionsOfOldKeys.every(function (key) { return !key.includes(requiredSymbol); })).toBeTruthy();
        });
        it('gets rid of old attributes without a filled in value', function () {
            var shouldBeGone = 'key4';
            var attributeKeys = attributes.map(function (attribute) { return attribute.key; });
            expect(attributeKeys.every(function (key) { return !key.includes(shouldBeGone); })).toBeTruthy();
        });
        it('puts a required on new required attributes', function () {
            var shouldBeStarred = 'key5';
            var shouldBeStarredKey = attributes.map(function (attribute) { return attribute.key; }).filter(function (key) { return key.includes(shouldBeStarred); })[0];
            expect(shouldBeStarredKey.includes(requiredSymbol)).toBeTruthy();
        });
        it('updates the canvas', function () {
            editNode.fillValue(1, 5);
            page.formForModals.clickButton('Update Node');
            page.formForModals.waitForModalToClose();
            expect(page.twigletGraph.getNodeType(nodeName)).toEqual(diamond);
        });
    });
    describe('required model attributes', function () {
        var attributes;
        var editNode;
        beforeAll(function () {
            editNode = new index_1.EditNode();
            page.header.twigletEditTab.addNodeByTooltip('ent2');
            page.formForModals.fillInTextFieldByLabel('Name', 'node 2');
            return editNode.attributes.then(function (_attributes) {
                attributes = _attributes;
            });
        });
        it('puts required on the correct attributes', function () {
            var required = ['key1', 'key3'];
            attributes
                .filter(function (attribute) { return attribute.tagName === 'label'; })
                .filter(function (attribute) { return attribute.key.startsWith('*'); })
                .forEach(function (attribute) {
                expect(required.some(function (key) { return attribute.key.includes(key); })).toBeTruthy();
            });
        });
        it('does not put required on incorrect attributes', function () {
            var notRequired = ['key2', 'key4'];
            attributes
                .filter(function (attribute) { return attribute.tagName === 'label'; })
                .filter(function (attribute) { return !attribute.key.startsWith('*'); })
                .forEach(function (attribute) {
                expect(notRequired.some(function (key) { return attribute.key.includes(key); })).toBeTruthy();
            });
        });
        describe('string types', function () {
            it('allows anything inside of strings', function () {
                editNode.fillValue(1, 'abc 123 @#$');
                expect(editNode.getError(1)).toBeUndefined();
            });
        });
        describe('integer types', function () {
            it('does not allow strings', function () {
                editNode.fillValue(2, 'a');
                expect(editNode.getError(2)).not.toBeUndefined();
            });
            it('does not allow decimals', function () {
                editNode.fillValue(2, '2.5');
                expect(editNode.getError(2)).not.toBeUndefined();
            });
            it('allows integers', function () {
                editNode.fillValue(2, 2);
                expect(editNode.getError(2)).toBeUndefined();
            });
        });
        describe('float types', function () {
            it('does not allow strings', function () {
                editNode.fillValue(3, 'a');
                expect(editNode.getError(3)).not.toBeUndefined();
            });
            it('allows decimals', function () {
                editNode.fillValue(3, '3.5');
                expect(editNode.getError(3)).toBeUndefined();
            });
            it('allows integers', function () {
                editNode.fillValue(3, 3);
                expect(editNode.getError(3)).toBeUndefined();
            });
        });
        describe('dates', function () {
            it('does not allow non dates', function () {
                editNode.fillValue(4, 'a');
                expect(editNode.getError(4)).not.toBeUndefined();
            });
            it('can process dates', function () {
                editNode.fillValue(4, '2017/04/25');
                expect(editNode.getError(4)).toBeUndefined();
            });
        });
        it('can save the node', function () {
            page.formForModals.clickButton('Add Node');
            page.formForModals.waitForModalToClose();
            expect(page.formForModals.isModalOpen).toBeFalsy();
        });
        it('can save the edits', function () {
            page.header.twigletEditTab.saveEdits();
            page.formForModals.fillInOnlyTextField('Commit message');
            page.formForModals.clickButton('Save Changes');
        });
    });
    describe('Editing the model', function () {
        beforeAll(function () {
            protractor_1.browser.waitForAngular();
            page.header.twigletEditTab.startTwigletEditProcess();
            page.header.twigletEditTab.startTwigletModelEditProcess();
        });
        it('opens the model form', function () {
            expect(page.twigletModel.isOpen).toBeTruthy();
        });
        it('allows the user to add an entity', function () {
            page.modelEditForm.addEntity('zzzzz', 'dollar', '#008800');
            expect(page.twigletModel.entityCount).toEqual(5);
        });
        it('allows the user to remove an entity', function () {
            page.modelEditForm.clickButton('fa-trash');
            expect(page.twigletModel.entityCount).toEqual(4);
        });
        it('does not allow the user to remove an entity that is in the twiglet', function () {
            expect(page.twigletModel.removeButtonCount).toEqual(1);
        });
        it('can save the edits', function () {
            page.header.twigletEditTab.saveEdits();
        });
    });
    describe('Deleting Twiglets', function () {
        beforeAll(function () {
            page = new app_po_1.TwigPage();
            page.navigateTo();
        });
        it('can bring up the delete twiglet modal', function () {
            page.header.twigletTab.startDeleteTwigletProcess(twigletName);
            expect(page.formForModals.modalTitle).toEqual("Delete " + twigletName);
        });
        it('disables the "Delete" button if the name does not match', function () {
            expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeFalsy();
        });
        it('enables the button if the form is filled out correctly', function () {
            page.formForModals.fillInOnlyTextField(twigletName);
            expect(page.formForModals.checkIfButtonEnabled('Delete')).toBeTruthy();
        });
        it('should close the modal when the Delete button is pressed', function () {
            page.formForModals.clickButton('Delete');
            page.formForModals.waitForModalToClose();
            expect(page.formForModals.isModalOpen).toBeFalsy();
            page.formForModals.waitForModalToClose();
            protractor_1.browser.waitForAngular();
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL2pvdXJuZXlzL3R3aWdsZXQuZTJlLXNwZWMudHMiLCJzb3VyY2VzIjpbIi90d2lnL2UyZS9qb3VybmV5cy90d2lnbGV0LmUyZS1zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXFDO0FBRXJDLGdEQUFpRDtBQUNqRCw4REFBZ0U7QUFDaEUsa0NBQTZFO0FBRTdFLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUM1QixJQUFJLElBQWMsQ0FBQztJQUNuQixJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7SUFFbkMsU0FBUyxDQUFDO1FBQ1IsSUFBSSxHQUFHLElBQUksaUJBQVEsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDakMsb0JBQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEUsb0JBQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELG9CQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekIsMEJBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUM7UUFDUCxxRUFBcUU7UUFDckUsZ0VBQWdFO1FBQ2hFLE1BQU07UUFDTiwwQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixTQUFTLENBQUM7WUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQyxDQUFD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dXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICdwcm90cmFjdG9yJztcblxuaW1wb3J0IHsgVHdpZ1BhZ2UgfSBmcm9tICcuLi9QYWdlT2JqZWN0cy9hcHAucG8nO1xuaW1wb3J0IHsgRWRpdE5vZGUgfSBmcm9tICcuLy4uL1BhZ2VPYmplY3RzL0VkaXROb2RlTW9kYWwvaW5kZXgnO1xuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdE1vZGVsLCBkZWxldGVEZWZhdWx0TW9kZWwsIG1vZGVsTmFtZSB9IGZyb20gJy4uL3V0aWxzJztcblxuZGVzY3JpYmUoJ1R3aWdsZXQgTGlmZWN5Y2xlJywgKCkgPT4ge1xuICBsZXQgcGFnZTogVHdpZ1BhZ2U7XG4gIGNvbnN0IHR3aWdsZXROYW1lID0gJ1Rlc3QgVHdpZ2xldCc7XG5cbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBwYWdlID0gbmV3IFR3aWdQYWdlKCk7XG4gICAgcGFnZS5uYXZpZ2F0ZVRvKCk7XG4gICAgcGFnZS51c2VyLmxvZ2luRGVmYXVsdFRlc3RVc2VyKCk7XG4gICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xuICAgIHBhZ2UuaGVhZGVyLnR3aWdsZXRUYWIuZGVsZXRlVHdpZ2xldElmTmVlZGVkKHR3aWdsZXROYW1lLCBwYWdlKTtcbiAgICBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gICAgcGFnZS5oZWFkZXIubW9kZWxUYWIuZGVsZXRlTW9kZWxJZk5lZWRlZChtb2RlbE5hbWUsIHBhZ2UpO1xuICAgIGJyb3dzZXIud2FpdEZvckFuZ3VsYXIoKTtcbiAgICBjcmVhdGVEZWZhdWx0TW9kZWwocGFnZSk7XG4gIH0pO1xuXG4gIGFmdGVyQWxsKCgpID0+IHtcbiAgICAvLyBicm93c2VyLm1hbmFnZSgpLmxvZ3MoKS5nZXQoJ2Jyb3dzZXInKS50aGVuKGZ1bmN0aW9uKGJyb3dzZXJMb2cpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdsb2c6ICcgKyByZXF1aXJlKCd1dGlsJykuaW5zcGVjdChicm93c2VyTG9nKSk7XG4gICAgLy8gfSk7XG4gICAgZGVsZXRlRGVmYXVsdE1vZGVsKHBhZ2UpO1xuICB9KTtcblxuICBkZXNjcmliZSgnQ3JlYXRlIGEgVHdpZ2xldCcsICgpID0+IHtcbiAgICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgICAgcGFnZS5oZWFkZXIuZ29Ub1RhYignVHdpZ2xldCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3BvcHMgdXAgdGhlIGNyZWF0ZSB0d2lnbGV0IG1vZGFsIHdoZW4gdGhlIGJ1dHRvbiBpcyBwcmVzc2VkJywgKCkgPT4ge1xuICAgICAgcGFnZS5oZWFkZXIudHdpZ2xldFRhYi5zdGFydE5ld1R3aWdsZXRQcm9jZXNzKCk7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLm1vZGFsVGl0bGUpLnRvRXF1YWwoJ0NyZWF0ZSBOZXcgVHdpZ2xldCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N0YXJ0cyB3aXRoIHRoZSBcIkNyZWF0ZVwiIGJlaW5nIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5jaGVja0lmQnV0dG9uRW5hYmxlZCgnQ3JlYXRlJykpLnRvQmVGYWxzeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXMgbm90IHN0YXJ0IG91dCBzaG93aW5nIGFueSBmb3JtIGVycm9ycycsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMuZm9ybUVycm9yQ291bnQpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGlzcGxheXMgYW4gZXJyb3IgaWYgdGhlIG5hbWUgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMubWFrZUlucHV0RmllbGREaXJ0eUJ5TGFiZWwoJ05hbWUnKTtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMuZ2V0RXJyb3JCeUxhYmVsKCdOYW1lJykpLnRvRXF1YWwoJ0EgbmFtZSBpcyByZXF1aXJlZC4nKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVzIHRoZSBlcnJvciBpZiBhIHZhbHVlIGlzIHB1dCBpbnRvIHRoZSBuYW1lIGZpZWxkJywgKCkgPT4ge1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmZpbGxJblRleHRGaWVsZEJ5TGFiZWwoJ05hbWUnLCB0d2lnbGV0TmFtZSk7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLmdldEVycm9yQnlMYWJlbCgnTmFtZScpKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGlzcGxheXMgYW4gZXJyb3IgaWYgdGhlIG1vZGVsIGlzIG5vdCBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5tYWtlU2VsZWN0RGlydHlCeUxhYmVsKCdNb2RlbCcpO1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5nZXRFcnJvckJ5TGFiZWwoJ01vZGVsJykpLnRvRXF1YWwoJ0EgbW9kZWwgZnJvbSB0aGUgbGlzdCBpcyByZXF1aXJlZC4nKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVzIHRoZSBlcnJvciBpZiBhIG1vZGVsIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLnNlbGVjdE9wdGlvbkJ5TGFiZWwoJ01vZGVsJywgbW9kZWxOYW1lKTtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMuZ2V0RXJyb3JCeUxhYmVsKCdNb2RlbCcpKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSB0aGUgXCJDcmVhdGVcIiBidXR0b24gb25jZSB0aGUgbWluaW11bSBpcyBmaWxsZWQgb3V0JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5jaGVja0lmQnV0dG9uRW5hYmxlZCgnQ3JlYXRlJykpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgdGhlIG1vZGFsIHdoZW4gdGhlIHN1Ym1pdCBidXR0b24gaXMgcHJlc3NlZCcsICgpID0+IHtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignQ3JlYXRlJyk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMud2FpdEZvck1vZGFsVG9DbG9zZSgpO1xuICAgICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5pc01vZGFsT3BlbikudG9CZUZhbHN5KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdBZGRpbmcgbm9kZXMgYW5kIGxpbmtzJywgKCkgPT4ge1xuICAgIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgICBwYWdlLmhlYWRlci50d2lnbGV0RWRpdFRhYi5zdGFydFR3aWdsZXRFZGl0UHJvY2VzcygpO1xuICAgICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbiBhZGQgYSBub2RlIHRvIHRoZSBjYW52YXMnLCAoKSA9PiB7XG4gICAgICBwYWdlLmhlYWRlci50d2lnbGV0RWRpdFRhYi5hZGROb2RlQnlUb29sdGlwKCdlbnQxJyk7XG4gICAgICBleHBlY3QocGFnZS50d2lnbGV0R3JhcGgubm9kZUNvdW50KS50b0VxdWFsKDEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3BvcHMgdXAgdGhlIGFkZCBub2RlIG1vZGFsJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5tb2RhbFRpdGxlKS50b0VxdWFsKCdOb2RlIEVkaXRvcicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbiBzYXZlIHRoZSBub2RlJywgKCkgPT4ge1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmZpbGxJblRleHRGaWVsZEJ5TGFiZWwoJ05hbWUnLCAnbm9kZSAxJyk7XG4gICAgICBjb25zdCBlZGl0Tm9kZSA9IG5ldyBFZGl0Tm9kZSgpO1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmNsaWNrQnV0dG9uKCdTaG93IEF0dHJpYnV0ZXMnKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbkJ5Q2xhc3NOYW1lKCdmYS1wbHVzJyk7XG4gICAgICBlZGl0Tm9kZS5maWxsS2V5KDEsICdrZXkxJyk7XG4gICAgICBlZGl0Tm9kZS5maWxsVmFsdWUoMSwgJ3ZhbHVlMScpO1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmNsaWNrQnV0dG9uQnlDbGFzc05hbWUoJ2ZhLXBsdXMnKTtcbiAgICAgIGVkaXROb2RlLmZpbGxLZXkoMiwgJ2tleTInKTtcbiAgICAgIGVkaXROb2RlLmZpbGxWYWx1ZSgyLCAndmFsdWUyJyk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuY2xpY2tCdXR0b24oJ0FkZCBOb2RlJyk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMud2FpdEZvck1vZGFsVG9DbG9zZSgpO1xuICAgICAgZXhwZWN0KHBhZ2UuZm9ybUZvck1vZGFscy5pc01vZGFsT3BlbikudG9CZUZhbHN5KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzYW1lLXR5cGUtbm9kZXMgYWRkIGF0dHJpYnV0ZXMga2V5cyB0byBlYWNoIG90aGVyJywgKCkgPT4ge1xuICAgIGl0KCdhZGRzIGF0dHJpYnV0ZXMgdG8gb3RoZXIgbm9kZXMnLCAoKSA9PiB7XG4gICAgICBwYWdlLmhlYWRlci50d2lnbGV0RWRpdFRhYi5hZGROb2RlQnlUb29sdGlwKCdlbnQxJyk7XG4gICAgICBjb25zdCBlZGl0Tm9kZSA9IG5ldyBFZGl0Tm9kZSgpO1xuICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEtleSgxKSkudG9FcXVhbChga2V5MSAoc3RyaW5nKWApO1xuICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEtleSgyKSkudG9FcXVhbChga2V5MiAoc3RyaW5nKWApO1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmNsaWNrQnV0dG9uKCdEZWxldGUnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3N3aXRjaGluZyBhIG5vZGUgdHlwZScsICgpID0+IHtcbiAgICBsZXQgZWRpdE5vZGU6IEVkaXROb2RlO1xuICAgIGxldCBhdHRyaWJ1dGVzOiB7IHRhZ05hbWU6IHN0cmluZywga2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfVtdO1xuICAgIGNvbnN0IG5vZGVOYW1lID0gJ1N3aXRjaGluZyBUeXBlIDIgLT4gMyc7XG4gICAgY29uc3QgcmVxdWlyZWRTeW1ib2wgPSAnKic7XG4gICAgY29uc3QgZGlhbW9uZCA9ICfviJknO1xuICAgIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgICBlZGl0Tm9kZSA9IG5ldyBFZGl0Tm9kZSgpO1xuICAgICAgcGFnZS5oZWFkZXIudHdpZ2xldEVkaXRUYWIuYWRkTm9kZUJ5VG9vbHRpcCgnZW50MicsIHsgeDogMTAsIHk6IDEwMCB9KTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5maWxsSW5UZXh0RmllbGRCeUxhYmVsKCdOYW1lJywgbm9kZU5hbWUpO1xuICAgICAgZWRpdE5vZGUuZmlsbFZhbHVlKDEsICdhYmMgMTIzIEAjJCcpO1xuICAgICAgZWRpdE5vZGUuZmlsbFZhbHVlKDIsIDIpO1xuICAgICAgZWRpdE5vZGUuZmlsbFZhbHVlKDMsICczLjUnKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignQWRkIE5vZGUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzdGFydHMgdGhlIGVkaXRpbmcgcHJvY2VzcycsICgpID0+IHtcbiAgICAgIHBhZ2UudHdpZ2xldEdyYXBoLnN0YXJ0RWRpdGluZyhub2RlTmFtZSk7XG4gICAgICByZXR1cm4gZWRpdE5vZGUuYXR0cmlidXRlcy50aGVuKF9hdHRyaWJ1dGVzID0+IHtcbiAgICAgICAgYXR0cmlidXRlcyA9IF9hdHRyaWJ1dGVzO1xuICAgICAgICBleHBlY3QoYXR0cmlidXRlcy5sZW5ndGgpLnRvRXF1YWwoNCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjYW4gY2hhbmdlIHRoZSB0eXBlIG9mIG5vZGUnLCAoKSA9PiB7XG4gICAgICBlZGl0Tm9kZS5zd2l0Y2hUeXBlKCdlbnQzJyk7XG4gICAgICBicm93c2VyLnNsZWVwKDUwMDApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VwZGF0ZXMgdGhlIGF0dHJpYnV0ZXMgb24gYSBub2RlIGNoYW5nZScsICgpID0+IHtcbiAgICAgIHJldHVybiBlZGl0Tm9kZS5hdHRyaWJ1dGVzLnRoZW4oX2F0dHJpYnV0ZXMgPT4ge1xuICAgICAgICBhdHRyaWJ1dGVzID0gX2F0dHJpYnV0ZXM7XG4gICAgICAgIGV4cGVjdChhdHRyaWJ1dGVzLmxlbmd0aCkudG9FcXVhbCg1KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2tlZXBzIHRoZSBvbGQgYXR0cmlidXRlcyB3aXRoIHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9sZEZpbGxlZEluS2V5cyA9IFsna2V5MScsICdrZXkyJywgJ2tleTMnXTtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZUtleXMgPSBhdHRyaWJ1dGVzLm1hcChhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLmtleSk7XG4gICAgICBleHBlY3QoYXR0cmlidXRlS2V5cy5maWx0ZXIoa2V5ID0+IG9sZEZpbGxlZEluS2V5cy5zb21lKG9sZEtleSA9PiBrZXkuaW5jbHVkZXMob2xkS2V5KSkpLmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVzIHRoZSByZXF1aXJlbWVudHMgZnJvbSBvbGQga2V5cycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9sZFJlcXVpcmVtZW50cyA9IFsna2V5MScsICdrZXkzJ107XG4gICAgICBjb25zdCBhdHRyaWJ1dGVLZXlzID0gYXR0cmlidXRlcy5tYXAoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS5rZXkpO1xuICAgICAgY29uc3QgdXBkYXRlZFZlcnNpb25zT2ZPbGRLZXlzID0gYXR0cmlidXRlS2V5cy5maWx0ZXIoa2V5ID0+IG9sZFJlcXVpcmVtZW50cy5zb21lKG9sZEtleSA9PiBrZXkuaW5jbHVkZXMob2xkS2V5KSkpO1xuICAgICAgZXhwZWN0KHVwZGF0ZWRWZXJzaW9uc09mT2xkS2V5cy5ldmVyeShrZXkgPT4gIWtleS5pbmNsdWRlcyhyZXF1aXJlZFN5bWJvbCkpKS50b0JlVHJ1dGh5KCk7XG4gICAgfSlcblxuICAgIGl0KCdnZXRzIHJpZCBvZiBvbGQgYXR0cmlidXRlcyB3aXRob3V0IGEgZmlsbGVkIGluIHZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2hvdWxkQmVHb25lID0gJ2tleTQnO1xuICAgICAgY29uc3QgYXR0cmlidXRlS2V5cyA9IGF0dHJpYnV0ZXMubWFwKGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUua2V5KTtcbiAgICAgIGV4cGVjdChhdHRyaWJ1dGVLZXlzLmV2ZXJ5KGtleSA9PiAha2V5LmluY2x1ZGVzKHNob3VsZEJlR29uZSkpKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgncHV0cyBhIHJlcXVpcmVkIG9uIG5ldyByZXF1aXJlZCBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2hvdWxkQmVTdGFycmVkID0gJ2tleTUnO1xuICAgICAgY29uc3Qgc2hvdWxkQmVTdGFycmVkS2V5ID0gYXR0cmlidXRlcy5tYXAoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS5rZXkpLmZpbHRlcihrZXkgPT4ga2V5LmluY2x1ZGVzKHNob3VsZEJlU3RhcnJlZCkpWzBdO1xuICAgICAgZXhwZWN0KHNob3VsZEJlU3RhcnJlZEtleS5pbmNsdWRlcyhyZXF1aXJlZFN5bWJvbCkpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KCd1cGRhdGVzIHRoZSBjYW52YXMnLCAoKSA9PiB7XG4gICAgICBlZGl0Tm9kZS5maWxsVmFsdWUoMSwgNSk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuY2xpY2tCdXR0b24oJ1VwZGF0ZSBOb2RlJyk7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMud2FpdEZvck1vZGFsVG9DbG9zZSgpO1xuICAgICAgZXhwZWN0KHBhZ2UudHdpZ2xldEdyYXBoLmdldE5vZGVUeXBlKG5vZGVOYW1lKSkudG9FcXVhbChkaWFtb25kKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3JlcXVpcmVkIG1vZGVsIGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgbGV0IGF0dHJpYnV0ZXM6IHsgdGFnTmFtZTogc3RyaW5nLCBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB9W107XG4gICAgbGV0IGVkaXROb2RlOiBFZGl0Tm9kZTtcbiAgICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgICAgZWRpdE5vZGUgPSBuZXcgRWRpdE5vZGUoKTtcbiAgICAgIHBhZ2UuaGVhZGVyLnR3aWdsZXRFZGl0VGFiLmFkZE5vZGVCeVRvb2x0aXAoJ2VudDInKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5maWxsSW5UZXh0RmllbGRCeUxhYmVsKCdOYW1lJywgJ25vZGUgMicpO1xuICAgICAgcmV0dXJuIGVkaXROb2RlLmF0dHJpYnV0ZXMudGhlbihfYXR0cmlidXRlcyA9PiB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSBfYXR0cmlidXRlcztcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3B1dHMgcmVxdWlyZWQgb24gdGhlIGNvcnJlY3QgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gWydrZXkxJywgJ2tleTMnXTtcbiAgICAgIGF0dHJpYnV0ZXNcbiAgICAgICAgLmZpbHRlcihhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLnRhZ05hbWUgPT09ICdsYWJlbCcpXG4gICAgICAgIC5maWx0ZXIoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS5rZXkuc3RhcnRzV2l0aCgnKicpKVxuICAgICAgICAuZm9yRWFjaChhdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgIGV4cGVjdChyZXF1aXJlZC5zb21lKGtleSA9PiBhdHRyaWJ1dGUua2V5LmluY2x1ZGVzKGtleSkpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXMgbm90IHB1dCByZXF1aXJlZCBvbiBpbmNvcnJlY3QgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG5vdFJlcXVpcmVkID0gWydrZXkyJywgJ2tleTQnXTtcbiAgICAgIGF0dHJpYnV0ZXNcbiAgICAgICAgLmZpbHRlcihhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLnRhZ05hbWUgPT09ICdsYWJlbCcpXG4gICAgICAgIC5maWx0ZXIoYXR0cmlidXRlID0+ICFhdHRyaWJ1dGUua2V5LnN0YXJ0c1dpdGgoJyonKSlcbiAgICAgICAgLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgICAgICBleHBlY3Qobm90UmVxdWlyZWQuc29tZShrZXkgPT4gYXR0cmlidXRlLmtleS5pbmNsdWRlcyhrZXkpKSkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzdHJpbmcgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnYWxsb3dzIGFueXRoaW5nIGluc2lkZSBvZiBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgICBlZGl0Tm9kZS5maWxsVmFsdWUoMSwgJ2FiYyAxMjMgQCMkJyk7XG4gICAgICAgIGV4cGVjdChlZGl0Tm9kZS5nZXRFcnJvcigxKSkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaW50ZWdlciB0eXBlcycsICgpID0+IHtcbiAgICAgIGl0KCdkb2VzIG5vdCBhbGxvdyBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgICBlZGl0Tm9kZS5maWxsVmFsdWUoMiwgJ2EnKTtcbiAgICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEVycm9yKDIpKS5ub3QudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdkb2VzIG5vdCBhbGxvdyBkZWNpbWFscycsICgpID0+IHtcbiAgICAgICAgZWRpdE5vZGUuZmlsbFZhbHVlKDIsICcyLjUnKTtcbiAgICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEVycm9yKDIpKS5ub3QudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdhbGxvd3MgaW50ZWdlcnMnLCAoKSA9PiB7XG4gICAgICAgIGVkaXROb2RlLmZpbGxWYWx1ZSgyLCAyKTtcbiAgICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEVycm9yKDIpKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmbG9hdCB0eXBlcycsICgpID0+IHtcbiAgICAgIGl0KCdkb2VzIG5vdCBhbGxvdyBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgICBlZGl0Tm9kZS5maWxsVmFsdWUoMywgJ2EnKTtcbiAgICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEVycm9yKDMpKS5ub3QudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdhbGxvd3MgZGVjaW1hbHMnLCAoKSA9PiB7XG4gICAgICAgIGVkaXROb2RlLmZpbGxWYWx1ZSgzLCAnMy41Jyk7XG4gICAgICAgIGV4cGVjdChlZGl0Tm9kZS5nZXRFcnJvcigzKSkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdhbGxvd3MgaW50ZWdlcnMnLCAoKSA9PiB7XG4gICAgICAgIGVkaXROb2RlLmZpbGxWYWx1ZSgzLCAzKTtcbiAgICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEVycm9yKDMpKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdkYXRlcycsICgpID0+IHtcbiAgICAgIGl0KCdkb2VzIG5vdCBhbGxvdyBub24gZGF0ZXMnLCAoKSA9PiB7XG4gICAgICAgIGVkaXROb2RlLmZpbGxWYWx1ZSg0LCAnYScpO1xuICAgICAgICBleHBlY3QoZWRpdE5vZGUuZ2V0RXJyb3IoNCkpLm5vdC50b0JlVW5kZWZpbmVkKCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2NhbiBwcm9jZXNzIGRhdGVzJywgKCkgPT4ge1xuICAgICAgICBlZGl0Tm9kZS5maWxsVmFsdWUoNCwgJzIwMTcvMDQvMjUnKTtcbiAgICAgICAgZXhwZWN0KGVkaXROb2RlLmdldEVycm9yKDQpKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjYW4gc2F2ZSB0aGUgbm9kZScsICgpID0+IHtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5jbGlja0J1dHRvbignQWRkIE5vZGUnKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy53YWl0Rm9yTW9kYWxUb0Nsb3NlKCk7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLmlzTW9kYWxPcGVuKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdjYW4gc2F2ZSB0aGUgZWRpdHMnLCAoKSA9PiB7XG4gICAgICBwYWdlLmhlYWRlci50d2lnbGV0RWRpdFRhYi5zYXZlRWRpdHMoKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy5maWxsSW5Pbmx5VGV4dEZpZWxkKCdDb21taXQgbWVzc2FnZScpO1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmNsaWNrQnV0dG9uKCdTYXZlIENoYW5nZXMnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0VkaXRpbmcgdGhlIG1vZGVsJywgKCkgPT4ge1xuICAgIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgICBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gICAgICBwYWdlLmhlYWRlci50d2lnbGV0RWRpdFRhYi5zdGFydFR3aWdsZXRFZGl0UHJvY2VzcygpO1xuICAgICAgcGFnZS5oZWFkZXIudHdpZ2xldEVkaXRUYWIuc3RhcnRUd2lnbGV0TW9kZWxFZGl0UHJvY2VzcygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ29wZW5zIHRoZSBtb2RlbCBmb3JtJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBhZ2UudHdpZ2xldE1vZGVsLmlzT3BlbikudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FsbG93cyB0aGUgdXNlciB0byBhZGQgYW4gZW50aXR5JywgKCkgPT4ge1xuICAgICAgcGFnZS5tb2RlbEVkaXRGb3JtLmFkZEVudGl0eSgnenp6enonLCAnZG9sbGFyJywgJyMwMDg4MDAnKTtcbiAgICAgIGV4cGVjdChwYWdlLnR3aWdsZXRNb2RlbC5lbnRpdHlDb3VudCkudG9FcXVhbCg1KTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3MgdGhlIHVzZXIgdG8gcmVtb3ZlIGFuIGVudGl0eScsICgpID0+IHtcbiAgICAgIHBhZ2UubW9kZWxFZGl0Rm9ybS5jbGlja0J1dHRvbignZmEtdHJhc2gnKTtcbiAgICAgIGV4cGVjdChwYWdlLnR3aWdsZXRNb2RlbC5lbnRpdHlDb3VudCkudG9FcXVhbCg0KTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzIG5vdCBhbGxvdyB0aGUgdXNlciB0byByZW1vdmUgYW4gZW50aXR5IHRoYXQgaXMgaW4gdGhlIHR3aWdsZXQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QocGFnZS50d2lnbGV0TW9kZWwucmVtb3ZlQnV0dG9uQ291bnQpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FuIHNhdmUgdGhlIGVkaXRzJywgKCkgPT4ge1xuICAgICAgcGFnZS5oZWFkZXIudHdpZ2xldEVkaXRUYWIuc2F2ZUVkaXRzKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdEZWxldGluZyBUd2lnbGV0cycsICgpID0+IHtcbiAgICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgICAgcGFnZSA9IG5ldyBUd2lnUGFnZSgpO1xuICAgICAgcGFnZS5uYXZpZ2F0ZVRvKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FuIGJyaW5nIHVwIHRoZSBkZWxldGUgdHdpZ2xldCBtb2RhbCcsICgpID0+IHtcbiAgICAgIHBhZ2UuaGVhZGVyLnR3aWdsZXRUYWIuc3RhcnREZWxldGVUd2lnbGV0UHJvY2Vzcyh0d2lnbGV0TmFtZSk7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLm1vZGFsVGl0bGUpLnRvRXF1YWwoYERlbGV0ZSAke3R3aWdsZXROYW1lfWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2Rpc2FibGVzIHRoZSBcIkRlbGV0ZVwiIGJ1dHRvbiBpZiB0aGUgbmFtZSBkb2VzIG5vdCBtYXRjaCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYWdlLmZvcm1Gb3JNb2RhbHMuY2hlY2tJZkJ1dHRvbkVuYWJsZWQoJ0RlbGV0ZScpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdlbmFibGVzIHRoZSBidXR0b24gaWYgdGhlIGZvcm0gaXMgZmlsbGVkIG91dCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBwYWdlLmZvcm1Gb3JNb2RhbHMuZmlsbEluT25seVRleHRGaWVsZCh0d2lnbGV0TmFtZSk7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLmNoZWNrSWZCdXR0b25FbmFibGVkKCdEZWxldGUnKSkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSB0aGUgbW9kYWwgd2hlbiB0aGUgRGVsZXRlIGJ1dHRvbiBpcyBwcmVzc2VkJywgKCkgPT4ge1xuICAgICAgcGFnZS5mb3JtRm9yTW9kYWxzLmNsaWNrQnV0dG9uKCdEZWxldGUnKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy53YWl0Rm9yTW9kYWxUb0Nsb3NlKCk7XG4gICAgICBleHBlY3QocGFnZS5mb3JtRm9yTW9kYWxzLmlzTW9kYWxPcGVuKS50b0JlRmFsc3koKTtcbiAgICAgIHBhZ2UuZm9ybUZvck1vZGFscy53YWl0Rm9yTW9kYWxUb0Nsb3NlKCk7XG4gICAgICBicm93c2VyLndhaXRGb3JBbmd1bGFyKCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=