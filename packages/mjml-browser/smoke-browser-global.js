const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const vm = require('vm')

const bundlePath = path.resolve(__dirname, './lib/index.js')

// Templates exercising paths that depend on bundled third-party code (e.g., cheerio)
const featureFixtures = [
  {
    name: 'plain template with minify',
    mjml: `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello World!</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
    options: {
      minify: true,
      minifyOptions: {
        collapseWhitespace: true,
        minifyCSS: true,
        removeComments: true,
      },
    },
    assertHtml: (html) =>
      assert.ok(
        html.includes('Hello World!'),
        'Expected rendered output to include test content',
      ),
  },
  {
    name: 'mj-html-attributes',
    mjml: `
      <mjml>
        <mj-head>
          <mj-html-attributes>
            <mj-selector path=".smoke-text div">
              <mj-html-attribute name="data-smoke">html-attributes</mj-html-attribute>
            </mj-selector>
          </mj-html-attributes>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text css-class="smoke-text">Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
    options: {},
    assertHtml: (html) =>
      assert.ok(
        html.includes('data-smoke="html-attributes"'),
        'Expected mj-html-attributes to add data-smoke to the selected element',
      ),
  },
  {
    name: 'mj-style inline',
    mjml: `
      <mjml>
        <mj-head>
          <mj-style inline="inline">.smoke-inline { color: red; }</mj-style>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text><span class="smoke-inline">Hello</span></mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
    options: {},
    assertHtml: (html) =>
      assert.match(
        html,
        /<span class="smoke-inline" style="color: ?red;?">/,
        'Expected mj-style inline="inline" to inline the CSS rule',
      ),
  },
]

async function renderFixture(mjml2html, loadingMode, fixture) {
  let result
  try {
    result = await mjml2html(fixture.mjml, fixture.options)
  } catch (error) {
    throw new Error(
      `[${loadingMode}] ${fixture.name} failed to render: ${error && error.message}`,
    )
  }
  assert.ok(
    result && typeof result.html === 'string',
    `[${loadingMode}] ${fixture.name}: expected mjml to resolve with an html string`,
  )
  fixture.assertHtml(result.html)
}

// Render one fixture at a time, so a failure points at a single fixture.
async function renderFeatureFixtures(mjml2html, loadingMode) {
  await featureFixtures.reduce(
    (previousRender, fixture) =>
      previousRender.then(() => renderFixture(mjml2html, loadingMode, fixture)),
    Promise.resolve(),
  )
}

// Load the bundle with require() from a folder that has no node_modules, as if
// mjml-browser had been installed alone (in the monorepo, missing dependencies
// would resolve from the root node_modules and hide the problem).
async function runIsolatedRequire(bundleBuffer) {
  const isolatedDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'mjml-browser-smoke-'),
  )
  try {
    const isolatedBundlePath = path.join(isolatedDir, 'index.js')
    fs.writeFileSync(isolatedBundlePath, bundleBuffer)

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const bundleExports = require(isolatedBundlePath)
    const mjml2html = bundleExports.default || bundleExports
    assert.strictEqual(
      typeof mjml2html,
      'function',
      'Expected require("mjml-browser") to export the mjml function',
    )

    await renderFeatureFixtures(mjml2html, 'isolated require')
  } finally {
    fs.rmSync(isolatedDir, { recursive: true, force: true })
  }
}

function assertAsciiOnly(buffer) {
  let nonAsciiCount = 0
  const firstOffenders = []

  for (let i = 0; i < buffer.length; i += 1) {
    const byte = buffer[i]
    if (byte > 0x7f) {
      nonAsciiCount += 1
      if (firstOffenders.length < 5) {
        firstOffenders.push(`offset ${i} (0x${byte.toString(16)})`)
      }
    }
  }

  assert.strictEqual(
    nonAsciiCount,
    0,
    `mjml-browser bundle contains ${nonAsciiCount} non-ASCII bytes (${firstOffenders.join(', ')}). `
      + 'This can break browser parsing when a page does not explicitly declare UTF-8.',
  )
}

function createBrowserContext() {
  const context = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
    URL,
    location: { href: 'http://localhost/test/mjml-browser.html' },
    navigator: { userAgent: 'node.js' },
  }

  if (typeof TextEncoder !== 'undefined') context.TextEncoder = TextEncoder
  if (typeof TextDecoder !== 'undefined') context.TextDecoder = TextDecoder
  if (typeof Blob !== 'undefined') context.Blob = Blob

  context.window = context
  context.self = context
  context.globalThis = context

  return context
}

async function run() {
  const bundleBuffer = fs.readFileSync(bundlePath)
  assertAsciiOnly(bundleBuffer)

  const bundleCode = bundleBuffer.toString('utf8')
  const context = createBrowserContext()

  vm.runInNewContext(bundleCode, context, { filename: 'lib/index.js' })

  assert.strictEqual(
    typeof context.mjml,
    'function',
    'Expected browser bundle to expose window.mjml as a function',
  )

  await renderFeatureFixtures(context.mjml, 'browser global')
  await runIsolatedRequire(bundleBuffer)

  // eslint-disable-next-line no-console
  console.log('mjml-browser smoke test passed')
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error && (error.stack || error))
  process.exit(1)
})
