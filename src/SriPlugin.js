require('laravel-mix/src/helpers')

class SriPlugin {
  /**
   * Create a new Manifest instance.
   *
   * @param {string} name
   */
  constructor(options) {
    this.options = options
  }

  /**
   * Apply the plugin.
   *
   * @param {Object} compiler
   */
  apply(compiler) {
    compiler.plugin('done', (stats, callback) => {
      let assets = Object.assign({}, stats.toJson().assetsByChunkName)
      let hashes = {}

      flatten(assets).forEach(asset => {
        let hash = require('crypto')
          .createHash(this.options.algorithm)
          .update(path.join(__dirname, `public${asset}`), 'utf8')
          .digest('base64')

        hashes[asset] = `${this.options.algorithm}-${hash}`
      })

      require('fs').writeFileSync(
        path.join(__dirname, 'public/mix-sri.json'),
        JSON.stringify(hashes)
      )

      callback()
    })
  }
}

module.exports = SriPlugin
