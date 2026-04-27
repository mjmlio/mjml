const chai = require('chai')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mjml = require('../lib')

const COMMON1_TEXT = 'Common1 Header'
const COMMON2_TEXT = 'Common2 Footer'
const CSS_TEXT = '.banner{color:#ff0000; font-weight:bold;}'
const HTML_SNIPPET = '<div id="snippet">Hello from HTML include</div>'

const buildTemplate = (paths) => `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-include path="${paths.header}" />
        <mj-include path="${paths.footer}" />
        <mj-include path="${paths.css}" type="css" />
        <mj-include path="${paths.html}" type="html" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

describe('includePath supports multi-root arrays and CSS/HTML includes', function () {
  const createdPaths = []
  let rootDir
  let common1Dir
  let common2Dir

  this.beforeAll(function () {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-include-multi-'))
    common1Dir = path.join(
      path.dirname(rootDir),
      `${path.basename(rootDir)}-common1`,
    )
    common2Dir = path.join(
      path.dirname(rootDir),
      `${path.basename(rootDir)}-common2`,
    )
    fs.mkdirSync(common1Dir)
    fs.mkdirSync(common2Dir)

    const headerFile = path.join(common1Dir, 'header.mjml')
    const footerFile = path.join(common2Dir, 'footer.mjml')
    const cssFile = path.join(common1Dir, 'styles.css')
    const htmlFile = path.join(common2Dir, 'snippet.html')

    fs.writeFileSync(headerFile, `<mj-text>${COMMON1_TEXT}</mj-text>`)
    fs.writeFileSync(footerFile, `<mj-text>${COMMON2_TEXT}</mj-text>`)
    fs.writeFileSync(cssFile, CSS_TEXT)
    fs.writeFileSync(htmlFile, HTML_SNIPPET)

    createdPaths.push(headerFile, footerFile, cssFile, htmlFile)
  })

  this.afterAll(function () {
    for (const filePath of createdPaths) {
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true })
      }
    }
    for (const dirPath of [rootDir, common1Dir, common2Dir]) {
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true })
      }
    }
  })

  it('includes from both common roots and handles css/html types', async function () {
    const paths = {
      header: path.relative(rootDir, path.join(common1Dir, 'header.mjml')),
      footer: path.relative(rootDir, path.join(common2Dir, 'footer.mjml')),
      css: path.relative(rootDir, path.join(common1Dir, 'styles.css')),
      html: path.relative(rootDir, path.join(common2Dir, 'snippet.html')),
    }

    const template = buildTemplate(paths)

    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      includePath: [common1Dir, common2Dir],
      minify: false,
    })

    chai
      .expect(html, 'header mjml included from common1')
      .to.include(COMMON1_TEXT)
    chai
      .expect(html, 'footer mjml included from common2')
      .to.include(COMMON2_TEXT)
    chai
      .expect(html, 'css include should appear in output')
      .to.match(/color\s*:\s*#ff0000/i)
    chai
      .expect(html, 'html include should appear in output')
      .to.include('id="snippet"')
  })

  it('denies sibling include when includePath not provided', async function () {
    const paths = {
      header: path.relative(rootDir, path.join(common1Dir, 'header.mjml')),
      footer: path.relative(rootDir, path.join(common2Dir, 'footer.mjml')),
      css: path.relative(rootDir, path.join(common1Dir, 'styles.css')),
      html: path.relative(rootDir, path.join(common2Dir, 'snippet.html')),
    }

    const template = buildTemplate(paths)

    const { html } = await mjml(template, {
      filePath: rootDir,
      actualPath: path.join(rootDir, 'template.mjml'),
      ignoreIncludes: false,
      minify: false,
    })

    chai
      .expect(html, 'header should be denied without includePath')
      .to.not.include(COMMON1_TEXT)
    chai
      .expect(html, 'footer should be denied without includePath')
      .to.not.include(COMMON2_TEXT)
    chai
      .expect(html, 'css include denied should insert comment')
      .to.include('mj-include denied')
  })
})
