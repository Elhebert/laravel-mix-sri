import collect from 'collect.js'
import webpack from 'webpack'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { cwd } from 'process'

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
        assets.mix = collect(assets.mix).except(['mix.js']).all()
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

          hashes[filePath] = crypto
            .createHash(this.algorithm)
            .update(
              fs.readFileSync(
                // @ts-ignore TS2304
                path.join(cwd(), Config.publicPath, 'mix-sri.json')
              )
            )
            .digest('base64')
        })

      fs.writeFileSync(
        // @ts-ignore TS2304
        path.join(cwd(), Config.publicPath, 'mix-sri.json'),
        JSON.stringify(hashes, null, 4)
      )
    }

    compiler.hooks.done.tapAsync('SriPlugin', process)
  }
}
