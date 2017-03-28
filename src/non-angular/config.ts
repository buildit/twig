export class Config {
  static get apiUrl() {
    if (window.location.hostname === 'localhost') {
      return `${window.location.protocol}//localhost:3000/v2`;
    }
    return `${window.location.protocol}//${window.location.hostname.replace('twig', 'twig-api')}/v2`;
  };
  static modelsFolder = 'models';
  static twigletsFolder = 'twiglets';
  static viewsFolder = 'models';
}
