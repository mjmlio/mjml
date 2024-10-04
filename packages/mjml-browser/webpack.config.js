const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    mjml: ['../mjml/src/index']
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
            keep_fargs: false
          },
          output: {
            beautify: false
          },
          mangle: true
        }
      })
    ]
  },
  output: {
    library: 'mjml',
    filename: 'index.js',
    path: path.resolve(__dirname, './src'),
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    alias: {
      path: path.resolve(__dirname, 'browser-mocks/path'),
      fs: path.resolve(__dirname, 'browser-mocks/fs'),
      'uglify-js': path.resolve(__dirname, 'browser-mocks/uglify-js')
    }
  }
}
