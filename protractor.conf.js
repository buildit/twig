// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
/* eslint import/no-extraneous-dependencies: 0 */

/* global jasmine */
const { SpecReporter } = require('jasmine-spec-reporter');
const reporters = require('jasmine-reporters');
const tsNode = require('ts-node');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

const screenShotReporter = new HtmlScreenshotReporter({
  dest: './screenshots',
  captureOnlyFailedSpecs: true,
});

const junitReporter = new reporters.JUnitXmlReporter({
  savePath: 'reports/acceptance-test-results.xml',
  consolidateAll: false,
});

exports.config = {
  allScriptsTimeout: 120000,
  specs: [
    'node_modules/jasmine-expect/index.js',
    './e2e/**/*.e2e-spec.ts',
  ],
  capabilities: {
    browserName: 'chrome',
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print() {},
  },
  beforeLaunch() {
    tsNode.register({
      project: 'e2e',
    });
    return new Promise((resolve) => {
      screenShotReporter.beforeLaunch(resolve);
    });
  },
  onPrepare() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(junitReporter);
    jasmine.getEnv().addReporter(screenShotReporter);
  },
  afterLaunch(exitCode) {
    return new Promise((resolve) => {
      screenShotReporter.afterLaunch(resolve.bind(this, exitCode));
    });
  },
};
