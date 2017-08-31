import { ToastOptions } from 'ng2-toastr';

export class CustomToastOption extends ToastOptions {
  maxShown = 1;
  positionClass = 'toast-bottom-right';
}
