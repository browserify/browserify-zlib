/* eslint-env mocha */
'use strict'

var assert = require('assert')
var zlib = require('../')
var path = require('path')
var fs = require('fs')

describe.skip('zlib - flush', function () {
  it('works', function (done) {
    var file = fs.readFileSync(path.join(__dirname, 'fixtures', 'person.jpg'))
    var chunkSize = 16
    var opts = { level: 0 }
    var deflater = zlib.createDeflate(opts)

    var chunk = file.slice(0, chunkSize)
    var expectedNone = new Buffer([0x78, 0x01])
    var blkhdr = new Buffer([0x00, 0x10, 0x00, 0xef, 0xff])
    var adler32 = new Buffer([0x00, 0x00, 0x00, 0xff, 0xff])
    var expectedFull = Buffer.concat([blkhdr, chunk, adler32])
    var actualNone
    var actualFull

    deflater.write(chunk, function () {
      deflater.flush(zlib.Z_NO_FLUSH, function () {
        actualNone = deflater.read()
        deflater.flush(function () {
          var bufs = []
          var buf
          // eslint-disable-next-line
          while (buf = deflater.read()) {}
          bufs.push(buf)
          actualFull = Buffer.concat(bufs)
          assert.deepEqual(actualNone, expectedNone)
          assert.deepEqual(actualFull, expectedFull)

          done()
        })
      })
    })
  })
})
