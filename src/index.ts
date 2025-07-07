import mix from 'laravel-mix'
import SriPlugin from './SriPlugin'
import webpack from 'webpack'
import { ClassComponent } from 'laravel-mix/types/component'

export type Options = {
  algorithm?: 'sha256' | 'sha384' | 'sha512'
  output?: string
  enabled?: boolean
  mergeWithExistingFile?: boolean
}

class IntegrityHash implements ClassComponent {
  private config: Options = {}

  name(): string {
    return 'generateIntegrityHash'
  }

  register(options: Options = {}): void {
    this.config = {
      algorithm: 'sha256',
      output: options.output,
      enabled: options.enabled || mix.inProduction(),
      mergeWithExistingFile: options.mergeWithExistingFile,
    }

    if (['sha256', 'sha384', 'sha512'].includes(options.algorithm)) {
      this.config.algorithm = options.algorithm
    }
  }

  webpackPlugins(): webpack.WebpackPluginInstance[] {
    if (this.config.enabled) {
      return [new SriPlugin(this.config.algorithm, this.config.output, this.config.mergeWithExistingFile)]
    }
  }
}

mix.extend('generateIntegrityHash', new IntegrityHash())
