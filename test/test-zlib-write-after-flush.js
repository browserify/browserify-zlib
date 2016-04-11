/* eslint-env mocha */
'use strict'

var assert = require('assert')
var zlib = require('../')

describe('zlib - write after flush', function () {
  it('works', function (done) {
    var gzip = zlib.createGzip()
    var gunz = zlib.createUnzip()

    gzip.pipe(gunz)

    var output = ''
    var input = 'A line of data\n'
    gunz.setEncoding('utf8')
    gunz.on('data', function (c) {
      output += c
    })

    // make sure that flush/write doesn't trigger an assert failure
    gzip.flush()
    write()

    gunz.on('end', function () {
      assert.equal(output, input)

      // Make sure that the flush flag was set back to normal
      assert.equal(gzip._flushFlag, zlib.Z_NO_FLUSH)
      done()
    })

    function write () {
      gzip.write(input)
      gzip.end()
      gunz.read(0)
    }
  })
})
