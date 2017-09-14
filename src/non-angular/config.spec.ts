import { Config } from './config';
import actions from './actions';

describe('config', () => {
  const _window: { [key: string]: any } = { }

  beforeEach(() => {
    spyOn(actions, 'getWindow').and.returnValue(_window);
  });

  describe('apiUrl', () => {
    describe('localhost', () => {
      it('returns the http protocol', () => {
        _window.location = {
          hostname: 'localhost',
          protocol: 'http:',
        }
        expect(Config.apiUrl).toContain('http:');
      });

      it('returns the https protocol', () => {
        _window.location = {
          hostname: 'localhost',
          protocol: 'https:',
        }
        expect(Config.apiUrl).toContain('https:');
      });

      it('returns the correct local version of the db', () => {
        _window.location = {
          hostname: 'localhost',
          protocol: 'https:',
        }
        expect(Config.apiUrl).toContain('localhost:3000/v2');
      });
    });

    describe('other urls', () => {
      it('always has the https protocol', () => {
        _window.location = {
          hostname: 'twig.buildit.tools',
          protocol: 'http:',
        }
        expect(Config.apiUrl).toContain('https:');
      });

      it('returns the https protocol', () => {
        _window.location = {
          hostname: 'twig.buildit.tools',
          protocol: 'https:',
        }
        expect(Config.apiUrl).toContain('https:');
      });

      it('returns the correct api host', () => {
        _window.location = {
          hostname: 'twig.buildit.tools',
          protocol: 'https:',
        }
        expect(Config.apiUrl).toContain('twig-api.buildit.tools/v2');
      });
    });
  });
});
