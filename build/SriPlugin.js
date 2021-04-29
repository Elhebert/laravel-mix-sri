"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collect_js_1 = __importDefault(require("collect.js"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
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
                assets.mix = collect_js_1.default(assets.mix).except(['mix.js']).all();
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
                hashes[filePath] = crypto_1.default
                    .createHash(this.algorithm)
                    .update(fs_1.default.readFileSync(
                // @ts-ignore TS2304
                path_1.default.join(process_1.cwd(), Config.publicPath, 'mix-sri.json')))
                    .digest('base64');
            });
            fs_1.default.writeFileSync(
            // @ts-ignore TS2304
            path_1.default.join(process_1.cwd(), Config.publicPath, 'mix-sri.json'), JSON.stringify(hashes, null, 4));
        };
        compiler.hooks.done.tapAsync('SriPlugin', process);
    }
}
exports.default = SriPlugin;
//# sourceMappingURL=SriPlugin.js.map