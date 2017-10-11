import { browser, by, element } from 'protractor';

import { EnvironmentMenu } from './environmentMenu';
import { FiltersMenu } from './filtersMenu';
import { EventsMenu } from './eventsMenu';
import { GravityMenu } from './gravityMenu';

export class Accordion {
  environmentMenu: EnvironmentMenu;
  filtersMenu: FiltersMenu;
  eventsMenu: EventsMenu;
  gravityMenu: GravityMenu;

  constructor() {
    this.environmentMenu = new EnvironmentMenu(this);
    this.filtersMenu = new FiltersMenu(this);
    this.eventsMenu = new EventsMenu(this);
    this.gravityMenu = new GravityMenu(this);
  }

  get activeMenu() {
    const active = element(by.xpath(`//app-twiglet-mode-left-bar//div[@class="card-header active"]//a`));
    return active.isPresent().then(present => {
      if (present) {
        return active.getText();
      }
      return undefined;
    });
  }

  goToMenu(text: 'Environment' | 'Filter' | 'View' | 'Events' | 'Gravity') {
    const elementToClick =
      element(by.xpath(`//app-twiglet-mode-left-bar//div[contains(@class, "card-header")]//a[contains(., '${text}')]`));
    elementToClick.click();
  }
}
