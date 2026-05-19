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

  const runCliFull = async (inputPath, extraArgs = [], cwdOverride = PACKAGE_DIR) => {
    const args = [CLI_ENTRY, inputPath, '-s', '--config.minify', 'false', ...extraArgs]
    try {
      const result = await run('node', args, { cwd: cwdOverride })
      return { stdout: result.stdout, stderr: result.stderr, exitCode: 0 }
    } catch (e) {
      return { stdout: e.stdout || '', stderr: e.stderr || '', exitCode: e.code || 1 }
    }
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

  it('emits a denied-include warning on stderr when an include is outside allowed roots', async function () {
    const { stderr } = await runCliFull(outsideTemplate, [
      '--config.filePath', rootDir,
      '--config.allowIncludes', 'true',
    ])

    chai.expect(stderr, 'warning should mention denied includes').to.include(
      'Some mj-include paths were denied because they are outside the allowed directories.',
    )
    chai.expect(stderr, 'warning should name the file').to.include(path.basename(outsideTemplate))
  })

  it('does not emit a denied-include warning when includePath covers the include directory', async function () {
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-cli-include-nodenied-'))
    const templatesDir = path.join(projectDir, 'templates')
    const externalDir = path.join(projectDir, 'external')
    fs.mkdirSync(templatesDir)
    fs.mkdirSync(externalDir)

    const partialFile = path.join(externalDir, 'partial.mjml')
    fs.writeFileSync(partialFile, '<mj-text>External Content</mj-text>')

    const templateFile = path.join(templatesDir, 'template.mjml')
    fs.writeFileSync(templateFile, buildTemplate('../external/partial.mjml'))

    try {
      const { stderr } = await runCliFull(templateFile, [
        '--config.allowIncludes', 'true',
        '--config.includePath', '["external"]',
      ], projectDir)

      chai.expect(stderr, 'no denied-include warning should appear').to.not.include(
        'Some mj-include paths were denied',
      )
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true })
    }
  })

  it('allows cross-directory includes when includePath is relative to CLI working directory', async function () {
    // Simulate the common layout: project/templates/template.mjml + project/layouts/partial.mjml
    // User runs CLI from project root with --config.includePath '["layouts"]'
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-cli-include-cross-'))
    const templatesDir = path.join(projectDir, 'templates')
    const layoutsDir = path.join(projectDir, 'layouts')
    fs.mkdirSync(templatesDir)
    fs.mkdirSync(layoutsDir)

    const partialContent = 'Cross-Directory Include Content'
    const partialFile = path.join(layoutsDir, 'header.mjml')
    fs.writeFileSync(partialFile, `<mj-text>${partialContent}</mj-text>`)

    const templateFile = path.join(templatesDir, 'template.mjml')
    fs.writeFileSync(templateFile, buildTemplate('../layouts/header.mjml'))

    try {
      // Run CLI from projectDir with relative includePath "layouts" — should resolve to projectDir/layouts
      const args = [
        CLI_ENTRY,
        templateFile,
        '-s',
        '--config.allowIncludes', 'true',
        '--config.includePath', '["layouts"]',
        '--config.minify', 'false',
      ]
      const { stdout } = await run('node', args, { cwd: projectDir })

      chai.expect(stdout, 'relative includePath should resolve from CLI working directory').to.include(partialContent)
      chai.expect(stdout, 'no denial comment should appear').to.not.include('<!-- mj-include denied -->')
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true })
    }
  })
})
