const chai = require('chai')
const { execFile } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')

const run = util.promisify(execFile)

const CLI_ENTRY = path.resolve(__dirname, '../bin/mjml')
const PACKAGE_DIR = path.resolve(__dirname, '..')

const ALLOWED_CONTENT = 'Allowed Include Content CLI'
const DENIED_CONTENT = 'Outside Include Content CLI'

const buildTemplate = (includePath) => `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-include path="${includePath}" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

describe('mjml CLI ignoreIncludes option', function () {
  const createdPaths = []
  let rootDir
  let allowedPartial
  let insideTemplate
  let outsideTemplate
  let outsidePartial

  this.beforeAll(function () {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-cli-include-'))
    const partialDir = path.join(rootDir, 'partials')
    fs.mkdirSync(partialDir)

    allowedPartial = path.join(partialDir, 'allowed.mjml')
    fs.writeFileSync(allowedPartial, `<mj-text>${ALLOWED_CONTENT}</mj-text>`)
    createdPaths.push(allowedPartial)

    insideTemplate = path.join(rootDir, 'template-inside.mjml')
    fs.writeFileSync(insideTemplate, buildTemplate('./partials/allowed.mjml'))
    createdPaths.push(insideTemplate)

    outsideTemplate = path.join(rootDir, 'template-outside.mjml')
    fs.writeFileSync(outsideTemplate, buildTemplate('../outside.mjml'))
    createdPaths.push(outsideTemplate)

    outsidePartial = path.join(
      path.dirname(rootDir),
      `${path.basename(rootDir)}-outside.mjml`,
    )
    fs.writeFileSync(outsidePartial, `<mj-text>${DENIED_CONTENT}</mj-text>`)
    createdPaths.push(outsidePartial)
  })

  this.afterAll(function () {
    for (const filePath of createdPaths) {
      try {
        fs.rmSync(filePath, { force: true })
      } catch (e) {
        // best effort cleanup
      }
    }
    if (rootDir) {
      try {
        fs.rmSync(rootDir, { recursive: true, force: true })
      } catch (e) {
        // best effort cleanup
      }
    }
  })

  const runCli = async (inputPath, extraArgs = []) => {
    const args = [CLI_ENTRY, inputPath, '-s', '--config.filePath', rootDir, '--config.minify', 'false', ...extraArgs]
    const { stdout } = await run('node', args, { cwd: PACKAGE_DIR })
    return stdout
  }

  it('ignores includes by default', async function () {
    const stdout = await runCli(insideTemplate)

    chai.expect(stdout, 'default CLI run should skip include content').to.not.include(ALLOWED_CONTENT)
    chai.expect(stdout, 'default CLI run should not emit denied comment').to.not.include('<!-- mj-include denied -->')
  })

  it('renders includes when allowIncludes is set', async function () {
    const stdout = await runCli(insideTemplate, ['--config.allowIncludes', 'true'])

    chai.expect(stdout, 'CLI should inline allowed include content').to.include(ALLOWED_CONTENT)
  })

  it('denies includes escaping the root even when allowed', async function () {
    const stdout = await runCli(outsideTemplate, ['--config.allowIncludes', 'true'])

    chai.expect(stdout, 'CLI should not inline outside content').to.not.include(DENIED_CONTENT)
    chai.expect(stdout, 'CLI should insert denial comment for disallowed path').to.include('<!-- mj-include denied -->')
  })
})
