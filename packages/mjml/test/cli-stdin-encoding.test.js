const chai = require('chai')
const { PassThrough } = require('stream')
const readStream = require('../../mjml-cli/lib/commands/readStream')

describe('mjml CLI stdin decoding', function () {
  const originalStdin = Object.getOwnPropertyDescriptor(process, 'stdin')

  afterEach(function () {
    Object.defineProperty(process, 'stdin', originalStdin)
  })

  it('decodes multi-byte characters split across chunks', async function () {
    const fakeStdin = new PassThrough()
    Object.defineProperty(process, 'stdin', {
      value: fakeStdin,
      configurable: true,
    })

    // é = 2 bytes (C3 A9), U+1F600 = 4 bytes (F0 9F 98 80)
    const input = '<mj-text>é\u{1F600}</mj-text>'
    const bytes = Buffer.from(input)

    const result = readStream()
    // Split inside each multi-byte sequence: between C3|A9 and F0 9F|98 80
    const splitE = bytes.indexOf(0xc3) + 1
    const splitEmoji = bytes.indexOf(0xf0) + 2
    fakeStdin.write(bytes.subarray(0, splitE))
    fakeStdin.write(bytes.subarray(splitE, splitEmoji))
    fakeStdin.write(bytes.subarray(splitEmoji))
    fakeStdin.end()

    const { mjml } = await result
    chai.expect(mjml).to.equal(input)
  })
})
