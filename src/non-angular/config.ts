export class Config {
  static get apiUrl() {
    if (window.location.hostname === 'localhost') {
      return `${window.location.protocol}//localhost:3000/v2`;
    }
    let twigApiHostname = window.location.hostname.replace('twig', 'twig-api');
    twigApiHostname = window.location.hostname.replace('twig2', 'twig-api');
    return `${window.location.protocol}//${twigApiHostname}/v2`;
  };
  static modelsFolder = 'models';
  static twigletsFolder = 'twiglets';
  static viewsFolder = 'models';
}
