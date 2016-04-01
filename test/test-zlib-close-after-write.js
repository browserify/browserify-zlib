/* eslint-env mocha */
'use strict'

var zlib = require('../')

describe('zlib - close after write', function () {
  it('works', function (done) {
    zlib.gzip('hello', function (err, out) {
      if (err) throw err
      var unzip = zlib.createGunzip()
      unzip.write(out)
      unzip.close(function () {
        done()
      })
    })
  })
})
