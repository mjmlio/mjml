const { html: beautify } = require('js-beautify')

const DEFAULT_BEAUTIFY_OPTIONS = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: 0,
  preserve_newlines: false,
  unformatted: [],
  wrap_line_length: 0,
  wrap_attributes: 'auto',
}

/**
 * Format HTML using js-beautify.
 * Content before <!doctype html> (from mj-raw position="file-start") is split
 * off before passing to the formatter so arbitrary prefixes are not corrupted.
 * @param {string} html - HTML content to format (in-memory)
 * @param {object} [beautifyOptions] - js-beautify options override
 * @returns {string} formatted HTML
 */
function formatHtml(html, beautifyOptions = DEFAULT_BEAUTIFY_OPTIONS) {
  const doctypeIndex = html.search(/<!doctype\s/i)
  const prefix = doctypeIndex > 0 ? html.slice(0, doctypeIndex) : ''
  const body = doctypeIndex > 0 ? html.slice(doctypeIndex) : html

  return prefix + beautify(body, beautifyOptions)
}

export { DEFAULT_BEAUTIFY_OPTIONS, formatHtml }

export default {
  formatHtml,
}
