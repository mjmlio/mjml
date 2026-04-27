const chai = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mjml = require('../lib')

const HEADER_TEXT = 'Headers Include Traversal Test'

const buildTemplate = (includeRelPath) => `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-include path="${includeRelPath}" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

describe('includePath handles traversal like ./templates/../../headers', function () {
  let parentDir
  let rootDir
  let headersDir
  const createdPaths = []

  this.beforeAll(function () {
    // Parent project dir
    parentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-traversal-parent-'))

    // Templates root inside parent
    rootDir = path.join(parentDir, 'templatesRoot')
    fs.mkdirSync(rootDir)

    // Sibling headers dir outside templatesRoot
    headersDir = path.join(parentDir, 'headers')
    fs.mkdirSync(headersDir)

    // Create the header partial in the sibling dir
    const headerFile = path.join(headersDir, 'header.mjml')
    fs.writeFileSync(headerFile, `<mj-text>${HEADER_TEXT}</mj-text>`, 'utf8')
    createdPaths.push(headerFile)

    // Also create an empty templates subfolder to mirror the relative include path
    const templatesSub = path.join(rootDir, 'templates')
    fs.mkdirSync(templatesSub)

    // Track created directories for cleanup
    createdPaths.push(templatesSub)
  })

  this.afterAll(function () {
    // Remove files first
    for (const filePath of createdPaths) {
      try {
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
          fs.rmSync(filePath, { force: true })
        }
      } catch (_) {
        // ignore cleanup errors
        String(_)
      }
    }
    // Remove dirs
    for (const dirPath of [path.join(rootDir, 'templates'), headersDir, rootDir, parentDir]) {
      try {
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true })
        }
      } catch (_) {
        // ignore cleanup errors
        String(_)
      }
    }
  })

  it('denies traversal without includePath allowlist', async function () {
    const includeRel = 'templates/../../headers/header.mjml'
    const template = buildTemplate(includeRel)

    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })

    chai
      .expect(html, 'should insert denial comment when outside sandbox')
      .to.include('<!-- mj-include denied -->')
    chai
      .expect(html, 'should not inline header text when denied')
      .to.not.include(HEADER_TEXT)
  })

  it('allows traversal targeting an explicitly allowed includePath root', async function () {
    const includeRel = 'templates/../../headers/header.mjml'
    const template = buildTemplate(includeRel)

    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      includePath: [headersDir],
      minify: false,
    })

    chai
      .expect(html, 'should inline header when target is allowlisted')
      .to.include(HEADER_TEXT)
    chai
      .expect(html, 'should not insert denial comment when allowed')
      .to.not.include('<!-- mj-include denied -->')
  })
})
