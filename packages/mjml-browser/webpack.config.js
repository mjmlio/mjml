const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    "mjml": ['../mjml/lib/index'],
  },
  externals: {
    'cheerio': 'cheerio',
    'undici': 'undici',
    'cosmiconfig': 'cosmiconfig',
  },
  resolve: {
    alias: {
      'path': 'path-browserify',
      'fs': path.resolve(__dirname, 'browser-mocks/fs'),
      'uglify-js': path.resolve(__dirname, 'browser-mocks/uglify-js'),
      'minify': path.resolve(__dirname, 'browser-mocks/minify'), 
      'htmlnano': path.resolve(__dirname, 'browser-mocks/htmlnano'),
      'terser': path.resolve(__dirname, 'browser-mocks/empty'),
      'os': 'os-browserify/browser',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  node: {
    fs: false,
    process: false,
    Buffer: false,
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 5,
          keep_classnames: true,
          keep_fnames: true,
          compress: {
            passes: 2,
            keep_fargs: false,
          },
          output: {
            beautify: false,
          },
          mangle: true,
        },
      }),
    ],
  },
  output: {
    library: 'mjml',
    filename: 'index.js',
    path: path.resolve(__dirname, './lib'),
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: file => /node_modules/.test(file) && !/node_modules\/(htmlparser2|prettier)/.test(file),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                "@babel/plugin-proposal-function-bind",
                "@babel/plugin-proposal-export-default-from",
              ],
              babelrc: false,
            },
          },
        ],
      },
    ],
  },
}
