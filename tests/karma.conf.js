/* eslint-env node */

const webpackConfig = require('../webpack/webpack.test.config');

module.exports = function(config) {
  config.set({
    // browsers: ['PhantomJS'],
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha'],
    files: ['./**/*.spec.js'],
    webpack: webpackConfig,
    preprocessors: {
      './**/*.spec.*': ['webpack']
    },
    webpackMiddleware: {
      noInfo: true
    },
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222'
        ]
      }
    }
  });
};
