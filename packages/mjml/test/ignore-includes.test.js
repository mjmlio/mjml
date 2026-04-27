const chai = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mjml = require('../lib')

const ALLOWED_CONTENT = 'Allowed Include Content'
const DENIED_CONTENT = 'Outside Include Content'

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

describe('ignoreIncludes option', function () {
  const createdPaths = []
  let rootDir
  let outsideFile

  this.beforeAll(function () {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-include-'))
    const partialDir = path.join(rootDir, 'partials')
    fs.mkdirSync(partialDir)

    const allowedPartial = path.join(partialDir, 'allowed.mjml')
    fs.writeFileSync(allowedPartial, `<mj-text>${ALLOWED_CONTENT}</mj-text>`)
    createdPaths.push(allowedPartial)

    outsideFile = path.join(
      path.dirname(rootDir),
      `${path.basename(rootDir)}-outside.mjml`,
    )
    fs.writeFileSync(outsideFile, `<mj-text>${DENIED_CONTENT}</mj-text>`)
    createdPaths.push(outsideFile)
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

  it('ignores includes by default', async function () {
    const { html } = await mjml(buildTemplate('./partials/allowed.mjml'), {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      minify: false,
    })

    chai.expect(html, 'default options should not render include content').to.not.include(ALLOWED_CONTENT)
    chai.expect(html, 'ignoreIncludes=true should not inject denial comment').to.not.include('<!-- mj-include denied -->')
  })

  it('renders includes when ignoreIncludes=false', async function () {
    const { html } = await mjml(buildTemplate('./partials/allowed.mjml'), {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })

    chai.expect(html, 'include content should be inlined when allowed').to.include(ALLOWED_CONTENT)
  })

  it('denies includes that escape the root directory', async function () {
    const { html } = await mjml(buildTemplate('../outside.mjml'), {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })

    chai.expect(html, 'outside content should not be rendered').to.not.include(DENIED_CONTENT)
    chai.expect(html, 'denied include should insert warning comment').to.include('<!-- mj-include denied -->')
  })
})
