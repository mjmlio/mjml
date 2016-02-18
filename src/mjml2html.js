import cheerio from "cheerio";
import defaultStyle from "./defaultStyle"
import documentParser from "./documentParser";
import MJMLElementsCollection from "./MJMLElementsCollection";
import { EmptyMJMLError } from './Error';

import React from "react";
import ReactDOMServer from "react-dom/server";
import _ from "lodash";

const debug = require("debug")("mjml-engine/mjml2html");

const internals = {
  mjml2html(content, options = {}) {
    let parsedContent = content

    if (typeof content == "string") {
      debug("Start parsing content")
      parsedContent = documentParser(content)
      debug("Content parsed.")
    }

    debug("Start rendering")
    const render = internals.render({mjml: parsedContent, options})
    debug("Done rendering")

    return render
  },

  render({ mjml, options }) {
    const elem  = mjml
    let content = ""

    if (elem) {
      const propsElement = {
        key: 0,
        elem: elem
      }

      debug("Create root React element")
      const rootElemComponent = React.createElement(MJMLElementsCollection[elem.tagName.substr(3)], propsElement)

      debug("Render to static markup")
      content = ReactDOMServer.renderToStaticMarkup(rootElemComponent)
    } else {
      throw (new EmptyMJMLError('.render: No MJML to render in options ' + options.toString()))
    }

    debug("React rendering done. Continue with special overrides.")

    const $ = cheerio.load(internals.container(options.title), {decodeEntities: false})

    $("#YIELD_MJML").html(content)
    $(".mj-raw").each(function() {
      $(this).replaceWith($(this).html())
    })

    internals.insertColumnMediaQuery($)
    internals.fixLegacyAttrs($)
    internals.fixOutlookLayout($)

    return $.html()
  },

  insertColumnMediaQuery($) {
    const mediaQuery = $(`<style type="text/css">
    @media only screen and (min-width:480px) {
    </style>`)

    _.each({"mj-column-per": "%", "mj-column-px": "px"}, (unit, className) => {
      const columnWidths = []

      $(`[class*='${className}']`).each(function() {
        columnWidths.push($(this).data('column-width'))
        $(this).removeAttr('data-column-width')
      })

      _.uniq(columnWidths).forEach((width) => {
        const mediaQueryClass = `${className}-${width}`

        mediaQuery.append(`.${mediaQueryClass}, * [aria-labelledby="${mediaQueryClass}"] { width:${width}${unit}!important; }\n`)
      })
    })

    mediaQuery.append(`}`)

    $('head').append(mediaQuery)
  },

  fixOutlookLayout($) {
    const bodyWidth = $('.mj-body').data('width')
    $('.mj-body').removeAttr('data-width')

    $(".outlook-background-fix-open").each(function() {
      const url = $(this).data('url')
      const width = $(this).data('width')

      $(this).removeClass('outlook-background-fix-open')
             .removeAttr('data-url')
             .removeAttr('data-width')

      if (!url) {
        return;
      }

      $(this).before(`
          <!--[if gte mso 9]>
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${width}px;">
            <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="${url}" />
            <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
          <![endif]-->`)

      $(this).after(`
        <!--[if gte mso 9]>
          </v:textbox>
        </v:rect>
        <![endif]-->
      `)
    })

    $(".mj-body-outlook-open").each(function() {
      $(this).replaceWith(`<!--[if mso]>
  		<table border="0" cellpadding="0" cellspacing="0" width="${bodyWidth}" align="center" style="width:${bodyWidth}px;"><tr><td>
  		<![endif]-->`)
    })

    $(".mj-body-outlook-line").each(function() {
      $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
  		<![endif]-->
  		<!--[if mso]>
  		<table border="0" cellpadding="0" cellspacing="0" width="${bodyWidth}" align="center" style="width:${bodyWidth}px;"><tr><td>
  		<![endif]-->`)
    })

    $(".mj-body-outlook-close").each(function() {
      $(this).replaceWith(`<!--[if mso]>
  		</td></tr></table>
  		<![endif]-->`)
    })

    $(".mj-section-outlook-open").each(function() {
      $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)
    })

    $(".mj-section-outlook-line").each(function() {
      $(this).replaceWith(`<!--[if mso]>
      </td><td style="width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)
    })

    $(".mj-section-outlook-close").each(function() {
      $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->`)
    })

    $(".mj-social-outlook-open").each(function() {
      $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0" align="center"><tr><td>
      <![endif]-->`)
    })

    $(".mj-social-outlook-line").each(function() {
      $(this).replaceWith(`<!--[if mso]>
        </td><td>
        <![endif]-->`)
    })

    $(".mj-social-outlook-close").each(function() {
      $(this).replaceWith(`<!--[if mso]>
      	</td></tr></table>
      	<![endif]-->`)
    })

    $(".outlook-divider-fix").each(function() {
      const $insertNode = $('<table></table>').css($(this).css())

      $(this).removeClass("outlook-divider-fix")
             .after(`<!--[if mso]>${$insertNode}<![endif]-->`)
    })
  },

  fixLegacyAttrs($) {
    const legacyAttrs = ["align", "valign", "bgcolor", "border", "background"]

    $("#YIELD_MJML").css({background: $(".mj-body").data('background-color')})
    $(".mj-body").removeAttr('data-background-color')

    // https://github.com/facebook/react/issues/140 ...
    // server side workaround to allow custom tags.
    legacyAttrs.forEach((attr) => {
      const dataAttr = `data-legacy-${attr}`

      $(`[${dataAttr}]`).each(function() {
        $(this).attr(attr, $(this).attr(dataAttr))
        $(this).removeAttr(dataAttr)
      });
    })
  },

  container(title = '') {
    return `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <title>${title}</title>
  <style type="text/css">
    ${defaultStyle}
  </style>
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
</body>
</html>
`;
  }
}

export default internals.mjml2html;
