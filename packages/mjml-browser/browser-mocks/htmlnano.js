// eslint-disable-next-line import/no-unresolved
const minifyMock = require('minify')

module.exports = {
  async process(html, options = {}) {
    const minified = await minifyMock(html, options)
    return {
      html: minified.result,
    }
  },
}