'use strict'
/* global emitOnexit:true */ // eslint-disable-line no-unused-vars

var path = require('path')
var fs = require('fs')
var stream = require('stream')
var EventEmitter = require('events')

exports.fixturesDir = path.join(__dirname, 'fixtures')

var mustCallChecks = []

if (process.on === process.emit) {
  let emitter
  const reset = () => {
    mustCallChecks = []
    emitter = new EventEmitter()
    process.on = emitter.on.bind(emitter)
    process.once = emitter.once.bind(emitter)
  }
  emitOnexit = () => {
    emitter.emit('exit')
    reset()
  }
  reset()
}

function runCallChecks (exitCode) {
  if (exitCode !== 0) return

  var failed = mustCallChecks.filter(function (context) {
    return context.actual !== context.expected
  })

  failed.forEach(function (context) {
    console.log('Mismatched %s function calls. Expected %d, actual %d.',
      context.name,
      context.expected,
      context.actual)
    console.log(context.stack.split('\n').slice(2).join('\n'))
  })

  if (failed.length) process.exit(1)
}

exports.mustCall = function (fn, expected) {
  if (typeof expected !== 'number') expected = 1

  var context = {
    expected: expected,
    actual: 0,
    stack: (new Error()).stack,
    name: fn.name || '<anonymous>'
  }

  // add the exit listener only once to avoid listener leak warnings
  if (mustCallChecks.length === 0) process.on('exit', runCallChecks)

  mustCallChecks.push(context)

  return function () {
    context.actual++
    return fn.apply(this, arguments)
  }
}

var testRoot = path.resolve(path.dirname(__filename))
exports.tmpDirName = 'tmp'
exports.tmpDir = path.join(testRoot, exports.tmpDirName)

function rmdirSync (p, originalEr) {
  try {
    fs.rmdirSync(p)
  } catch (e) {
    if (e.code === 'ENOTDIR') {
      throw originalEr
    }
    if (e.code === 'ENOTEMPTY' || e.code === 'EEXIST' || e.code === 'EPERM') {
      fs.readdirSync(p).forEach(function (f) {
        rimrafSync(path.join(p, f))
      })
      fs.rmdirSync(p)
    }
  }
}

function rimrafSync (p) {
  try {
    var st = fs.lstatSync(p)
  } catch (e) {
    if (e.code === 'ENOENT') {
      return
    }
  }

  try {
    if (st && st.isDirectory()) {
      rmdirSync(p, null)
    } else {
      fs.unlinkSync(p)
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      return
    }
    if (e.code === 'EPERM') {
      return rmdirSync(p, e)
    }
    if (e.code !== 'EISDIR') {
      throw e
    }
    rmdirSync(p, e)
  }
}

exports.refreshTmpDir = function () {
  rimrafSync(exports.tmpDir)
  fs.mkdirSync(exports.tmpDir)
}

const rFS = 'readFileSync' // this stops the brfs static analyzer
if (!fs[rFS]) {
  // this is to make it work with brfs
  const files = {
    'elipses.txt': fs.readFileSync(path.resolve('test/fixtures', 'elipses.txt')),
    // there is a strange issue like https://github.com/nodejs/node-v0.x-archive/issues/7914,
    // even though that should be fixed.
    'empty.txt': Buffer.alloc(0),
    // 'empty.txt': fs.readFileSync(path.resolve('test/fixtures', 'empty.txt')),
    'person.jpg': fs.readFileSync(path.resolve('test/fixtures', 'person.jpg')),
    'person.jpg.gz': fs.readFileSync(path.resolve('test/fixtures', 'person.jpg.gz')),
    'pseudo-multimember-gzip.gz': fs.readFileSync(path.resolve('test/fixtures', 'pseudo-multimember-gzip.gz')),
    'pseudo-multimember-gzip.z': fs.readFileSync(path.resolve('test/fixtures', 'pseudo-multimember-gzip.z'))
  }
  Object.keys(files).forEach(file => {
    files[path.resolve(exports.fixturesDir, file)] = files[file]
  })

  fs[rFS] = name => {
    if (!files[name]) throw new Error(`file "${name}" not found`)
    return files[name]
  }

  const cRS = 'createReadStream'
  fs[cRS] = name => {
    const s = new stream.Readable()
    s.push(fs.readFileSync(name))
    s.push(null)
    return s
  }

  fs.createWriteStream = name => {
    const s = new stream.Writable()
    const chunks = []
    s._write = (chunk, encoding, callback) => {
      chunks.push(chunk)
      callback()
    }
    s.on('finish', () => {
      files[name] = Buffer.concat(chunks)
    })
    return s
  }

  exports.refreshTmpDir = () => {}
}
