const chai = require('chai')
const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

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

const startWatch = ({ cwd, inputPath, outputPath }) => {
  const args = [CLI_ENTRY, '-w', inputPath]

  if (outputPath) {
    args.push('-o', outputPath)
  }

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

    fs.writeFileSync(inputPath, buildTemplate())
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
})
