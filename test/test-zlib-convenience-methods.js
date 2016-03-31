/* eslint-env mocha */
'use strict'

// test convenience methods with and without options supplied
var assert = require('assert')
var zlib = require('../')

var hadRun = 0

var expect = 'blahblahblahblahblahblah'
var opts = {
  level: 9,
  chunkSize: 1024
}

describe('zlib - convenience methods', function () {
  [
    ['gzip', 'gunzip'],
    ['gzip', 'unzip'],
    ['deflate', 'inflate'],
    ['deflateRaw', 'inflateRaw']
  ].forEach(function (method) {
    it(method.join(':'), function (done) {
      var finish = function () {
        hadRun++
        if (hadRun === 4) {
          hadRun = 0
          done()
        }
      }

      zlib[method[0]](expect, opts, function (err, result) {
        if (err) throw err

        zlib[method[1]](result, opts, function (err, result) {
          if (err) throw err

          assert.equal(result, expect,
            'Should get original string after ' +
            method[0] + '/' + method[1] + ' with options.')
          finish()
        })
      })

      zlib[method[0]](expect, function (err, result) {
        if (err) throw err
        zlib[method[1]](result, function (err, result) {
          if (err) throw err
          assert.equal(result, expect,
            'Should get original string after ' +
            method[0] + '/' + method[1] + ' without options.')
          finish()
        })
      })

      var result = zlib[method[0] + 'Sync'](expect, opts)
      result = zlib[method[1] + 'Sync'](result, opts)
      assert.equal(result, expect,
        'Should get original string after ' +
        method[0] + '/' + method[1] + ' with options.')
      finish()

      result = zlib[method[0] + 'Sync'](expect)
      result = zlib[method[1] + 'Sync'](result)
      assert.equal(result, expect,
        'Should get original string after ' +
        method[0] + '/' + method[1] + ' without options.')
      finish()
    })
  })
})
