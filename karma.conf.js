// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const util = require('util');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'angular-cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('angular-cli/plugins/karma'),
      require('karma-spec-reporter'),
    ],
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': ['angular-cli'],
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov',
        json: './coverage/coverage-mapped.json'
      }
    },
    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },
    specReporter: {
        maxLogLines: 1,         // limit number of lines logged per test
        suppressErrorSummary: true,  // do not print error summary
        suppressFailed: false,  // do not print information about failed tests
        suppressPassed: false,  // do not print information about passed tests
        suppressSkipped: false,  // do not print information about skipped tests
        showSpecTiming: true // print the time elapsed for each spec
      },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['spec', 'karma-remap-istanbul']
              : ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
