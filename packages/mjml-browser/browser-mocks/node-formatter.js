/**
 * Browser mock: keep the same formatter API but do not bundle Node-only formatters.
 * @param {string} html - HTML content to format
 * @returns {Promise<string>} formatted HTML
 */
async function formatHtml(html) {
  return html
}

module.exports = {
  formatHtml,
}


