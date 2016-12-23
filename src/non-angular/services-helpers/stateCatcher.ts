/**
 * Only used for D3 related stuff. Don't touch this unless you are working with d3 directly.
 * This is how we "catch" the state of the nodes before they are published, that way D3 doesn't
 * update X and Y receive it's own publication and think it needs to recalculate everything.
 *
 * @export
 * @interface StateCatcher
 */
export interface StateCatcher {
  data: any;
}
