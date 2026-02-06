const chai = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mjml = require('../lib')

const HEADER_TEXT = 'Security Header'

const buildTemplate = (includePathAttr, extra = '') => `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-include path="${includePathAttr}" ${extra} />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

describe('include path security checks (absolute, UNC, drive, null, double-encoded)', function () {
  let rootDir
  let siblingDir
  let headerFile
  let cssFile

  this.beforeAll(function () {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-sec-root-'))
    siblingDir = path.join(path.dirname(rootDir), `${path.basename(rootDir)}-sibling`)
    fs.mkdirSync(siblingDir)
    headerFile = path.join(siblingDir, 'header.mjml')
    fs.writeFileSync(headerFile, `<mj-text>${HEADER_TEXT}</mj-text>`, 'utf8')
    cssFile = path.join(siblingDir, 'styles.css')
    fs.writeFileSync(cssFile, '.banner{color:#00ff00; font-weight:bold;}', 'utf8')
  })

  this.afterAll(function () {
    for (const p of [headerFile, cssFile]) {
      try {
        if (fs.existsSync(p)) {
          fs.rmSync(p, { force: true })
        }
      } catch (e) {
        // ignore cleanup errors
        String(e)
      }
    }
    for (const d of [siblingDir, rootDir]) {
      try {
        if (fs.existsSync(d)) {
          fs.rmSync(d, { recursive: true, force: true })
        }
      } catch (e) {
        // ignore cleanup errors
        String(e)
      }
    }
  })

  it('denies absolute path outside allowed roots', async function () {
    const template = buildTemplate('/etc/hosts', 'type="html"')
    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })
    chai.expect(html).to.include('<!-- mj-include denied -->')
  })

  it('denies UNC-like path', async function () {
    const template = buildTemplate('//server/share/file.mjml')
    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })
    chai.expect(html).to.include('<!-- mj-include denied -->')
  })

  it('denies Windows drive-letter path', async function () {
    const template = buildTemplate('C:\\Windows\\System32\\drivers\\etc\\hosts', 'type="html"')
    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })
    chai.expect(html).to.include('<!-- mj-include denied -->')
  })

  it('denies null-byte injection attempt', async function () {
    const malicious = 'header.mjml%00../../etc/passwd'
    const template = buildTemplate(malicious)
    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })
    chai.expect(html).to.include('<!-- mj-include denied -->')
  })

  it('denies double-encoded traversal without includePath', async function () {
    const includeRel = `templates%252F..%252F..%252F${path.basename(siblingDir)}%252Fheader.mjml`
    // create a templates subdir to mirror the relative include
    const templatesDir = path.join(rootDir, 'templates')
    if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir)

    const template = buildTemplate(includeRel)
    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })
    chai.expect(html, 'double-encoded traversal should be denied').to.include('<!-- mj-include denied -->')
    chai.expect(html, 'header should not be inlined when denied').to.not.include(HEADER_TEXT)
  })

  it('allows double-encoded traversal targeting allowlisted includePath', async function () {
    const includeRel = `templates%252F..%252F..%252F${path.basename(siblingDir)}%252Fheader.mjml`
    const templatesDir = path.join(rootDir, 'templates')
    if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir)

    const template = buildTemplate(includeRel)
    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      includePath: [siblingDir],
      minify: false,
    })
    chai.expect(html, 'header should be inlined when target is allowlisted').to.include(HEADER_TEXT)
    chai.expect(html, 'no denial comment when allowed').to.not.include('<!-- mj-include denied -->')
  })

  it('allows css include targeting allowlisted includePath', async function () {
    const includeRel = `templates%252F..%252F..%252F${path.basename(siblingDir)}%252Fstyles.css`
    const templatesDir = path.join(rootDir, 'templates')
    if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir)

    const template = buildTemplate(includeRel, 'type="css"')
    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      includePath: [siblingDir],
      minify: false,
    })
    // Expect CSS rule to appear in the output
    chai.expect(html, 'css include should appear in output').to.match(/color\s*:\s*#00ff00/i)
    chai.expect(html, 'no denial comment when allowed').to.not.include('<!-- mj-include denied -->')
  })
})
