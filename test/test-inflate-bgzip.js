'use strict';
// test unzipping a block-gzipped multi-member file that
// was created with `bgzip`
// piped in as fast as possible.

var common = require('./common');
var assert = require('assert');
var zlib = require('../');
var path = require('path');

common.refreshTmpDir();

var gunzip = zlib.createGunzip({ finishFlush: zlib.Z_SYNC_FLUSH });

var fs = require('fs');

var fixture = path.resolve(common.fixturesDir, 'bgzip-1.txt.gz');
var unzippedFixture = path.resolve(common.fixturesDir, 'bgzip-1.txt');
var outputFile = path.resolve(common.tmpDir, 'bgzip-1.txt');
var expect = fs.readFileSync(unzippedFixture);
var inp = fs.createReadStream(fixture);
var out = fs.createWriteStream(outputFile);

inp.pipe(gunzip).pipe(out);
out.on('close', function() {
  var actual = fs.readFileSync(outputFile);
  assert.equal(actual.length, expect.length, 'length should match');
  for (var i = 0, l = actual.length; i < l; i++) {
    assert.equal(actual[i], expect[i], 'byte[' + i + ']');
  }
});
