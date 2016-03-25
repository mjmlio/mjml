import { argv } from 'yargs'
import { cd, exec, rm } from 'shelljs'
import babel from 'gulp-babel'
import fs from 'fs'
import gulp from 'gulp'
import newer from 'gulp-newer'
import path from 'path'
import through from 'through2'

const PACKAGES_PATH = path.resolve(__dirname, './packages')
const packages = fs.readdirSync(PACKAGES_PATH).filter(file => {
  return fs.statSync(path.resolve(PACKAGES_PATH, file)).isDirectory()
}).reduce((acc, file) => ({
  ...acc,
  [file]: path.resolve(PACKAGES_PATH, file)
}), {})

let srcEx
let libFragment

if (path.win32 === path) {
  srcEx = /(packages\\[^\\]+)\\src\\/
  libFragment = '$1\\lib\\'
} else {
  srcEx = /(packages\/[^\/]+)\/src\//
  libFragment = '$1/lib/'
}

gulp.task('build', () => {
  return gulp.src(`${PACKAGES_PATH}/*/src/**/*.js`)
    .pipe(through.obj((file, enc, callback) => {
      file._path = file.path
      file.path = file.path.replace(srcEx, libFragment)
      callback(null, file)
    }))
    .pipe(newer(PACKAGES_PATH))
    .pipe(babel())
    .pipe(gulp.dest(PACKAGES_PATH))
})

gulp.task('install', () => {
  return Promise.all(
    Object.keys(packages).map(packageName => {
      return new Promise(resolve => {
        cd(packages[packageName])
        exec('npm install')
        resolve()
      })
    })
  )
})

gulp.task('clean', () => {
  // Remove package node_modules
  return Promise.all(
    Object.keys(packages).map(packageName => {
      return new Promise(resolve => {
        rm('-rf', path.resolve(packages[packageName], 'node_modules'), path.resolve(packages[packageName], 'lib'), path.resolve(packages[packageName], 'dist'))
        resolve()
      })
    })
  )
})

gulp.task('version', () => {
  // Try to derive package name from directory where this was run from
  const pwd = process.env.PWD
  const pwdPackageName = Object.keys(packages).reduce((prev, name) => {
    return packages[name] === pwd ? name : prev
  }, undefined)

  // Check params
  const packageName = argv.pkg || argv.p || pwdPackageName
  const version = argv.version || argv.v
  if (!packageName || !version) {
    throw new Error('Usage: gulp version -p <package> -v <version>')
  }

  // Bump the version
  cd(packages[packageName])
  const execResult = exec(`npm version ${version}`)
  const bumpedVersion = execResult.output.replace('\n', '').replace('v', '')

  // Commit and tag
  exec(`git add ${packages[packageName]}/package.json`)
  const message = `${packageName}@${bumpedVersion}`
  exec(`git commit -m "${message}"`)
  const tagName = `${packageName}-v${bumpedVersion}`
  exec(`git tag ${tagName}`)
})

gulp.task('publish', ['build'], () => {
  // Try to derive package name from directory where this was run from
  const pwd = process.env.PWD
  const pwdPackageName = Object.keys(packages).reduce((prev, name) => {
    return packages[name] === pwd ? name : prev
  }, undefined)

  // Check params
  const packageName = argv.pkg || argv.p || pwdPackageName
  if (!packageName) {
    throw new Error('Usage: gulp publish -p <package> -t <tag>')
  }

  // Publish
  cd(packages[packageName])

  exec(`npm publish${argv.t ? ` --tag ${argv.t}` : ''}`)
})
