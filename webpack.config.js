const path = require('path');
const webpack = require('webpack');
const globule = require('globule');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dir = {
    src: path.join(__dirname, 'source'),
    public: path.join(__dirname, 'public')
};

const convertExtensions = {
    pug: 'html',
    scss: 'css',
    js: 'js'
};

const mode = 'production'; //development:開発, production:本番
const entry = {
    pug: {},
    scss: {},
    js: {}
};

// ファイルの分類
Object.keys(convertExtensions).forEach(from => {
    const to = convertExtensions[from];
    globule.find([`**/*.${from}`, `!**/_*.${from}`], { cwd: dir['src'] }).forEach(filename => {
        let _output = filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`);
        let _source = path.join(dir['src'], filename);
        if (_output.indexOf('template/') !== -1) {
            _output = _output.replace('template/', '');
            entry['pug'][_output] = _source;
            console.log('-------------------_output------------------------')
            console.log(_output);
            console.log('-------------------_source------------------------')
            console.log(_source);
            console.log('-------------------end------------------------')
            /*
            return new HtmlWebpackPlugin({
                filename: filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`).replace(/(\.\/)?pug/, '.'),
                template: `./${filename}`
            })
            */
        }
        if (_output.indexOf('assets/scss/') !== -1) {
            _output = _output.replace('assets/scss/', 'assets/css/');
            entry['scss'][_output] = _source;
        }
        if (_output.indexOf('assets/js/') !== -1) {
            _output = _output.replace('assets/js/', 'assets/js/');
            entry['js'][_output] = _source;
        }
    });
});

// pug
const pugConfig = {
    mode: mode,
    entry: entry['pug'],
    output: {
        filename: '[name]',
        publicPath: '/',
        path: dir['public']
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: ['pug-loader', 'apply-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name]')
    ],
    cache: true
};

// sass
const scssConfig = {
    mode: mode,
    entry: entry['scss'],
    output: {
        filename: '[name]',
        publicPath: 'assets/',
        path: dir['public']
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ])
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name]')
    ],
    cache: true
};

// js
const jsConfig = {
    mode: mode,
    entry: entry['js'],
    output: {
        filename: '[name]',
        publicPath: 'assets/',
        path: dir['public']
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['babel-preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.AggressiveMergingPlugin()
    ],
    cache: true
};

module.exports = [scssConfig, jsConfig, pugConfig];
