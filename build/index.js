"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const laravel_mix_1 = __importDefault(require("laravel-mix"));
const SriPlugin_1 = __importDefault(require("./SriPlugin"));
class IntegrityHash {
    constructor() {
        this.config = {};
    }
    name() {
        return 'generateIntegrityHash';
    }
    register(options = {}) {
        this.config = {
            algorithm: 'sha256',
            enabled: options.enabled || laravel_mix_1.default.inProduction(),
        };
        if (['sha256', 'sha384', 'sha512'].includes(options.algorithm)) {
            this.config.algorithm = options.algorithm;
        }
    }
    webpackPlugins() {
        if (this.config.enabled) {
            return [new SriPlugin_1.default(this.config.algorithm)];
        }
    }
}
laravel_mix_1.default.extend('generateIntegrityHash', new IntegrityHash());
//# sourceMappingURL=index.js.map