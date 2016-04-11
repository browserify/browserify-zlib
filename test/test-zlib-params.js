/* eslint-env mocha */
'use strict'

var assert = require('assert')
var zlib = require('../')
var path = require('path')
var fs = require('fs')

var file = fs.readFileSync(path.join(__dirname, 'fixtures', 'person.jpg'))
var chunkSize = 12 * 1024
var opts = { level: 9, strategy: zlib.Z_DEFAULT_STRATEGY }
var deflater = zlib.createDeflate(opts)

var chunk1 = file.slice(0, chunkSize)
var chunk2 = file.slice(chunkSize)
var blkhdr = new Buffer([0x00, 0x5a, 0x82, 0xa5, 0x7d])
var expected = Buffer.concat([blkhdr, chunk2])
var actual

describe.skip('zlib - params', function () {
  it('works', function (done) {
    deflater.write(chunk1, function () {
      deflater.params(0, zlib.Z_DEFAULT_STRATEGY, function () {
        while (deflater.read()) {}
        deflater.end(chunk2, function () {
          var bufs = []
          var buf
          // eslint-disable-next-line
          while (buf = deflater.read()) {
            bufs.push(buf)
          }
          actual = Buffer.concat(bufs)
          assert.deepEqual(actual, expected)
          done()
        })
      })
      while (deflater.read()) {}
    })
  })
})
