'use strict';

var path = require('path');
var fs = require('fs');

var files = fs.readdirSync(path.resolve(__dirname));
console.log('Executing %s', files.length);

files
  .filter(function (file) {
    return file.match(/\.js$/) && file.match(/^test-/);
  })
  .forEach(function (file) {
  console.log('Test: %s', file);
  require('./' + file);
});
