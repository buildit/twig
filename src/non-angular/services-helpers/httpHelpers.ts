import { Headers, RequestOptions } from '@angular/http';

export const jsonHeaders = new Headers({ 'Content-Type': 'application/json' });
export const authSetDataOptions = new RequestOptions({ headers: jsonHeaders, withCredentials: true });

/**
 * Handles server errors.
 *
 * @param {any} error
 */
export function handleError(error) {
  console.error('Error from', this);
  console.error(error);
  this.toastr.error(error.statusText, 'Server Error');
}
