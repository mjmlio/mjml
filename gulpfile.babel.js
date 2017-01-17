import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import gulp from 'gulp'
import {
  cd,
  exec,
  rm,
} from 'shelljs'
import {
  argv,
} from 'yargs'
import babel from 'gulp-babel'
import mergeStream from 'merge-stream'

const ROOT_PATH = path.resolve(__dirname)
const PACKAGES_PATH = path.resolve(__dirname, './packages')
const packages = fs.readdirSync(PACKAGES_PATH)
  .filter(file => fs.statSync(path.resolve(PACKAGES_PATH, file)).isDirectory())
  .reduce((result, value) => ({
    ...result,
    [value]: path.resolve(PACKAGES_PATH, value),
  }), {})

const sharedDeps = [
  'lodash',
]

gulp.task('yarn-lock', () => Promise.all(
  _.map(packages, (packageDirectory, packageName) => new Promise(resolve => {
    cd(packageDirectory)
    exec('yarn install')
    resolve()
  })))
)

gulp.task('yarn-dependencies', ['yarn-lock'], () => Promise.all(
  _.map(packages, (packageDirectory, packageName) => new Promise(resolve => {
    cd(packageDirectory)
    exec('yarn upgrade-interactive')
    resolve()
  })))
)

gulp.task('link-packages', () => Promise.all(
  _.map(packages, (packageDirectory, packageName) => new Promise(resolve => {
    cd(packageDirectory)
    exec('npm link')
    cd(ROOT_PATH)
    exec(`npm link ${packageName}`)
    resolve()
  })))
  .then(() => Promise.all(
    _.map(packages, packageDirectory => Promise.all(
      Object.keys(packages).concat(sharedDeps).map(dependencyName => new Promise(resolve => {
        rm('-rf', path.resolve(packageDirectory, 'node_modules', dependencyName))
        resolve()
      }))
    )))
  )
)

gulp.task('build', () => {
  const stream = mergeStream()

  _.forEach(packages, packageDirectory => {
    const src = `${packageDirectory}/src/**/*`
    const dest = path.resolve(packageDirectory, 'lib')

    rm('-rf', dest)

    const build = gulp.src(src)
      .pipe(babel())
      .pipe(gulp.dest(dest))

    stream.add(build)
  })

  return stream
})

gulp.task('clean', () => Promise.all(
  _.map(packages, packageDirectory => new Promise(resolve => {
    rm('-rf', path.resolve(packageDirectory, 'node_modules'))
    rm('-rf', path.resolve(packageDirectory, 'yarn.lock'))
    resolve()
  })))
)
