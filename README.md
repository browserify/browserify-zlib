# browserify-zlib

Emulates Node's [zlib](http://nodejs.org/api/zlib.html) module for [Browserify](http://browserify.org)
using [pako](https://github.com/nodeca/pako). It uses the actual Node source code and passes the Node zlib tests
by emulating the C++ binding that actually calls zlib.

## License

MIT
