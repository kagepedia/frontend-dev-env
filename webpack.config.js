const path = require('path'); // ファイルパスの操作をするnode.jsのモジュール
const webpack = require('webpack'); // webpack本体
const ExtracktTextPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: ['./source/assets/js/main.js', './source/assets/scss/main.scss']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test:/.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['babel-preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ExtracktTextPlugin.extract({
                    use: [
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    require('autoprefixer')({ browsers: ['last 2 versions'] }),
                                ],
                            },
                        },
                        {
                            loader: 'sass-loader'
                        },
                    ]
                }),
            },
        ],
        plugins: [
            new ExtracktTextPlugin({
                filename: './css/[name].css'
            })
        ]
    }
}