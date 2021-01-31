require('laravel-mix/src/helpers')
const collect = require('collect.js');
const path = require('path');

class SriPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    const process = stats => {
      let assets = Object.assign({}, stats.toJson().assetsByChunkName)
      let hashes = {}

      // If there's a temporary mix.js chunk, we can safely remove it.
      if (assets.mix) {
        assets.mix = collect(assets.mix).except('mix.js').all();
      }

      flatten(assets).forEach(asset => {
        if (asset[0] !== '/') {
          asset = `/${asset}`
        }

        asset = asset.replace(/\?id=\w{20}/, '')

        let hash = require('crypto')
          .createHash(this.options.algorithm)
          .update(
            require('fs').readFileSync(
              path.join(require('process').cwd(), Config.publicPath, asset),
              'utf8'
            )
          )
          .digest('base64')

        hashes[asset] = `${this.options.algorithm}-${hash}`
      })

      require('fs').writeFileSync(
        path.join(require('process').cwd(), Config.publicPath, 'mix-sri.json'),
        JSON.stringify(hashes, null, 4)
      )
    };

    if (compiler.hooks) {
      compiler.hooks.done.tap('SriPlugin', process)
    } else {
      compiler.plugin('done', process)
    }
  }
}

module.exports = SriPlugin
