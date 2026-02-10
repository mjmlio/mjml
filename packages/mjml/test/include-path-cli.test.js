const chai = require('chai')
const { execFile } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')

const run = util.promisify(execFile)

const CLI_ENTRY = path.resolve(__dirname, '../bin/mjml')
const PACKAGE_DIR = path.resolve(__dirname, '..')

const COMMON1_TEXT = 'Common1 Header CLI'
const COMMON2_TEXT = 'Common2 Footer CLI'
const CSS_TEXT = '.hero{background:#00ff00;}'
const HTML_SNIPPET = '<span class="inline-html">Inline HTML</span>'

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

describe('CLI includePath multi-root arrays and CSS/HTML includes', function () {
  const createdPaths = []
  let rootDir
  let common1Dir
  let common2Dir
  let templatePath

  this.beforeAll(function () {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-cli-include-multi-'))
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

    const templateRelPaths = {
      header: path.relative(rootDir, headerFile),
      footer: path.relative(rootDir, footerFile),
      css: path.relative(rootDir, cssFile),
      html: path.relative(rootDir, htmlFile),
    }

    templatePath = path.join(rootDir, 'template.mjml')
    fs.writeFileSync(templatePath, buildTemplate(templateRelPaths))
    createdPaths.push(templatePath)
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

  const runCli = async (inputPath, extraArgs = []) => {
    const args = [
      CLI_ENTRY,
      inputPath,
      '-s',
      '--config.filePath',
      rootDir,
      '--config.minify',
      'false',
      '--config.allowIncludes',
      'true',
      '--config.includePath',
      JSON.stringify([common1Dir, common2Dir]),
      ...extraArgs,
    ]
    const { stdout } = await run('node', args, { cwd: PACKAGE_DIR })
    return stdout
  }

  it('renders includes from both declared roots and handles css/html', async function () {
    const stdout = await runCli(templatePath)

    chai
      .expect(stdout, 'CLI should inline header from common1')
      .to.include(COMMON1_TEXT)
    chai
      .expect(stdout, 'CLI should inline footer from common2')
      .to.include(COMMON2_TEXT)
    chai
      .expect(stdout, 'CLI should include CSS content')
      .to.match(/background\s*:\s*#00ff00/i)
    chai
      .expect(stdout, 'CLI should include HTML snippet')
      .to.include('class="inline-html"')
  })
})
