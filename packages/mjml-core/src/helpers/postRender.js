export const insertHeadCSS = ($, headCSS) => {
  if (!headCSS || headCSS.length == 0) {
    return $
  }

  $('head').append(`<style type="text/css">${headCSS.join('')}</style>`)

  return $
}

export const fixLegacyAttrs = $ => {
  const legacyAttrs = [
    'align', 
    'background',
    'bgcolor', 
    'border', 
    'colspan',
    'rowspan',
    'valign'
  ]

  // https://github.com/facebook/react/issues/140 ...
  // server side workaround to allow custom tags.
  legacyAttrs.forEach(attr => {
    const dataAttr = `data-legacy-${attr}`

    $(`[${dataAttr}]`).each(function () {
      $(this).attr(attr, $(this).attr(dataAttr))
      $(this).removeAttr(dataAttr)
    })
  })

  $('*[class=""]').removeAttr('class')

  return $
}
