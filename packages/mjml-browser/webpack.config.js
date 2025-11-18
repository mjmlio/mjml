const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../mjml/lib/index'),
  output: {
    path: __dirname,
    filename: 'index.js',
    library: 'mjml',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== "undefined" ? self : this',
  },
  performance: {
    hints: false,
  },
  resolve: {
    alias: {
      // Existing aliases
      stream: require.resolve('stream-browserify'),
      'node:stream': require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      'node:buffer': require.resolve('buffer/'),
      path: require.resolve('path-browserify'),

      // Node.js core modules that need polyfills
      'node:crypto': require.resolve('crypto-browserify'),
      'node:url': require.resolve('url/'),
      'node:util$': require.resolve('util/'),
      'node:assert': require.resolve('assert/'),
      'node:events': require.resolve('events/'),
      'node:zlib': require.resolve('browserify-zlib'),
      'node:http': require.resolve('stream-http'),
      querystring: require.resolve('querystring-es3'),
      'node:querystring': require.resolve('querystring-es3'),

      // Node.js modules that don't work in browser - stub them out
      'node:util/types': path.resolve(__dirname, 'stubs/empty.js'),
      'node:http2': path.resolve(__dirname, 'stubs/empty.js'),
      'node:async_hooks': path.resolve(__dirname, 'stubs/empty.js'),
      'node:net': path.resolve(__dirname, 'stubs/empty.js'),
      'node:tls': path.resolve(__dirname, 'stubs/empty.js'),
      'node:perf_hooks': path.resolve(__dirname, 'stubs/empty.js'),
      'node:diagnostics_channel': path.resolve(__dirname, 'stubs/empty.js'),
      'node:console': path.resolve(__dirname, 'stubs/empty.js'),
      'node:worker_threads': path.resolve(__dirname, 'stubs/empty.js'),

      // File system modules that don't work in browser
      fs: path.resolve(__dirname, 'stubs/empty.js'),
      'fs/promises': path.resolve(__dirname, 'stubs/empty.js'),
      child_process: path.resolve(__dirname, 'stubs/empty.js'),
      module: path.resolve(__dirname, 'stubs/empty.js'),

      // Optional dependency that's not needed
      typescript: path.resolve(__dirname, 'stubs/empty.js'),

      // Problematic dependencies - use specific stubs
      prettier: path.resolve(__dirname, 'stubs/empty.js'),
      cosmiconfig: path.resolve(__dirname, 'stubs/empty.js'),
      htmlnano: path.resolve(__dirname, 'stubs/htmlnano.js'),

      // Undici is not needed in browser - stub it out completely
      undici: path.resolve(__dirname, 'stubs/empty.js'),
    },
  },
  node: {
    // Webpack 4 way to disable Node.js polyfills
    fs: 'empty',
    child_process: 'empty',
    worker_threads: false,
    net: 'empty',
    tls: 'empty',
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude:
          /node_modules\/(?!(cheerio|htmlparser2|domhandler|dom-serializer|domelementtype|domutils|entities|parse5|encoding-sniffer)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { browsers: ['> 0.25%', 'not dead'] },
                },
              ],
            ],
            plugins: [
              'lodash',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-private-methods',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-logical-assignment-operators',
            ],
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          compress: {
            drop_console: false,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': JSON.stringify({}),
      'process.version': JSON.stringify('v18.0.0'),
      'process.versions.node': JSON.stringify('18.0.0'),
      'process.platform': JSON.stringify('browser'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
}
