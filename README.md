# Laravel Mix Subresource Integrity

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

A laravel mix extension to generate integrity hashes on build for your assets.

# WIP

Not usable, nor on npmjs. Still in WIP.

## Installation

```bash
$ npm install laravel-mix-sri
```

## Config

- `enabled`: boolean, default: `mix.Inproduction()`
- `algorithm`: string, default: `'sha256'`

## Usage

```js
let mix = require('laravel-mix')
require('laravel-mix-sri')

mix.sass('src/app.sass', 'dist')
   .js('src/app.js', 'dist')
   .generateIntegrityHash()
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for more details.

## License

This project and The Laravel framework are open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
