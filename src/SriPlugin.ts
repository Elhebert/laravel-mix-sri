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
      let assets: webpack.StatsAsset[] = stats.toJson().assets
      let hashes: Record<string, string> = {}

      collect<webpack.StatsAsset>(assets)
        .filter(
          asset => asset.type === 'asset' && !asset.name.includes('hot-update')
        )
        .all()
        .forEach(({ name: filePath }) => {
          if (!filePath.startsWith('/')) {
            filePath = `/${filePath}`
          }

          filePath = filePath.replace(/\?id=\w{20}/, '')
          filePath = filePath.replace(/\?(\w{32}|id=\w{20})/, '')

          hashes[filePath] =
            this.algorithm +
            '-' +
            crypto
              .createHash(this.algorithm)
              .update(
                fs.readFileSync(
                  // @ts-ignore TS2304
                  path.join(cwd(), Config.publicPath, filePath)
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
