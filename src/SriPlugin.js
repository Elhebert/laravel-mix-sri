require('laravel-mix/src/helpers')

class SriPlugin {

  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.plugin('done', (stats) => {
      let assets = Object.assign({}, stats.toJson().assetsByChunkName)
      let hashes = {}

      flatten(assets).forEach(asset => {
        let hash = require('crypto')
          .createHash(this.options.algorithm)
          .update(require('fs').readFileSync(path.join(__dirname, `public${asset}`), 'utf8'))
          .digest('base64')

        hashes[asset] = `${this.options.algorithm}-${hash}`
      })

      require('fs').writeFileSync(
        path.join(__dirname, 'public/mix-sri.json'),
        JSON.stringify(hashes)
      )
    })
  }
}

module.exports = SriPlugin
