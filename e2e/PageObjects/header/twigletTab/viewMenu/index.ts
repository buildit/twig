import { browser, by, element, ElementFinder } from 'protractor';

const basePath = `app-view-dropdown`;
export class ViewMenu {
  private getParentOfViewGroup(viewName): ElementFinder {
    return element(
      by.xpath(`//${basePath}//li[contains(@class, 'view-list-item')]/span[text()="${viewName}"]/parent::*`));
  }

  get viewCount() {
    return browser.findElements(by.css(`${basePath} li.view-list-item`)).then(elements => elements.length);
  }

  openViewMenu() {
    return element(by.xpath(`//${basePath}//button[@id="viewDropdownMenu"]/span[1]`)).click();
  }

  startNewViewProcess() {
    this.openViewMenu();
    const newViewButton = element(by.xpath(`//app-breadcrumb-navigation//button[@ngbtooltip="Create New View"]`));
    newViewButton.click();
  }

  startViewViewProcess(viewName) {
    this.openViewMenu();
    const viewButton = element(by.xpath(
        `//${basePath}//li[contains(@class, 'view-list-item')]/span[text()="${viewName}"]`));
    return viewButton.click();
  }

  startEditViewProcess() {
    return element(by.xpath('//button[@ngbtooltip="Edit View"]')).click();
  }

  startSaveViewProcess(viewName) {
    const self = element(by.css('app-header-twiglet'));
    const button = self.element(by.cssContainingText('button', 'Save'));
    button.click();
  }

  startDeleteViewProcess(viewName) {
    this.openViewMenu();
    const parent = this.getParentOfViewGroup(viewName);
    return parent.element(by.css('i.fa-trash')).click();
  }
}
