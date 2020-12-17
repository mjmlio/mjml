const path = require('path');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        "mjml": ['./lib/index'],
    },
    optimization: {
        minimizer: [
            new uglifyJsPlugin({
                uglifyOptions: {
                    ecma: 5,
                    keep_classnames: true,
                    keep_fnames: true,
                    compress: {
                        passes: 2,
                        keep_fargs: false
                    },
                    output: {
                      beautify: false,
                    },
                    mangle: true
                }
            })
        ]
    },
    output: {
      library: 'mjml',
      filename: '[name].js',
      path: path.resolve(__dirname, './dist'),
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    resolve: {
      alias: {
        'path': path.resolve(__dirname, 'browser-mocks/path'),
        'fs': path.resolve(__dirname, 'browser-mocks/fs'),
        'uglify-js': path.resolve(__dirname, 'browser-mocks/uglify-js'),
      }
    },
    // externals: {
    //     fs:    "fs",
    //     path:  "path",
    //     'uglify-js': "uglify-js"
    // },
    // resolve: {
    //     alias: {
    //         'mjml-core/lib': path.resolve(__dirname, './mjml/packages/mjml-core/src'),
    //         'mjml-accordion': path.resolve(__dirname, './mjml/packages/mjml-accordion/src'),
    //         'mjml-body': path.resolve(__dirname, './mjml/packages/mjml-body/src'),
    //         'mjml-button': path.resolve(__dirname, './mjml/packages/mjml-button/src'),
    //         'mjml-carousel': path.resolve(__dirname, './mjml/packages/mjml-carousel/src'),
    //         'mjml-cli': path.resolve(__dirname, './mjml/packages/mjml-cli/src'),
    //         'mjml-column': path.resolve(__dirname, './mjml/packages/mjml-column/src'),
    //         'mjml-core': path.resolve(__dirname, './mjml/packages/mjml-core/src'),
    //         'mjml-divider': path.resolve(__dirname, './mjml/packages/mjml-divider/src'),
    //         'mjml-group': path.resolve(__dirname, './mjml/packages/mjml-group/src'),
    //         'mjml-head': path.resolve(__dirname, './mjml/packages/mjml-head/src'),
    //         'mjml-head-attributes': path.resolve(__dirname, './mjml/packages/mjml-head-attributes/src'),
    //         'mjml-head-breakpoint': path.resolve(__dirname, './mjml/packages/mjml-head-breakpoint/src'),
    //         'mjml-head-font': path.resolve(__dirname, './mjml/packages/mjml-head-font/src'),
    //         'mjml-head-preview': path.resolve(__dirname, './mjml/packages/mjml-head-preview/src'),
    //         'mjml-head-style': path.resolve(__dirname, './mjml/packages/mjml-head-style/src'),
    //         'mjml-head-title': path.resolve(__dirname, './mjml/packages/mjml-head-title/src'),
    //         'mjml-hero': path.resolve(__dirname, './mjml/packages/mjml-hero/src'),
    //         'mjml-image': path.resolve(__dirname, './mjml/packages/mjml-image/src'),
    //         'mjml-migrate': path.resolve(__dirname, './mjml/packages/mjml-migrate/src/migrate.js'),
    //         'mjml-navbar': path.resolve(__dirname, './mjml/packages/mjml-navbar/src'),
    //         'mjml-raw': path.resolve(__dirname, './mjml/packages/mjml-raw/src'),
    //         'mjml-section': path.resolve(__dirname, './mjml/packages/mjml-section/src'),
    //         'mjml-social': path.resolve(__dirname, './mjml/packages/mjml-social/src'),
    //         'mjml-spacer': path.resolve(__dirname, './mjml/packages/mjml-spacer/src'),
    //         'mjml-table': path.resolve(__dirname, './mjml/packages/mjml-table/src'),
    //         'mjml-text': path.resolve(__dirname, './mjml/packages/mjml-text/src'),
    //         'mjml-validator': path.resolve(__dirname, './mjml/packages/mjml-validator/src'),
    //         'mjml-wrapper': path.resolve(__dirname, './mjml/packages/mjml-wrapper/src'),
    //         'mjml-parser-xml': path.resolve(__dirname, './mjml/packages/mjml-parser-xml/src'),
    //         'fs': path.resolve(__dirname, 'mocks/fs'),
    //         'uglify-js': path.resolve(__dirname, 'mocks/uglify-js'),
    //     }
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path.join(__dirname, 'node_modules'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                "@babel/plugin-proposal-function-bind",
                                "@babel/plugin-proposal-export-default-from"
                            ],
                            babelrc: false
                        }
                    }
                ]
            }
		]
    },
    plugins: [
    ],
    watchOptions: {
        ignored: 'node_modules/',
        poll: 2000
    }
};
