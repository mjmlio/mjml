const { minify } = require('html-minifier-terser')

module.exports = async (html, options = {}) => {
  
  try {
    const safeOptions = {
      ...options,
      minifyCSS: options.minifyCSS !== undefined ? options.minifyCSS : true,
      minifyJS: false,
    }

    const defaultOptions = {
      collapseWhitespace: true,
      removeComments: true,
      removeOptionalTags: false,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeTagWhitespace: false,
      useShortDoctype: true,
      ...safeOptions,
    }

    const result = await minify(html, defaultOptions)
    
    return {
      result,
    }
  } catch (e) {
    return {
      result: html,
    }
  }
}