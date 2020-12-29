module.exports = {
  readFileSync: () => {
    console.warn('fs should not be used in browser build') // eslint-disable-line no-console
    return null
  },
}
