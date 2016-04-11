/* eslint-env mocha */
'use strict'

var assert = require('assert')
var zlib = require('../')

var bigData = new Buffer(10240).fill('x')

var opts = {
  level: 0,
  highWaterMark: 16
}

var deflater = zlib.createDeflate(opts)

// shim deflater.flush so we can count times executed
var flushCount = 0
var drainCount = 0

describe('zlib - flush drain', function () {
  it('works', function (done) {
    var flush = deflater.flush
    deflater.flush = function (kind, callback) {
      flushCount++
      flush.call(this, kind, callback)
    }

    deflater.write(bigData)

    var ws = deflater._writableState
    var beforeFlush = ws.needDrain
    var afterFlush = ws.needDrain

    deflater.flush(function (err) {
      if (err) throw err
      afterFlush = ws.needDrain

      assert.equal(afterFlush, false,
                   'after calling flush the writable stream should not need to drain')
      assert.equal(drainCount, 1,
                   'the deflater should have emitted a single drain event')
      assert.equal(flushCount, 2,
                   'flush should be called twice')

      done()
    })

    deflater.on('drain', function () {
      drainCount++
    })

    assert.equal(beforeFlush, true,
                 'before calling flush the writable stream should need to drain')
  })
})
