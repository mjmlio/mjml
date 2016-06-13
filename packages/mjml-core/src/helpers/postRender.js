export const removeCDATA = str => str.replace(/<!--\[CDATA\[([^]*?)\]\]-->/gm, '$1')
export const importFonts = ($) => {
  return $
}

export const fixLegacyAttrs = $ => {
  const legacyAttrs = ['align', 'valign', 'bgcolor', 'border', 'background']

  // https://github.com/facebook/react/issues/140 ...
  // server side workaround to allow custom tags.
  legacyAttrs.forEach(attr => {
    const dataAttr = `data-legacy-${attr}`

    $(`[${dataAttr}]`).each(function () {
      $(this).attr(attr, $(this).attr(dataAttr))
      $(this).removeAttr(dataAttr)
    })
  })

  return $
}
