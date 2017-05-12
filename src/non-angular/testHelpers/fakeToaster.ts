/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />

export function mockToastr() {
  return {
    error: jasmine.createSpy('error'),
    success: jasmine.createSpy('success'),
    warning: jasmine.createSpy('warning'),
  };
}
