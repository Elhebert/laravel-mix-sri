# Laravel Mix Subresource Integrity

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

A laravel mix 6.0 extension to generate integrity hashes on build for your assets.

For older version of mix, see [v0.0.7](https://github.com/Elhebert/laravel-mix-sri/tree/0.0.7)

## Installation

```bash
$ npm install laravel-mix-sri
```

## Config

You can pass an object to the function. Available keys are:
- `enabled`: boolean, default: `mix.Inproduction()`
- `algorithm`: string, default: `'sha256'`
- `output`: string, default: `'mix-sri.json'`

## Usage

```js
let mix = require('laravel-mix')
require('laravel-mix-sri')

mix.sass('src/app.sass', 'dist')
   .js('src/app.js', 'dist')
   .generateIntegrityHash()
```

At every build it'll generate (or update the content of) the `output` file. The file is located within the `public` directory with the `mix-manifest.json`.

You can use [laravel-sri](https://github.com/Elhebert/laravel-sri) package to parse the `output` file and generate according attributes for your assets.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for more details.

## License

This project and The Laravel framework are open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
