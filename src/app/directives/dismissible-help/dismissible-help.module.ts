import {NgModule, ModuleWithProviders} from '@angular/core';

import { DismissibleHelpDirective } from './dismissible-help.directive';
import { DismissibleHelpDialogComponent } from '../../shared/dismissible-help-dialog/dismissible-help-dialog.component';

@NgModule({
  declarations: [ DismissibleHelpDirective ],
  entryComponents: [ DismissibleHelpDialogComponent ],
  exports: [ DismissibleHelpDirective ],
})
export class DismissibleHelpModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DismissibleHelpModule,
    };
  }
}
