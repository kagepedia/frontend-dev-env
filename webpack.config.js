const path = require("path");
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const autoprefixer = require('autoprefixer');

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
console.log(getEntriesList(targetTypes));
const app = {
    mode : 'none',
    entry  : getEntriesList(targetTypes),
    output : {
        filename : '[name]',
        path     : `${__dirname}/public`
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        open: true
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
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
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
            }
        ]
    },
    plugins : [
        new CopyWebpackPlugin(
        [{ from : `${__dirname}/source` }],
        { ignore : Object.keys(targetTypes).map((ext) => `*.${ext}`) }
        ),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['public'],
            exclude: ['public/assets/img']
        })
    ]
};

// pug -> html
for(const [ targetName, srcName ] of Object.entries(getEntriesList({ pug : 'html' }))) {
  app.plugins.push(new HtmlWebpackPlugin({
    filename : targetName,
    template : srcName
  }));
}

// sass -> css
for(const [ targetName, srcName ] of Object.entries(getEntriesList({ scss : 'css' }))) {
    app.plugins.push(new MiniCssExtractPlugin({
      filename : targetName,
    }));
}  
module.exports = app;