import collect from 'collect.js'
import webpack from 'webpack'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { cwd } from 'process'

export default class SriPlugin implements webpack.WebpackPluginInstance {
  constructor(
    private algorithm: 'sha256' | 'sha384' | 'sha512',
    private output = 'mix-sri.json',
    private mergeWithExistingFile = false
  ) {}

  apply(compiler: webpack.Compiler): void {
    const process = (stats: webpack.Stats) => {
      let assets: webpack.StatsAsset[] = stats.toJson().assets
      let hashes: Record<string, string> = {}

      collect<webpack.StatsAsset>(assets)
        .filter(
          asset =>
            asset.type === 'asset' &&
            asset.auxiliaryChunks.length === 0 &&
            !asset.name.includes('hot-update')
        )
        .all()
        .forEach(({ name: filePath }) => {
          if (!filePath.startsWith('/')) {
            filePath = `/${filePath}`
          }

          filePath = filePath.replace(/\?id=\w{20}/, '')

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

      const outputPath = path.join(cwd(), Config.publicPath, this.output)
      if (this.mergeWithExistingFile && fs.existsSync(outputPath)) {
        const existingHashes = JSON.parse(fs.readFileSync(outputPath, 'utf8'))

        hashes = {
          ...existingHashes,
          ...hashes,
        }
      }

      fs.writeFileSync(
        outputPath,
        JSON.stringify(hashes, null, 4)
      )
    }

    compiler.hooks.done.tap('SriPlugin', process)
  }
}
