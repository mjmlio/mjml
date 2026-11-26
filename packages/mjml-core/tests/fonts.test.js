const assert = require('assert')
const { buildFontsTags } = require('../lib/helpers/fonts')

describe('buildFontsTags', () => {
  it('escapes font URLs in link href attributes', () => {
    const url = 'https://fonts.example.test/font.css?a=1&b=" onload="alert(1)'
    const escapedUrl = 'https://fonts.example.test/font.css?a=1&amp;b=&quot; onload=&quot;alert(1)'
    const result = buildFontsTags('', ['font-family:Roboto'], { Roboto: url })

    assert.ok(
      result.includes(`<link href="${escapedUrl}" rel="stylesheet">`),
      result,
    )
  })
})
