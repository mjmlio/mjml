/**
 * Browser mock: keep the same formatter API but do not bundle Node-only formatters.
 * @param {string} html - HTML content to format
 * @returns {string} formatted HTML
 */
function formatHtml(html) {
  return html
}

module.exports = {
  formatHtml,
}


