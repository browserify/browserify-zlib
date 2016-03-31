/* eslint-env mocha */
'use strict'

// test compression/decompression with dictionary
var assert = require('assert')
var zlib = require('../')

var spdyDict = new Buffer([
  'optionsgetheadpostputdeletetraceacceptaccept-charsetaccept-encodingaccept-',
  'languageauthorizationexpectfromhostif-modified-sinceif-matchif-none-matchi',
  'f-rangeif-unmodifiedsincemax-forwardsproxy-authorizationrangerefererteuser',
  '-agent10010120020120220320420520630030130230330430530630740040140240340440',
  '5406407408409410411412413414415416417500501502503504505accept-rangesageeta',
  'glocationproxy-authenticatepublicretry-afterservervarywarningwww-authentic',
  'ateallowcontent-basecontent-encodingcache-controlconnectiondatetrailertran',
  'sfer-encodingupgradeviawarningcontent-languagecontent-lengthcontent-locati',
  'oncontent-md5content-rangecontent-typeetagexpireslast-modifiedset-cookieMo',
  'ndayTuesdayWednesdayThursdayFridaySaturdaySundayJanFebMarAprMayJunJulAugSe',
  'pOctNovDecchunkedtext/htmlimage/pngimage/jpgimage/gifapplication/xmlapplic',
  'ation/xhtmltext/plainpublicmax-agecharset=iso-8859-1utf-8gzipdeflateHTTP/1',
  '.1statusversionurl\0'
].join(''))

var input = [
  'HTTP/1.1 200 Ok',
  'Server: node.js',
  'Content-Length: 0',
  ''
].join('\r\n')

describe('zlib - dictionary', function () {
  it('basic dictionary', function (done) {
    var output = ''
    var deflate = zlib.createDeflate({ dictionary: spdyDict })
    var inflate = zlib.createInflate({ dictionary: spdyDict })

    deflate.on('data', function (chunk) {
      inflate.write(chunk)
    })

    inflate.on('data', function (chunk) {
      output += chunk
    })

    deflate.on('end', function () {
      inflate.end()
    })

    inflate.on('end', function () {
      assert.equal(input, output)
      done()
    })

    deflate.write(input)
    deflate.end()
  })

  it('deflate reset dictionary', function (done) {
    var doneReset = false
    var output = ''
    var deflate = zlib.createDeflate({ dictionary: spdyDict })
    var inflate = zlib.createInflate({ dictionary: spdyDict })

    deflate.on('data', function (chunk) {
      if (doneReset) {
        inflate.write(chunk)
      }
    })

    inflate.on('data', function (chunk) {
      output += chunk
    })

    deflate.on('end', function () {
      inflate.end()
    })

    inflate.on('end', function () {
      assert.equal(input, output)
      done()
    })

    deflate.write(input)
    deflate.flush(function () {
      deflate.reset()
      doneReset = true
      deflate.write(input)
      deflate.end()
    })
  })
})
