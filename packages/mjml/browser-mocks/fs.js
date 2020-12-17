module.exports = {
  readFileSync: () => {
    console.warn('fs should not be used in browser build')
    return null
  }
}
