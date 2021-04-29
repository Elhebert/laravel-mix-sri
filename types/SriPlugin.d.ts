import webpack from 'webpack';
export default class SriPlugin implements webpack.WebpackPluginInstance {
    private algorithm;
    constructor(algorithm: 'sha256' | 'sha384' | 'sha512');
    apply(compiler: webpack.Compiler): void;
}
