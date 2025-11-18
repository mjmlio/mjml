// Mock htmlnano for browser - just returns HTML unchanged
module.exports = {
  process: function (html, options) {
    return Promise.resolve({ html: html })
  },
}

module.exports.default = module.exports
