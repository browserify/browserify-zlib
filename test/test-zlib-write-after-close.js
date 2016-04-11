/* eslint-env mocha */
'use strict'

var assert = require('assert')
var zlib = require('../')

describe('zlib - write after close', function () {
  it('works', function (done) {
    zlib.gzip('hello', function (err, out) {
      if (err) throw err
      var unzip = zlib.createGunzip()
      unzip.close(function () {
        done()
      })
      assert.throws(function () {
        unzip.write(out)
      })
    })
  })
})
