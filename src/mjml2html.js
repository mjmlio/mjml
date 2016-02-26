import _ from 'lodash'
import { EmptyMJMLError } from './Error'
import { html as beautify } from 'js-beautify'
import { minify } from 'html-minifier'
import { parseInstance } from './helpers/mjml'
import defaultStyle from './defaultStyle'
import documentParser from './documentParser'
import dom from './helpers/dom'
import MJMLElementsCollection from './MJMLElementsCollection'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

const debug = require('debug')('mjml-engine/mjml2html')

const mjml2html = (content, options = {}) => {
  let parsedContent = content

  if (typeof content == 'string') {
    debug('Start parsing content')
    parsedContent = documentParser(content)
    debug('Content parsed.')
  }

  debug('Start rendering')
  const html = render({ mjml: parsedContent, options })
  debug('Done rendering')

  return html
}

const removeCDATA = str => str.replace(/<!--\[CDATA\[(.*?)\]\]-->/g, '$1')

const insertColumnMediaQuery = $ => {
  const mediaQueries = []

  _.each({'mj-column-per': '%', 'mj-column-px': 'px'}, (unit, className) => {
    const columnWidths = []

    $(`[class*="${className}"]`).each(function () {
      columnWidths.push($(this).data('column-width'))
      $(this).removeAttr('data-column-width')
    })

    _.uniq(columnWidths).forEach((width) => {
      const mediaQueryClass = `${className}-${width}`

      mediaQueries.push(`.${mediaQueryClass}, * [aria-labelledby="${mediaQueryClass}"] { width:${width}${unit}!important; }`)
    })
  })

  const mediaQuery = `<style type="text/css">
    @media only screen and (min-width:480px) {
      ${mediaQueries.join('\n')}
    }
    </style>`

  $('head').append(mediaQuery)

  return $
}

const fixOutlookLayout = $ => {
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
    $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)
  })

  $('.mj-section-outlook-line').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td><td style="width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)
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
    const $insertNode = dom.createElement('<table></table>').attr('style', $(this).attr('style'))

    $(this)
      .removeClass('mj-divider-outlook')
      .after(`<!--[if mso]>${$insertNode}<![endif]-->`)
  })

  return $
}

const fixLegacyAttrs = $ => {
  const legacyAttrs = ['align', 'valign', 'bgcolor', 'border', 'background']

  $('#YIELD_MJML').css({ background: $('.mj-body').data('background-color') })
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

const clean = $ => {
  $('#YIELD_MJML').each(function () {
    $(this).removeAttr('id')

    if ($(this).attr('style') === '') {
      $(this).removeAttr('style')
    }
  })

  $('.mj-body')
    .removeAttr('class')
    .removeAttr('style')

  $('.mj-content').removeAttr('class')

  return $
}

const container = (title = '', content = '') => (
`<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>${title}</title>
<style type="text/css">${defaultStyle}</style>
<!--[if !mso]><!-->
<style type="text/css">
  @import url(https://fonts.googleapis.com/css?family=Ubuntu:400,500,700,300);
</style>
<style type="text/css">
  @media only screen and (max-width:480px) {
    @-ms-viewport { width:320px; }
    @viewport { width:320px; }
  }
</style>
<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700,300" rel="stylesheet" type="text/css">
<!--<![endif]-->
</head>
<body id="YIELD_MJML">
  ${content}
</body>
</html>`
)

const render = ({ mjml, options }) => {
  let content = ''

  if (mjml) {
    debug('Create root React element')
    const rootElemComponent = React.createElement(MJMLElementsCollection[mjml.tagName.substr(3)], { mjml: parseInstance(mjml) })

    debug('Render to static markup')
    content = ReactDOMServer.renderToStaticMarkup(rootElemComponent)
  } else {
    throw (new EmptyMJMLError(`.render: No MJML to render in options ${options.toString()}`))
  }

  debug('React rendering done. Continue with special overrides.')
  let $ = dom.parseHTML(container(options.title, content))

  $('.mj-raw').each(function () {
    $(this).replaceWith($(this).html())
  })

  $ = insertColumnMediaQuery($)
  $ = fixLegacyAttrs($)
  $ = fixOutlookLayout($)
  $ = clean($)

  let html = removeCDATA(dom.getHTML($))

  if (options.beautify) {
    html = beautify(html, {
      indent_size: 2,
      wrap_attributes_indent_size: 2
    })
  }

  if (options.minify) {
    html = minify(html, {
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      minifyCSS: true
    })
  }

  return html
}

export default mjml2html
