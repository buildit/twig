export function mockToastr() {
  return {
    error: jasmine.createSpy('error'),
    success: jasmine.createSpy('success'),
  };
}
