var babel = require('gulp-babel')
var gulp = require('gulp')
var replace = require('gulp-replace')
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

gulp.task('build', ['compile'])
