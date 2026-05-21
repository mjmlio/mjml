const chai = require('chai')
const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const glob = require('glob')

const CLI_ENTRY = path.resolve(__dirname, '../bin/mjml')
const TEMPLATE_TEXT = 'Watch CLI Rendered Text'
const UPDATED_TEMPLATE_TEXT = 'Watch CLI Updated Text'

const buildTemplate = (text = TEMPLATE_TEXT) => `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>${text}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

const buildIncludeTemplate = (includePath) => `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-include path="${includePath}" type="mjml" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

const buildIncludeContent = (text = TEMPLATE_TEXT) => `<mj-text>${text}</mj-text>`

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

const startWatch = ({ cwd, inputPath, inputPaths, outputPath, cliArgs = [] }) => {
  const watchPaths = inputPaths || (inputPath ? [inputPath] : [])
  const args = [CLI_ENTRY, '-w', ...watchPaths]

  if (outputPath) {
    args.push('-o', outputPath)
  }

  args.push(...cliArgs)

  const child = spawn('node', args, { cwd })
  let output = ''
  let successCount = 0
  let pendingWait = null
  let failed = false

  const clearPendingWait = () => {
    if (!pendingWait) {
      return
    }

    clearTimeout(pendingWait.timer)
    pendingWait = null
  }

  const fail = (error) => {
    if (failed) {
      return
    }

    failed = true

    if (pendingWait) {
      const { reject } = pendingWait
      clearPendingWait()
      reject(error)
    }
  }

  const maybeResolvePendingWait = () => {
    if (!pendingWait || successCount < pendingWait.targetCount) {
      return
    }

    const { resolve } = pendingWait
    clearPendingWait()
    resolve(output)
  }

  const handleChunk = (chunk) => {
    output += chunk.toString()
    successCount = (output.match(/Successfully compiled/g) || []).length

    if (
      output.includes('Error while rendering the file') ||
      output.includes('Error while compiling file')
    ) {
      fail(new Error(output))
      return
    }

    maybeResolvePendingWait()
  }

  child.stdout.on('data', handleChunk)
  child.stderr.on('data', handleChunk)
  child.on('error', fail)
  child.on('exit', (code, signal) => {
    if (!failed && (code !== 0 || signal !== 'SIGTERM')) {
      fail(
        new Error(
          `watch exited unexpectedly (code: ${code}, signal: ${signal})\n${output}`,
        ),
      )
    }
  })

  return {
    waitForCompiles(targetCount, timeout = 10000) {
      if (failed) {
        return Promise.reject(new Error(output || 'watch already failed'))
      }

      if (pendingWait) {
        return Promise.reject(new Error('watch already has a pending wait'))
      }

      return new Promise((resolve, reject) => {
        pendingWait = {
          targetCount,
          resolve,
          reject,
          timer: setTimeout(() => {
            pendingWait = null
            reject(
              new Error(
                `watch timed out waiting for compile ${targetCount}\n${output}`,
              ),
            )
          }, timeout),
        }

        maybeResolvePendingWait()
      })
    },
    async stop() {
      clearPendingWait()

      if (child.exitCode !== null) {
        return
      }

      await new Promise((resolve) => {
        child.once('exit', resolve)
        child.kill('SIGTERM')
      })
    },
  }
}

describe('mjml CLI watch mode', function () {
  const createdDirs = []

  this.afterAll(function () {
    for (const dirPath of createdDirs) {
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true })
      }
    }
  })

  const createFixture = () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-cli-watch-'))
    const inputPath = path.join(rootDir, 'template.mjml')

    writeFile(inputPath, buildTemplate())
    createdDirs.push(rootDir)

    return {
      rootDir,
      inputPath,
    }
  }

  it('writes the default output file while watching and recompiles on change', async function () {
    const { rootDir, inputPath } = createFixture()
    const outputPath = path.join(rootDir, 'template.html')
    const watch = startWatch({ cwd: rootDir, inputPath })

    try {
      const firstOutput = await watch.waitForCompiles(1)

      chai.expect(firstOutput).to.include('Change detected')
      chai.expect(firstOutput).to.not.include('Error while rendering the file')
      chai.expect(fs.existsSync(outputPath)).to.equal(true)
      chai.expect(fs.readFileSync(outputPath, 'utf8')).to.include(TEMPLATE_TEXT)

      fs.writeFileSync(inputPath, buildTemplate(UPDATED_TEMPLATE_TEXT))

      const secondOutput = await watch.waitForCompiles(2)

      chai.expect(secondOutput).to.include('Successfully compiled')
      chai.expect(fs.readFileSync(outputPath, 'utf8')).to.include(UPDATED_TEMPLATE_TEXT)
    } finally {
      await watch.stop()
    }
  })

  it('writes the configured output file while watching and recompiles on change', async function () {
    const { rootDir, inputPath } = createFixture()
    const outputPath = path.join(rootDir, 'custom-output.html')
    const watch = startWatch({ cwd: rootDir, inputPath, outputPath })

    try {
      await watch.waitForCompiles(1)

      chai.expect(fs.existsSync(outputPath)).to.equal(true)
      chai.expect(fs.readFileSync(outputPath, 'utf8')).to.include(TEMPLATE_TEXT)

      fs.writeFileSync(inputPath, buildTemplate(UPDATED_TEMPLATE_TEXT))

      const secondOutput = await watch.waitForCompiles(2)

      chai.expect(secondOutput).to.not.include('Error while compiling file')
      chai.expect(fs.readFileSync(outputPath, 'utf8')).to.include(UPDATED_TEMPLATE_TEXT)
    } finally {
      await watch.stop()
    }
  })

  it('watches a glob-expanded multi-file input set and recompiles only the changed file', async function () {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-cli-watch-glob-'))
    const outputDir = path.join(rootDir, 'dist')

    writeFile(path.join(rootDir, 'nested/a/one.mjml'), buildTemplate('Nested File One'))
    writeFile(path.join(rootDir, 'nested/b/two.mjml'), buildTemplate('Nested File Two'))
    fs.mkdirSync(outputDir)
    createdDirs.push(rootDir)

    const inputPaths = glob.sync('nested/**/*.mjml', {
      cwd: rootDir,
      absolute: true,
      nodir: true,
    }).sort()
    const outputPaths = inputPaths.map((inputPath) =>
      path.join(outputDir, `${path.basename(inputPath, '.mjml')}.html`),
    )

    const watch = startWatch({ cwd: rootDir, inputPaths, outputPath: outputDir })

    try {
      await watch.waitForCompiles(inputPaths.length)

      const beforeOutputs = outputPaths.map((outputPath) =>
        fs.readFileSync(outputPath, 'utf8'),
      )

      fs.writeFileSync(inputPaths[0], buildTemplate('Nested File One Updated'))

      const secondOutput = await watch.waitForCompiles(inputPaths.length + 1)

      chai.expect(secondOutput).to.include('Change detected')
      chai.expect(fs.readFileSync(outputPaths[0], 'utf8')).to.include('Nested File One Updated')
      chai.expect(fs.readFileSync(outputPaths[1], 'utf8')).to.equal(beforeOutputs[1])
    } finally {
      await watch.stop()
    }
  })

  it('recompiles when a symlinked include target changes', async function () {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-cli-watch-symlink-'))
    const includesDir = path.join(rootDir, 'includes')
    const linkedIncludesDir = path.join(rootDir, 'linked-includes')
    const templatePath = path.join(rootDir, 'template.mjml')
    const outputDir = path.join(rootDir, 'dist')
    const outputPath = path.join(outputDir, 'template.html')

    writeFile(path.join(includesDir, 'one.mjml'), buildIncludeContent('Symlink Include Original'))
    writeFile(templatePath, buildIncludeTemplate('linked-includes/one.mjml'))
    fs.mkdirSync(outputDir)

    try {
      fs.symlinkSync('includes', linkedIncludesDir, 'dir')
    } catch (e) {
      if (e.code === 'EPERM' || e.code === 'EACCES' || e.code === 'EINVAL') {
        this.skip()
      }

      throw e
    }

    createdDirs.push(rootDir)

    const watch = startWatch({
      cwd: rootDir,
      inputPath: templatePath,
      outputPath: outputDir,
      cliArgs: ['--config.allowIncludes', 'true'],
    })

    try {
      await watch.waitForCompiles(1)

      const beforeOutput = fs.readFileSync(outputPath, 'utf8')
      chai.expect(beforeOutput).to.include('Symlink Include Original')

      fs.writeFileSync(path.join(includesDir, 'one.mjml'), buildIncludeContent('Symlink Include Updated'))

      const secondOutput = await watch.waitForCompiles(2)

      chai.expect(secondOutput).to.include('Change detected')
      chai.expect(fs.readFileSync(outputPath, 'utf8')).to.include('Symlink Include Updated')
    } finally {
      await watch.stop()
    }
  })
})
