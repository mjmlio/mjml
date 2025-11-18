module.exports = {}
module.exports.default = {}

// Stub common properties that might be accessed
if (typeof global !== 'undefined') {
  global.process = global.process || {}
  global.process.env = global.process.env || {}
}
