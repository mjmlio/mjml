const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const bundlePath = path.resolve(__dirname, './lib/index.js')

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

  const result = await context.mjml(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>Hello World!</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `, {
    minify: true,
    minifyOptions: {
      collapseWhitespace: true,
      minifyCSS: true,
      removeComments: true,
    },
  })

  assert.ok(result && typeof result.html === 'string', 'Expected mjml to resolve with an html string')
  assert.ok(result.html.includes('Hello World!'), 'Expected rendered output to include test content')

  // eslint-disable-next-line no-console
  console.log('mjml-browser smoke test passed')
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error && (error.stack || error))
  process.exit(1)
})
