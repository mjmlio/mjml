import each from 'lodash/each'
import uniq from 'lodash/uniq'

export const removeCDATA = str => str.replace(/<!--\[CDATA\[([^]*?)\]\]-->/gm, '$1')

export const insertColumnMediaQuery = $ => {
  const mediaQueries = []

  each({'mj-column-per': '%', 'mj-column-px': 'px'}, (unit, className) => {
    const columnWidths = []

    $(`[class*="${className}"]`).each(function () {
      columnWidths.push($(this).data('column-width'))
      $(this).removeAttr('data-column-width')
    })

    uniq(columnWidths).forEach((width) => {
      const mediaQueryClass = `${className}-${width}`

      mediaQueries.push(`.${mediaQueryClass}, * [aria-labelledby="${mediaQueryClass}"] { width:${width}${unit}!important; }`)
    })
  })

  if (mediaQueries.length > 0) {
    const mediaQuery = `<style type="text/css">
  @media only screen and (min-width:480px) {
    ${mediaQueries.join('\n')}
  }
</style>\n`

    $('head').append(mediaQuery)
  }

  return $
}

export const fixOutlookLayout = $ => {
  const bodyWidth = $('.mj-body').data('width')

  $('.mj-body').removeAttr('data-width')

  $('.mj-section-outlook-background').each(function () {
    const url = $(this).data('url')
    const width = $(this).data('width')

    $(this)
      .removeAttr('class')
      .removeAttr('data-url')
      .removeAttr('data-width')

    if (!url) {
      return
    }

    $(this).before(`<!--[if gte mso 9]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${width}px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="${url}" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->`)

    $(this).after(`<!--[if gte mso 9]>
        </v:textbox>
      </v:rect>
      <![endif]-->`)
  })

  $('.mj-body-outlook-open').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0" width="${bodyWidth}" align="center" style="width:${bodyWidth}px;"><tr><td>
      <![endif]-->`)
  })

  $('.mj-body-outlook-line').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->
      <!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0" width="${bodyWidth}" align="center" style="width:${bodyWidth}px;"><tr><td>
      <![endif]-->`)
  })

  $('.mj-body-outlook-close').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->`)
  })

  $('.mj-section-outlook-open').each(function () {
    const $columnDiv = $(this).next()

    $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)

    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-section-outlook-line').each(function () {
    const $columnDiv = $(this).next()

    $(this).replaceWith(`<!--[if mso]>
    </td><td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)

    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-section-outlook-close').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->`)
  })

  $('.mj-social-outlook-open').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0" align="center"><tr><td>
      <![endif]-->`)
  })

  $('.mj-social-outlook-line').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td><td>
      <![endif]-->`)
  })

  $('.mj-social-outlook-close').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->`)
  })

  $('.mj-divider-outlook').each(function () {
    const insertNode = `<table align="center" border="0" cellpadding="0" cellspacing="0" style="${$(this).attr('style')}" width="${$(this).data('divider-width')}"><tr><td>&nbsp;</td></tr></table>`

    $(this).removeAttr('data-divider-width')

    $(this)
      .removeAttr('class')
      .after(`<!--[if mso]>${insertNode}<![endif]-->`)
  })

  return $
}

export const fixLegacyAttrs = $ => {
  const legacyAttrs = ['align', 'valign', 'bgcolor', 'border', 'background']

  $('body').css({ background: $('.mj-body').data('background-color') })
  $('.mj-body').removeAttr('data-background-color')

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

export const clean = $ => {
  $('body').each(function () {
    if ($(this).attr('style') === '') {
      $(this).removeAttr('style')
    }
  })

  $('.mj-body')
    .removeAttr('class')
    .removeAttr('style')

  $('.mj-raw').each(function () {
    $(this).replaceWith($(this).html())
  })

  return $
}
