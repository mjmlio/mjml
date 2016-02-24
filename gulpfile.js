var babel = require('gulp-babel')
var chmod = require('gulp-chmod')
var gulp = require('gulp')
var rename = require('gulp-rename')
var replace = require('gulp-replace')
var rimraf = require('gulp-rimraf')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')

gulp.task('compile', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(replace('__MJML_VERSION__', require('./package.json').version))
    .pipe(babel())
    .pipe(uglify({
      compress: {
        hoist_vars: true,
        screw_ie8: true,
        warnings: false
      }
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'))
})

gulp.task('rename-files', ['compile'], function () {
  return gulp.src('lib/mjml.js')
    .pipe(rename('mjml'))
    .pipe(chmod({
      owner: {
        read: true,
        write: true,
        execute: true
      }
    }))
    .pipe(gulp.dest('lib'))
})

gulp.task('delete-files', ['rename-files'], function () {
  return gulp.src(['lib/mjml.js', 'lib/mjml.js.map'])
    .pipe(rimraf())
})

gulp.task('build', ['compile', 'rename-files', 'delete-files'])
