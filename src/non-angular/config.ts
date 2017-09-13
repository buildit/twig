export class Config {
  static get apiUrl() {
    if (window.location.hostname === 'localhost') {
      return `${window.location.protocol}//localhost:3000/v2`;
    } else if (window.location.hostname.includes('twig-ui-redesign-user-testing')) {
      return `https://staging-twig-api.buildit.tools/v2`;
    } else if (window.location.hostname.includes('aochsner')) {
      return `https://twig-api.buildit.tools/v2`;
    }
    let twigApiHostname = window.location.hostname.replace('twig', 'twig-api');
    twigApiHostname = twigApiHostname.replace('twig2', 'twig-api');
    return `https://${twigApiHostname}/v2`;
  };
  static modelsFolder = 'models';
  static twigletsFolder = 'twiglets';
  static viewsFolder = 'models';
}
