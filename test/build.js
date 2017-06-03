'use strict'

const browserify = require('browserify')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

function wrap (content, files) {
  return `
  (function () {
    var fs = {}
    var require
    var emitOnexit // set in common.js

    var timeouts = {}
    var timeoutId = 0
    var setTimeout = function (fn, time) {
      if (time) throw new Error('time not supported in fake setTimeout')
      timeouts[++timeoutId] = fn
      return timeoutId
    }
    var clearTimeout = function (id) {
      delete timeouts[id]
    }
    function doTimeouts () {
      while (Object.keys(timeouts).length) {
        var id = Object.keys(timeouts)[0]
        timeouts[id]()
        delete timeouts[id]
      }
      emitOnexit()
    }

    ;${content}

    describe('zlib-browserify', function () {
      ${files.map(file => `
        it('${path.basename(file, '.js')}', function () {
          require(${JSON.stringify(path.normalize(file))})
          doTimeouts()
        })`
      ).join('')}
    })
  })();
  `
}

const browserified = path.join(__dirname, 'tmp/browserified.js')

glob(path.join(__dirname, 'test-*'), (err, files) => {
  if (err) throw err

  // workaround for old assert version in browserify
  require('browserify/lib/builtins').assert = require.resolve('assert/')

  const b = browserify({
    transform: ['babelify', 'brfs']
  })

  b.require(files)
  b.bundle((err, buf) => {
    if (err) throw err

    fs.writeFileSync(browserified, wrap(buf, files))
    console.log('bundled')
  })
})
