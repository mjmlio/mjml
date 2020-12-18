const mockFn = () => {
  console.warn('fs should not be used in browser build')
  return null
}

module.exports = {
  parse: mockFn,
  resolve: mockFn,
  join: mockFn,
  dirname: mockFn,
  isAbsolute: mockFn,
}
