module.exports = function (karma) {
  karma.set({
    frameworks: ['browserify', 'mocha'],
    files: ['test/**/test-*.js'],
    preprocessors: {
      'test/**/test-*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: ['brfs']
    },
    browsers: process.env.TRAVIS ? ['Firefox', 'PhantomJS'] : ['Chrome'/*, 'PhantomJS'*/]
  })
}
