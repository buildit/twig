import actions from './actions';

export class Config {
  static get apiUrl() {
    if (actions.getWindow().location.hostname === 'localhost') {
      return `${actions.getWindow().location.protocol}//localhost:3000/v2`;
    }
    let twigApiHostname = actions.getWindow().location.hostname.replace('twig', 'twig-api');
    twigApiHostname = twigApiHostname.replace('twig2', 'twig-api');
    return `https://${twigApiHostname}/v2`;
  };
  static modelsFolder = 'models';
  static twigletsFolder = 'twiglets';
  static viewsFolder = 'models';
}
