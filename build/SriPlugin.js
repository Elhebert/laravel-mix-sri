"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = __importDefault(require("laravel-mix/src/File"));
const collect_js_1 = __importDefault(require("collect.js"));
const crypto_1 = __importDefault(require("crypto"));
class SriPlugin {
    constructor(algorithm) {
        this.algorithm = algorithm;
        this.algorithm = algorithm;
    }
    apply(compiler) {
        const process = (stats) => {
            let assets = stats.toJson().assetsByChunkName;
            let hashes = {};
            // If there's a temporary mix.js chunk, we can safely remove it.
            if (assets.mix) {
                assets.mix = collect_js_1.default(assets.mix)
                    .except(['mix.js'])
                    .all();
            }
            collect_js_1.default(assets)
                .flatten()
                // Don't add hot updates to manifest
                .filter((name) => name.indexOf('hot-update') === -1)
                .all()
                .forEach((filePath) => {
                if (!filePath.startsWith('/')) {
                    filePath = `/${filePath}`;
                }
                filePath = filePath.replace(/\?id=\w{20}/, '');
                const file = new File_1.default(filePath);
                hashes[filePath] = crypto_1.default
                    .createHash(this.algorithm)
                    .update(file.read())
                    .digest('base64');
            });
            new File_1.default('mix-sri.json').write(hashes);
        };
        compiler.hooks.done.tapAsync('SriPlugin', process);
    }
}
exports.default = SriPlugin;
//# sourceMappingURL=SriPlugin.js.map