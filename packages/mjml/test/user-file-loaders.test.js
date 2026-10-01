const chai = require('chai')
const { execFile } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')
const { pathToFileURL } = require('url')
const { handleMjmlConfig } = require('mjml-core')
const mjml = require('../lib')

const run = util.promisify(execFile)

const CLI_ENTRY = path.resolve(__dirname, '../bin/mjml')
const CORE_PATH = require.resolve('mjml-core')
const CORE_URL = pathToFileURL(CORE_PATH).href
const NODE_MAJOR = Number(process.versions.node.split('.')[0])

// Each fixture registers its own tag, as component registration is global
const cjsComponent = (tag) => `
const { BodyComponent } = require(${JSON.stringify(CORE_PATH)})
class C extends BodyComponent {
  static componentName = '${tag}'
  static endingTag = true
  static dependencies = { 'mj-column': ['${tag}'], '${tag}': [] }
  render() { return '<p>${tag}-rendered</p>' }
}
module.exports = C
`

const esmComponent = (tag, extra = '') => `
import core from ${JSON.stringify(CORE_URL)}
${extra}
export default class C extends core.BodyComponent {
  static componentName = '${tag}'
  static endingTag = true
  static dependencies = { 'mj-column': ['${tag}'], '${tag}': [] }
  render() { return '<p>${tag}-rendered</p>' }
}
`

const template = (tag) =>
  `<mjml><mj-body><mj-section><mj-column><!-- keep-me --><${tag}></${tag}></mj-column></mj-section></mj-body></mjml>`

describe('user file loaders (.mjmlconfig, components, skeleton)', function () {
  let rootDir

  const write = (relPath, content) => {
    const full = path.join(rootDir, relPath)
    fs.mkdirSync(path.dirname(full), { recursive: true })
    fs.writeFileSync(full, content)
    return full
  }

  const render = (tag, configPath) =>
    mjml(template(tag), {
      mjmlConfigPath: configPath,
      useMjmlConfigOptions: true,
      validationLevel: 'skip',
    })

  const expectComponentAndOptions = (html, tag) => {
    chai.expect(html).to.include(`${tag}-rendered`)
    // options: { keepComments: false } comes from the config file
    chai.expect(html).to.not.include('keep-me')
  }

  this.beforeAll(function () {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mjml-loaders-'))
    write('package.json', '{"name":"fixture"}')
  })

  this.afterAll(function () {
    fs.rmSync(rootDir, { recursive: true, force: true })
  })

  describe('.mjmlconfig', function () {
    it('loads a JSON .mjmlconfig', async function () {
      write('json/comp.js', cjsComponent('mj-loader-json'))
      const cfg = write(
        'json/.mjmlconfig',
        '{"packages":["./comp.js"],"options":{"keepComments":false}}',
      )
      const { html } = await render('mj-loader-json', cfg)
      expectComponentAndOptions(html, 'mj-loader-json')
    })

    it('loads a CommonJS .mjmlconfig.js', async function () {
      write('cjs/comp.js', cjsComponent('mj-loader-cjs'))
      const cfg = write(
        'cjs/.mjmlconfig.js',
        'module.exports = { packages: ["./comp.js"], options: { keepComments: false } }',
      )
      const { html } = await render('mj-loader-cjs', cfg)
      expectComponentAndOptions(html, 'mj-loader-cjs')
    })

    it('loads an ESM .mjmlconfig.js with named exports', async function () {
      write('esm-named/comp.js', cjsComponent('mj-loader-esm-named'))
      const cfg = write(
        'esm-named/.mjmlconfig.js',
        'export const packages = ["./comp.js"]\nexport const options = { keepComments: false }',
      )
      const { html } = await render('mj-loader-esm-named', cfg)
      expectComponentAndOptions(html, 'mj-loader-esm-named')
    })

    it('loads an ESM .mjmlconfig.js with export default (no "type")', async function () {
      write('esm-default/comp.js', cjsComponent('mj-loader-esm-default'))
      const cfg = write(
        'esm-default/.mjmlconfig.js',
        'export default { packages: ["./comp.js"], options: { keepComments: false } }',
      )
      const { html } = await render('mj-loader-esm-default', cfg)
      expectComponentAndOptions(html, 'mj-loader-esm-default')
    })

    it('loads an ESM .mjmlconfig.js with export default ("type": "module")', async function () {
      write('esm-module/package.json', '{"type":"module"}')
      write('esm-module/comp.cjs', cjsComponent('mj-loader-esm-module'))
      const cfg = write(
        'esm-module/.mjmlconfig.js',
        'export default { packages: ["./comp.cjs"], options: { keepComments: false } }',
      )
      const { html } = await render('mj-loader-esm-module', cfg)
      expectComponentAndOptions(html, 'mj-loader-esm-module')
    })

    it('handleMjmlConfig returns a result for an ESM export default config', function () {
      write('esm-handle/comp.js', cjsComponent('mj-loader-esm-handle'))
      const cfg = write(
        'esm-handle/.mjmlconfig.js',
        'export default { packages: ["./comp.js"] }',
      )
      const result = handleMjmlConfig(cfg, () => {})
      chai.expect(result.success).to.deep.equal(['./comp.js'])
      chai.expect(result.failures).to.deep.equal([])
    })
  })

  describe('custom components', function () {
    it('registers an ESM component with a default export', async function () {
      write('comp-esm/comp.mjs', esmComponent('mj-loader-comp-esm'))
      const cfg = write('comp-esm/.mjmlconfig', '{"packages":["./comp.mjs"]}')
      const { html } = await render('mj-loader-comp-esm', cfg)
      chai.expect(html).to.include('mj-loader-comp-esm-rendered')
    })

    it('ignores non-object named exports of an ESM component', async function () {
      write(
        'comp-named/comp.mjs',
        esmComponent(
          'mj-loader-comp-named',
          "export const VERSION = '1.0'",
        ).replace('export default class', 'export class'),
      )
      const cfg = write('comp-named/.mjmlconfig', '{"packages":["./comp.mjs"]}')
      const result = handleMjmlConfig(cfg, () => {})
      chai.expect(result.success).to.deep.equal(['./comp.mjs'])
      chai.expect(result.failures).to.deep.equal([])
    })
  })

  describe('skeleton', function () {
    const renderWith = (skeleton) =>
      mjml('<mjml><mj-body><mj-text>x</mj-text></mj-body></mjml>', {
        skeleton,
        validationLevel: 'skip',
      })

    it('uses a skeleton function passed directly', async function () {
      const { html } = await renderWith((o) => `<html>sk-fn${o.content}</html>`)
      chai.expect(html).to.include('sk-fn')
    })

    it('loads a CommonJS skeleton file', async function () {
      const sk = write(
        'sk/cjs.js',
        'module.exports = (o) => "<html>sk-cjs" + o.content + "</html>"',
      )
      const { html } = await renderWith(sk)
      chai.expect(html).to.include('sk-cjs')
    })

    it('loads an ESM .mjs skeleton file', async function () {
      const sk = write(
        'sk/esm.mjs',
        'export default (o) => "<html>sk-mjs" + o.content + "</html>"',
      )
      const { html } = await renderWith(sk)
      chai.expect(html).to.include('sk-mjs')
    })

    it('loads a .js skeleton detected as ESM', async function () {
      const sk = write(
        'sk/esm-detected.js',
        'export default (o) => "<html>sk-esm-js" + o.content + "</html>"',
      )
      const { html } = await renderWith(sk)
      chai.expect(html).to.include('sk-esm-js')
    })

    it('keeps rejecting a transpiled CommonJS skeleton (exports.default)', async function () {
      const sk = write(
        'sk/transpiled.js',
        'exports.__esModule = true\nexports.default = (o) => "<html>" + o.content + "</html>"',
      )
      let error
      try {
        await renderWith(sk)
      } catch (e) {
        error = e
      }
      chai.expect(error).to.be.instanceOf(TypeError)
      chai.expect(error.message).to.equal('skeleton is not a function')
    })

    it('handles an extensionless CommonJS skeleton under "type": "module"', async function () {
      write('sk-module/package.json', '{"type":"module"}')
      const sk = write(
        'sk-module/skeleton',
        'module.exports = (o) => "<html>sk-extless" + o.content + "</html>"',
      )
      if (NODE_MAJOR < 26) {
        const { html } = await renderWith(sk)
        chai.expect(html).to.include('sk-extless')
        return
      }
      // Node 26+ loads it as ESM
      let error
      try {
        await renderWith(sk)
      } catch (e) {
        error = e
      }
      chai.expect(error).to.be.instanceOf(ReferenceError)
      chai.expect(error.message).to.include(`Skeleton "${sk}"`)
      chai.expect(error.message).to.include('Use `export default`')
    })
  })

  describe('CLI', function () {
    it('registers components from an ESM .mjmlconfig.js', async function () {
      write('cli/comp.js', cjsComponent('mj-loader-cli'))
      const cfg = write(
        'cli/.mjmlconfig.js',
        'export default { packages: ["./comp.js"], options: { keepComments: false } }',
      )
      const input = write('cli/input.mjml', template('mj-loader-cli'))
      const { stdout, stderr } = await run(process.execPath, [
        CLI_ENTRY,
        input,
        '-s',
        `--config.mjmlConfigPath=${cfg}`,
        '--config.useMjmlConfigOptions=true',
      ])
      expectComponentAndOptions(stdout, 'mj-loader-cli')
      // the validator knows the component, so nothing is reported
      chai.expect(stderr).to.equal('')
    })
  })
})
