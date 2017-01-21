# browserify-zlib-next

> This is a fork of https://github.com/devongovett/browserify-zlib.
> There is an [open pull request](https://github.com/devongovett/browserify-zlib/pull/18) to get these changes merged back in.

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Travis CI](https://travis-ci.org/ipfs/browserify-zlib-next.svg?branch=master)](https://travis-ci.org/ipfs/browserify-zlib-next)
[![Dependency Status](https://david-dm.org/ipfs/browserify-zlib-next.svg?style=flat-square)](https://david-dm.org/ipfs/browserify-zlib-next) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

## Description

Emulates Node's [zlib](https://nodejs.org/api/zlib.html) module for the browser. Can be used as a drop in replacement with [Browserify](http://browserify.org) and [webpack](http://webpack.github.io/).

The heavy lifting is done using [pako](https://github.com/nodeca/pako). The code in this module is modeled closely after the code in the source of Node core to get as much compatability as possible.

## API

https://nodejs.org/api/zlib.html

## Not implemented

The following options/methods are not supported because pako does not support them yet.

* The `params` method

## License

MIT
