let mix = require('laravel-mix')
const SriPlugin = require('./SriPlugin')

class IntegrityHash {
  name() {
    return 'generateIntegrityHash'
  }

  register(options = {}) {
    this.config = {
      algorithm: 'sha256',
      enabled: options.enabled || mix.inProduction(),
    }

    if (['sha256', 'sha384', 'sha512'].includes(options.algorithm)) {
      this.config.algorithm = options.algorithm
    }
  }

  webpackPlugins() {
    if (this.config.enabled) {
      return new SriPlugin(this.config)
    }
  }
}

mix.extend('generateIntegrityHash', new IntegrityHash())
