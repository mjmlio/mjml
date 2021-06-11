const mockFn = () => {
  console.warn('fs should not be used in browser build') // eslint-disable-line no-console
  return null
}

module.exports = {
  parse: mockFn,
  resolve: mockFn,
  join: mockFn,
  dirname: mockFn,
  isAbsolute: mockFn,
}
