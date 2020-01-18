const path = require('path'); // ファイルパスの操作をするnode.jsのモジュール
const webpack = require('webpack'); // webpack本体
const ExtracktTextPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: ['./source/assets/js/main.js', './source/assets/scss/main.scss', './source/template/index.pug']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].bundle.js'
    },
    devServer: {
        port: 3000,
    },
    module: {
        rules: [
            { 
                test: /\.pug$/,
                use: {
                    loader: 'pug-loader',
                    options: {
                        pretty: true
                    }
                }
            },
            {
                test:/\.js$/,
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
                use: [
                    ExtracktTextPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            //minimize: true,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtracktTextPlugin({
            filename: './css/[name].css'
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './source/template/index.pug'
        })
    ]
}