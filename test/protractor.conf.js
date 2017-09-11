let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

require('protractor/built/logger').Logger.logLevel = 1;

exports.config = {
    specs: ['*.js'],
    capabilities: {
        browserName: 'chrome'
    },
    baseUrl: 'http://localhost:8080',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        silent: true,
        defaultTimeoutInterval: 360000,
        print: function () {
        }
    },
    onPrepare: function () {
        browser.ignoreSynchronization = true;
        jasmine.getEnv().addReporter(new SpecReporter());
    }
};