/* eslint-env mocha */
'use strict'

var assert = require('assert')
var zlib = require('../')

describe('zlib - zero byte', function () {
  it('works', function (done) {
    var gz = zlib.Gzip()
    var emptyBuffer = new Buffer(0)
    var received = 0
    gz.on('data', function (c) {
      received += c.length
    })

    var finished = false
    gz.on('end', function () {
      assert.equal(received, 20)
      assert(finished)
      done()
    })

    gz.on('finish', function () {
      finished = true
    })
    gz.write(emptyBuffer)
    gz.end()
  })
})
