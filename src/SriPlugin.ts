import File from 'laravel-mix/src/File'
import collect from 'collect.js'
import webpack from 'webpack'
import crypto from 'crypto'

export default class SriPlugin implements webpack.WebpackPluginInstance {
  constructor(private algorithm: 'sha256' | 'sha384' | 'sha512') {
    this.algorithm = algorithm
  }

  apply(compiler: webpack.Compiler): void {
    const process = (stats: webpack.Stats) => {
      let assets: Record<string, string[]> = stats.toJson().assetsByChunkName
      let hashes: Record<string, string> = {}

      // If there's a temporary mix.js chunk, we can safely remove it.
      if (assets.mix) {
        assets.mix = collect(assets.mix)
          .except(['mix.js'])
          .all()
      }

      collect<string>(assets)
        .flatten()
        // Don't add hot updates to manifest
        .filter((name: string) => name.indexOf('hot-update') === -1)
        .all()
        .forEach((filePath: string) => {
          if (!filePath.startsWith('/')) {
            filePath = `/${filePath}`
          }

          filePath = filePath.replace(/\?id=\w{20}/, '')

          const file: File = new File(filePath)
          hashes[filePath] = crypto
            .createHash(this.algorithm)
            .update(file.read())
            .digest('base64')
        })

      new File('mix-sri.json').write(hashes)
    }

    compiler.hooks.done.tapAsync('SriPlugin', process)
  }
}
