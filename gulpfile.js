var babel = require('gulp-babel')
var env = require('gulp-env')
var gulp = require('gulp')
var gulpUtil = require('gulp-util')
var sourcemaps = require('gulp-sourcemaps')
var webpackStream = require('webpack-stream')

var paths = {
  dist: 'dist',
  lib: 'lib'
}

var buildDist = function (options) {
  var webpackOpts = {
    debug: options.debug,
    entry: [
      'babel-polyfill',
      './' + paths.lib + '/index.js'
    ],
    output: {
      filename: options.output,
      libraryTarget: 'umd',
      library: 'mjml'
    },
    plugins: [
      new webpackStream.webpack.optimize.OccurenceOrderPlugin(),
      new webpackStream.webpack.optimize.DedupePlugin()
    ]
  }

  if (!options.debug) {
    webpackOpts.plugins.push(
      new webpackStream.webpack.optimize.UglifyJsPlugin({
        output: {
          ascii_only: true
        },
        compress: {
          hoist_vars: true,
          screw_ie8: true,
          warnings: false
        }
      })
    )
  }

  return webpackStream(webpackOpts, null, function (err, stats) {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err)
    }

    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', '\n' + stats.toString({ colors: true }))
    }
  })
}

gulp.task('build', function () {
  return gulp.src('src/**/*.js')
    .pipe(env.set({
      MJML_VERSION: require('./package.json').version
    }))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.lib))
})

gulp.task('dist', ['build'], function () {
  var options = {
    debug: true,
    output: 'mjml.js'
  }

  return buildDist(options)
    .pipe(gulp.dest(paths.dist))
})

gulp.task('dist:min', ['build'], function () {
  var options = {
    debug: false,
    output: 'mjml.min.js'
  }

  return buildDist(options)
    .pipe(gulp.dest(paths.dist))
})
