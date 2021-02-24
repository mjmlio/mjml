module.exports = {
  presets: [['@babel/env', {
    targets: { node: '10' },
    include: ['transform-classes'],
  }]],
  plugins: [
    '@babel/proposal-class-properties',
    [
      '@babel/transform-runtime',
      {
        // by default the plugin assumes we have 7.0.0-beta.0 version of runtime
        // and inline all missing helpers instead of requiring them
        version: require('@babel/plugin-transform-runtime/package.json')
          .version,
      },
    ],
    'add-module-exports',
    'lodash',
  ],
}
