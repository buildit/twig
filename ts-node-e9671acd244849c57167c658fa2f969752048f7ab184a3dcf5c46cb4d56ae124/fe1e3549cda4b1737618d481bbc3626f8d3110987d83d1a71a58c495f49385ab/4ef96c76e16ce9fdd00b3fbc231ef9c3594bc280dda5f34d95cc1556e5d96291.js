"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var tabPath = "//app-twiglet-events";
var EventsMenu = (function () {
    function EventsMenu(accordion) {
        this.accordion = accordion;
    }
    Object.defineProperty(EventsMenu.prototype, "sequenceCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.css('li.sequence-list-item')).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventsMenu.prototype, "eventCount", {
        get: function () {
            return protractor_1.browser.findElements(protractor_1.by.css('li.event-list-item')).then(function (elements) { return elements.length; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the parent div of a label, used to quickly navigate around .form-groups
     *
     * @private
     * @param {any} labelText the text of the label
     * @returns {ElementFinder}
     *
     * @memberOf EventsMenu
     */
    EventsMenu.prototype.getParentOfSequenceGroup = function (sequenceName) {
        return protractor_1.element(protractor_1.by.xpath("//app-sequence-list//li[contains(@class, 'sequence-list-item')]/span[text()=\"" + sequenceName + "\"]/parent::*"));
    };
    EventsMenu.prototype.getParentOfEventGroup = function (eventName) {
        return protractor_1.element(protractor_1.by.xpath("//app-events-list//li[contains(@class, 'event-list-item')]/label[text()=\"" + eventName + "\"]/parent::*"));
    };
    EventsMenu.prototype.startNewEventProcess = function () {
        this.switchToCorrectMenuIfNeeded();
        var newEventButton = protractor_1.element(protractor_1.by.xpath("//app-twiglet-events//i[@class=\"fa fa-plus event\"]/parent::*"));
        protractor_1.browser.actions()
            .mouseMove(newEventButton, { x: 5, y: 5 })
            .click()
            .perform();
    };
    EventsMenu.prototype.startDeleteEventProcess = function (eventName) {
        this.switchToCorrectMenuIfNeeded();
        var parent = this.getParentOfEventGroup(eventName);
        parent.element(protractor_1.by.css('i.fa-trash')).click();
    };
    EventsMenu.prototype.previewEvent = function (eventName) {
        var parent = this.getParentOfEventGroup(eventName);
        parent.element(protractor_1.by.css('i.fa-eye')).click();
    };
    EventsMenu.prototype.toggleEventCheck = function (eventName) {
        var parent = this.getParentOfEventGroup(eventName);
        parent.element(protractor_1.by.tagName('label')).click();
    };
    EventsMenu.prototype.checkedEvent = function (eventName) {
        var parent = this.getParentOfEventGroup(eventName);
        return parent.element(protractor_1.by.css('input.checkbox-toggle')).isSelected();
    };
    EventsMenu.prototype.checkIfDeleteEnabled = function (eventName) {
        var parent = this.getParentOfEventGroup(eventName);
        return parent.element(protractor_1.by.css('i.fa-trash.grey'));
    };
    EventsMenu.prototype.startNewSequenceProcess = function () {
        this.switchToCorrectMenuIfNeeded();
        var newSequenceButton = protractor_1.element(protractor_1.by.xpath("//app-twiglet-events//i[@class=\"fa fa-plus sequence\"]/parent::*"));
        protractor_1.browser.actions()
            .mouseMove(newSequenceButton, { x: 5, y: 5 })
            .click()
            .perform();
    };
    EventsMenu.prototype.startDeleteSequenceProcess = function (sequenceName) {
        this.switchToCorrectMenuIfNeeded();
        var parent = this.getParentOfSequenceGroup(sequenceName);
        parent.element(protractor_1.by.css('i.fa-trash')).click();
    };
    EventsMenu.prototype.startSaveSequenceProcess = function (sequenceName) {
        this.switchToCorrectMenuIfNeeded();
        var parent = this.getParentOfSequenceGroup(sequenceName);
        parent.element(protractor_1.by.css('i.fa-floppy-o')).click();
    };
    EventsMenu.prototype.startViewSequenceProcess = function (sequenceName) {
        var sequenceButton = protractor_1.element(protractor_1.by.xpath("//app-sequence-list//li//span[text()='" + sequenceName + "']"));
        sequenceButton.click();
    };
    EventsMenu.prototype.startSequencePlay = function () {
        this.switchToCorrectMenuIfNeeded();
        protractor_1.element(protractor_1.by.css('i.fa-play')).click();
    };
    EventsMenu.prototype.stopSequencePlay = function () {
        protractor_1.element(protractor_1.by.css('i.fa-stop')).click();
    };
    EventsMenu.prototype.waitForPlayback = function () {
        var playButton = protractor_1.element(protractor_1.by.css('i.fa-play'));
        var EC = protractor_1.ExpectedConditions;
        protractor_1.browser.wait(EC.visibilityOf(playButton), 10000);
    };
    EventsMenu.prototype.editPlaybackInterval = function (number) {
        protractor_1.element(protractor_1.by.css('.form-control')).clear();
        protractor_1.element(protractor_1.by.css('.form-control')).sendKeys(number);
    };
    EventsMenu.prototype.switchToCorrectMenuIfNeeded = function () {
        var _this = this;
        return this.accordion.activeMenu.then(function (activeTabText) {
            if (activeTabText !== 'Events') {
                return _this.accordion.goToMenu('Events');
            }
        });
    };
    return EventsMenu;
}());
exports.EventsMenu = EventsMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3R3aWcvZTJlL1BhZ2VPYmplY3RzL2FjY29yZGlvbi9ldmVudHNNZW51L2luZGV4LnRzIiwic291cmNlcyI6WyIvdHdpZy9lMmUvUGFnZU9iamVjdHMvYWNjb3JkaW9uL2V2ZW50c01lbnUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBcUY7QUFJckYsSUFBTSxPQUFPLEdBQUcsc0JBQXNCLENBQUM7QUFDdkM7SUFHRSxvQkFBWSxTQUFTO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxzQkFBSSxxQ0FBYTthQUFqQjtZQUNFLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLFlBQVksQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsTUFBTSxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQ2pHLENBQUM7OztPQUFBO0lBRUQsc0JBQUksa0NBQVU7YUFBZDtZQUNFLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLFlBQVksQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsTUFBTSxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQzlGLENBQUM7OztPQUFBO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSyw2Q0FBd0IsR0FBaEMsVUFBaUMsWUFBWTtRQUMzQyxNQUFNLENBQUMsb0JBQU8sQ0FDWixlQUFFLENBQUMsS0FBSyxDQUFDLG1GQUFnRixZQUFZLGtCQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzFILENBQUM7SUFFTywwQ0FBcUIsR0FBN0IsVUFBOEIsU0FBUztRQUNyQyxNQUFNLENBQUMsb0JBQU8sQ0FDWixlQUFFLENBQUMsS0FBSyxDQUFDLCtFQUE0RSxTQUFTLGtCQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ25ILENB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LGdEQUEyQixHQUFuQztRQUFBLGlCQU1DO1FBTEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFBLGFBQWE7WUFDakQsRUFBRSxDQUFDLENBQUMsYUFBYSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBMUhELElBMEhDO0FBMUhZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciwgYnksIGVsZW1lbnQsIEVsZW1lbnRGaW5kZXIsIEV4cGVjdGVkQ29uZGl0aW9ucyB9IGZyb20gJ3Byb3RyYWN0b3InO1xuXG5pbXBvcnQgeyBBY2NvcmRpb24gfSBmcm9tICcuLy4uLyc7XG5cbmNvbnN0IHRhYlBhdGggPSBgLy9hcHAtdHdpZ2xldC1ldmVudHNgO1xuZXhwb3J0IGNsYXNzIEV2ZW50c01lbnUge1xuICBwcml2YXRlIGFjY29yZGlvbjogQWNjb3JkaW9uO1xuXG4gIGNvbnN0cnVjdG9yKGFjY29yZGlvbikge1xuICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuICB9XG5cbiAgZ2V0IHNlcXVlbmNlQ291bnQoKSB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZmluZEVsZW1lbnRzKGJ5LmNzcygnbGkuc2VxdWVuY2UtbGlzdC1pdGVtJykpLnRoZW4oZWxlbWVudHMgPT4gZWxlbWVudHMubGVuZ3RoKTtcbiAgfVxuXG4gIGdldCBldmVudENvdW50KCkge1xuICAgIHJldHVybiBicm93c2VyLmZpbmRFbGVtZW50cyhieS5jc3MoJ2xpLmV2ZW50LWxpc3QtaXRlbScpKS50aGVuKGVsZW1lbnRzID0+IGVsZW1lbnRzLmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcGFyZW50IGRpdiBvZiBhIGxhYmVsLCB1c2VkIHRvIHF1aWNrbHkgbmF2aWdhdGUgYXJvdW5kIC5mb3JtLWdyb3Vwc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2FueX0gbGFiZWxUZXh0IHRoZSB0ZXh0IG9mIHRoZSBsYWJlbFxuICAgKiBAcmV0dXJucyB7RWxlbWVudEZpbmRlcn1cbiAgICpcbiAgICogQG1lbWJlck9mIEV2ZW50c01lbnVcbiAgICovXG4gIHByaXZhdGUgZ2V0UGFyZW50T2ZTZXF1ZW5jZUdyb3VwKHNlcXVlbmNlTmFtZSk6IEVsZW1lbnRGaW5kZXIge1xuICAgIHJldHVybiBlbGVtZW50KFxuICAgICAgYnkueHBhdGgoYC8vYXBwLXNlcXVlbmNlLWxpc3QvL2xpW2NvbnRhaW5zKEBjbGFzcywgJ3NlcXVlbmNlLWxpc3QtaXRlbScpXS9zcGFuW3RleHQoKT1cIiR7c2VxdWVuY2VOYW1lfVwiXS9wYXJlbnQ6OipgKSk7XG4gIH1cblxuICBwcml2YXRlIGdldFBhcmVudE9mRXZlbnRHcm91cChldmVudE5hbWUpOiBFbGVtZW50RmluZGVyIHtcbiAgICByZXR1cm4gZWxlbWVudChcbiAgICAgIGJ5LnhwYXRoKGAvL2FwcC1ldmVudHMtbGlzdC8vbGlbY29udGFpbnMoQGNsYXNzLCAnZXZlbnQtbGlzdC1pdGVtJyldL2xhYmVsW3RleHQoKT1cIiR7ZXZlbnROYW1lfVwiXS9wYXJlbnQ6OipgKSk7XG4gIH1cblxuICBzdGFydE5ld0V2ZW50UHJvY2VzcygpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdE1lbnVJZk5lZWRlZCgpO1xuICAgIGNvbnN0IG5ld0V2ZW50QnV0dG9uID0gZWxlbWVudChieS54cGF0aChgLy9hcHAtdHdpZ2xldC1ldmVudHMvL2lbQGNsYXNzPVwiZmEgZmEtcGx1cyBldmVudFwiXS9wYXJlbnQ6OipgKSk7XG4gICAgYnJvd3Nlci5hY3Rpb25zKClcbiAgICAgIC5tb3VzZU1vdmUobmV3RXZlbnRCdXR0b24sIHsgeDogNSwgeTogNSB9KVxuICAgICAgLmNsaWNrKClcbiAgICAgIC5wZXJmb3JtKCk7XG4gIH1cblxuICBzdGFydERlbGV0ZUV2ZW50UHJvY2VzcyhldmVudE5hbWUpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdE1lbnVJZk5lZWRlZCgpO1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZFdmVudEdyb3VwKGV2ZW50TmFtZSk7XG4gICAgcGFyZW50LmVsZW1lbnQoYnkuY3NzKCdpLmZhLXRyYXNoJykpLmNsaWNrKCk7XG4gIH1cblxuICBwcmV2aWV3RXZlbnQoZXZlbnROYW1lKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZkV2ZW50R3JvdXAoZXZlbnROYW1lKTtcbiAgICBwYXJlbnQuZWxlbWVudChieS5jc3MoJ2kuZmEtZXllJykpLmNsaWNrKCk7XG4gIH1cblxuICB0b2dnbGVFdmVudENoZWNrKGV2ZW50TmFtZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZFdmVudEdyb3VwKGV2ZW50TmFtZSk7XG4gICAgcGFyZW50LmVsZW1lbnQoYnkudGFnTmFtZSgnbGFiZWwnKSkuY2xpY2soKTtcbiAgfVxuXG4gIGNoZWNrZWRFdmVudChldmVudE5hbWUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudE9mRXZlbnRHcm91cChldmVudE5hbWUpO1xuICAgIHJldHVybiBwYXJlbnQuZWxlbWVudChieS5jc3MoJ2lucHV0LmNoZWNrYm94LXRvZ2dsZScpKS5pc1NlbGVjdGVkKCk7XG4gIH1cblxuICBjaGVja0lmRGVsZXRlRW5hYmxlZChldmVudE5hbWUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudE9mRXZlbnRHcm91cChldmVudE5hbWUpO1xuICAgIHJldHVybiBwYXJlbnQuZWxlbWVudChieS5jc3MoJ2kuZmEtdHJhc2guZ3JleScpKTtcbiAgfVxuXG4gIHN0YXJ0TmV3U2VxdWVuY2VQcm9jZXNzKCkge1xuICAgIHRoaXMuc3dpdGNoVG9Db3JyZWN0TWVudUlmTmVlZGVkKCk7XG4gICAgY29uc3QgbmV3U2VxdWVuY2VCdXR0b24gPSBlbGVtZW50KGJ5LnhwYXRoKGAvL2FwcC10d2lnbGV0LWV2ZW50cy8vaVtAY2xhc3M9XCJmYSBmYS1wbHVzIHNlcXVlbmNlXCJdL3BhcmVudDo6KmApKTtcbiAgICBicm93c2VyLmFjdGlvbnMoKVxuICAgICAgLm1vdXNlTW92ZShuZXdTZXF1ZW5jZUJ1dHRvbiwgeyB4OiA1LCB5OiA1IH0pXG4gICAgICAuY2xpY2soKVxuICAgICAgLnBlcmZvcm0oKTtcbiAgfVxuXG4gIHN0YXJ0RGVsZXRlU2VxdWVuY2VQcm9jZXNzKHNlcXVlbmNlTmFtZSkge1xuICAgIHRoaXMuc3dpdGNoVG9Db3JyZWN0TWVudUlmTmVlZGVkKCk7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRPZlNlcXVlbmNlR3JvdXAoc2VxdWVuY2VOYW1lKTtcbiAgICBwYXJlbnQuZWxlbWVudChieS5jc3MoJ2kuZmEtdHJhc2gnKSkuY2xpY2soKTtcbiAgfVxuXG4gIHN0YXJ0U2F2ZVNlcXVlbmNlUHJvY2VzcyhzZXF1ZW5jZU5hbWUpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdE1lbnVJZk5lZWRlZCgpO1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50T2ZTZXF1ZW5jZUdyb3VwKHNlcXVlbmNlTmFtZSk7XG4gICAgcGFyZW50LmVsZW1lbnQoYnkuY3NzKCdpLmZhLWZsb3BweS1vJykpLmNsaWNrKCk7XG4gIH1cblxuICBzdGFydFZpZXdTZXF1ZW5jZVByb2Nlc3Moc2VxdWVuY2VOYW1lKSB7XG4gICAgY29uc3Qgc2VxdWVuY2VCdXR0b24gPSBlbGVtZW50KGJ5LnhwYXRoKGAvL2FwcC1zZXF1ZW5jZS1saXN0Ly9saS8vc3Bhblt0ZXh0KCk9JyR7c2VxdWVuY2VOYW1lfSddYCkpO1xuICAgIHNlcXVlbmNlQnV0dG9uLmNsaWNrKCk7XG4gIH1cblxuICBzdGFydFNlcXVlbmNlUGxheSgpIHtcbiAgICB0aGlzLnN3aXRjaFRvQ29ycmVjdE1lbnVJZk5lZWRlZCgpO1xuICAgIGVsZW1lbnQoYnkuY3NzKCdpLmZhLXBsYXknKSkuY2xpY2soKTtcbiAgfVxuXG4gIHN0b3BTZXF1ZW5jZVBsYXkoKSB7XG4gICAgZWxlbWVudChieS5jc3MoJ2kuZmEtc3RvcCcpKS5jbGljaygpO1xuICB9XG5cbiAgd2FpdEZvclBsYXliYWNrKCkge1xuICAgIGNvbnN0IHBsYXlCdXR0b24gPSBlbGVtZW50KGJ5LmNzcygnaS5mYS1wbGF5JykpO1xuICAgIGNvbnN0IEVDID0gRXhwZWN0ZWRDb25kaXRpb25zO1xuICAgIGJyb3dzZXIud2FpdChFQy52aXNpYmlsaXR5T2YocGxheUJ1dHRvbiksIDEwMDAwKTtcbiAgfVxuXG4gIGVkaXRQbGF5YmFja0ludGVydmFsKG51bWJlcikge1xuICAgIGVsZW1lbnQoYnkuY3NzKCcuZm9ybS1jb250cm9sJykpLmNsZWFyKCk7XG4gICAgZWxlbWVudChieS5jc3MoJy5mb3JtLWNvbnRyb2wnKSkuc2VuZEtleXMobnVtYmVyKTtcbiAgfVxuXG4gIHByaXZhdGUgc3dpdGNoVG9Db3JyZWN0TWVudUlmTmVlZGVkKCkge1xuICAgIHJldHVybiB0aGlzLmFjY29yZGlvbi5hY3RpdmVNZW51LnRoZW4oYWN0aXZlVGFiVGV4dCA9PiB7XG4gICAgICBpZiAoYWN0aXZlVGFiVGV4dCAhPT0gJ0V2ZW50cycpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjb3JkaW9uLmdvVG9NZW51KCdFdmVudHMnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19