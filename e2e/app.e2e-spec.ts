import { TwigPage } from './app.po';

describe('twig App', function() {
  let page: TwigPage;

  beforeEach(() => {
    page = new TwigPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
