import mix from 'laravel-mix'
import SriPlugin from './SriPlugin'
import webpack from 'webpack'

type Options = {
  algorithm?: 'sha256' | 'sha384' | 'sha512'
  enabled?: boolean
}

class IntegrityHash {
  private config: Options = {}

  name(): string {
    return 'generateIntegrityHash'
  }

  register(options: Options = {}): void {
    this.config = {
      algorithm: 'sha256',
      enabled: options.enabled || mix.inProduction(),
    }

    if (['sha256', 'sha384', 'sha512'].includes(options.algorithm)) {
      this.config.algorithm = options.algorithm
    }
  }

  webpackPlugins(): webpack.WebpackPluginInstance[] {
    if (this.config.enabled) {
      return [new SriPlugin(this.config.algorithm)]
    }
  }
}

mix.extend('generateIntegrityHash', new IntegrityHash())
