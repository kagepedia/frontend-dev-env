const path = require("path");
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const targetTypes = {
  pug: 'html',
  scss: 'css',
  js: 'js'
};

const getEntriesList = (targetTypes) => {
  const entriesList = {};
  for(const [ srcType, targetType ] of Object.entries(targetTypes)) {
    const filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`], { cwd : `${__dirname}/source` });
    
    for(const srcName of filesMatched) {
        let targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`);
      if (targetName.indexOf('template/') !== -1) {
        targetName = targetName.replace('template/', '');
      }
      if (targetName.indexOf('assets/scss/') !== -1) {
        targetName = targetName.replace('assets/scss/', 'assets/css/');
      }
      if (targetName.indexOf('assets/js/') !== -1) {
        targetName = targetName.replace('assets/js/', 'assets/js/');
      }
      entriesList[targetName] = `${__dirname}/source/${srcName}`;
    }
  }
  return entriesList;
}

console.log(getEntriesList({ scss : 'css' }));

const app = (env, argv) => {
    let sourceMap = 'source-map'
    if(argv.mode === 'production') {
      sourceMap = ''
    }

    const settings = [
        // HTML
        {
            devServer: {
                contentBase: path.join(__dirname, './public'),
                open: true
            },
            context: `${__dirname}`,
            entry  : getEntriesList({ pug : 'html' }),
            output : {
                filename : '[name]',
                path     : `${__dirname}/public/`
            },
            module : {
                rules : [
                    {
                        test : /\.pug$/,
                        use  : [
                            {
                                loader: 'pug-loader',
                                options: {
                                    pretty: true
                                }
                            }
                        ]
                    }
                ]
            },
            plugins: [
                new CopyWebpackPlugin(
                    [{ from : `${__dirname}/source` }],
                    { ignore : Object.keys(targetTypes).map((ext) => `*.${ext}`) }
                ),
                new CleanWebpackPlugin({
                    cleanAfterEveryBuildPatterns: ['public'],
                    exclude: ['public/assets/img']
                }),
            ]
        },
        // CSS
        {
            context: `${__dirname}`,
            entry  : getEntriesList({ scss : 'css' }),
            output : {
                filename : '[name]',
                path     : `${__dirname}/public/`,
            },
            module: {
                rules: [
                    {
                        test : /\.scss$/,
                        use  : [
                            /*
                            {
                                loader: MiniCssExtractPlugin.loader,
                            },
                            */
                            {
                                loader: "css-loader",
                                options: {
                                    url: false,
                                    sourceMap: true,
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                  }
                            }
                        ]
                    }
                ]
            },
            devtool: sourceMap,
            plugins: [
                new FixStyleOnlyEntriesPlugin(),
                new MiniCssExtractPlugin({
                    filename: '[name]',
                }),
                new OptimizeCSSAssetsPlugin({})
            ],
        },
        // JS
        {
            context: `${__dirname}`,
            entry  : getEntriesList({ js : 'js' }),
            output: {
                filename : '[name]',
                path     : `${__dirname}/public/`
            },
            module: {
                rules: [
                    {
                        test : /\.js$/,
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
            devtool: sourceMap,
            plugins: [
            ]
        },
    ];

    // pug -> html
    for(const [ targetName, srcName ] of Object.entries(getEntriesList({ pug : 'html' }))) {
        settings[0].plugins.push(new HtmlWebpackPlugin({
            filename : targetName,
            template : srcName,
            inject: false
        }));
    }
    return settings;
}

module.exports = app;