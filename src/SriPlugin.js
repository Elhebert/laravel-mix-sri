const path = require("path");

class SriPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.done.tap('done', stats => this.writeManifest(stats))
    } else {
      compiler.plugin('done', stats => this.writeManifest(stats))
    }
  }

  writeManifest(stats) {
    let assets = Object.assign({}, stats.toJson().assetsByChunkName)
    let hashes = {}

    flatten(assets).forEach(asset => {
      if (asset[0] !== '/') {
        asset = `/${asset}`
      }

      asset = asset.replace(/\?id=\w{20}/, '')

      hashes[asset] = `${this.options.algorithm}-${this.generateHash(asset)}`
    })

    require('fs').writeFileSync(
      path.join(require('process').cwd(), Config.publicPath, 'mix-sri.json'),
      JSON.stringify(hashes, null, 4)
    )
  }

  generateHash(asset) {
    return require('crypto')
      .createHash(this.options.algorithm)
      .update(
        require('fs').readFileSync(
          path.join(require('process').cwd(), Config.publicPath, asset),
          'utf8'
        )
      )
      .digest('base64')
  }
}

module.exports = SriPlugin
