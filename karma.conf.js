// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

/* eslint import/no-extraneous-dependencies: 0 */
const karmaJasmine = require('karma-jasmine');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
const karmaCoverageIstanbulReporter = require('karma-coverage-istanbul-reporter');
const karmaChromeLauncher = require('karma-chrome-launcher');
const angularCliKarmaPlugin = require('@angular/cli/plugins/karma');
const karmaSpecReporter = require('karma-spec-reporter');
const karmaJUnitReporter = require('karma-junit-reporter');

module.exports = function configs(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      karmaJasmine,
      karmaJasmineHtmlReporter,
      karmaCoverageIstanbulReporter,
      karmaChromeLauncher,
      angularCliKarmaPlugin,
      karmaSpecReporter,
      karmaJUnitReporter,
    ],
    browserNoActivityTimeout: 60000,
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false },
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli'],
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },
    specReporter: {
      maxLogLines: 1,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: true, // print the time elapsed for each spec
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'kjhtml', 'junit', 'coverage-istanbul']
              : ['progress', 'kjhtml', 'junit'],
    junitReporter: {
      outputDir: 'reports/unit/',
      suite: '',
      useBrowserName: false,
      nameFormatter: undefined,
      classNameFormatter: undefined,
      properties: {},
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
  });
};
