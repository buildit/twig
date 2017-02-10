import { Headers, RequestOptions } from '@angular/http';

export const jsonHeaders = new Headers({ 'Content-Type': 'application/json' });
export const authSetDataOptions = new RequestOptions({ headers: jsonHeaders, withCredentials: true });

/**
 * Handles server errors.
 *
 * @param {any} error
 */
export function handleError(error) {
  console.error(error);
  const message = error._body ? JSON.parse(error._body).message : error.statusText;
  this.toastr.error(message, 'Server Error');
}
