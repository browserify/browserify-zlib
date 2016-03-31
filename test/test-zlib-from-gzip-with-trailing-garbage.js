/* eslint-env mocha */
'use strict'

// test unzipping a gzip file that has trailing garbage
const common = require('./common')
const assert = require('assert')
const zlib = require('../')

describe.skip('zlib - from gzip with trailing garbage', function () {
  it('should ignore trailing null-bytes', function (done) {
    let data = Buffer.concat([
      zlib.gzipSync('abc'),
      zlib.gzipSync('def'),
      Buffer(10).fill(0)
    ])

    assert.equal(zlib.gunzipSync(data).toString(), 'abcdef')

    zlib.gunzip(data, common.mustCall((err, result) => {
      assert.ifError(err)
      assert.equal(result, 'abcdef', 'result should match original string')
      done()
    }))
  })

  it('should throw on gzip header garbage', function (done) {
    var data = Buffer.concat([
      zlib.gzipSync('abc'),
      zlib.gzipSync('def'),
      Buffer([0x1f, 0x8b, 0xff, 0xff]),
      Buffer(10).fill(0)
    ])

    assert.throws(() => zlib.gunzipSync(data))

    zlib.gunzip(data, common.mustCall((err, result) => {
      assert(err)
      done()
    }))
  })

  it('should throw on junk that is too short', function (done) {
    var data = Buffer.concat([
      zlib.gzipSync('abc'),
      zlib.gzipSync('def'),
      Buffer([0x1f, 0x8b, 0xff, 0xff])
    ])

    assert.equal(zlib.gunzipSync(data).toString(), 'abcdef')

    zlib.gunzip(data, common.mustCall((err, result) => {
      assert.ifError(err)
      assert.equal(result, 'abcdef', 'result should match original string')
      done()
    }))
  })
})
