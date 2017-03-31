// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

/* global jasmine */
const { SpecReporter } = require('jasmine-spec-reporter');
const reporters = require('jasmine-reporters');

const junitReporter = new reporters.JUnitXmlReporter({
  savePath: 'reports/acceptance-test-results.xml',
  consolidateAll: false
});

exports.config = {
  allScriptsTimeout: 30000,
  specs: [
    'node_modules/jasmine-expect/index.js',
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e',
    });
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(junitReporter);
  },
};
