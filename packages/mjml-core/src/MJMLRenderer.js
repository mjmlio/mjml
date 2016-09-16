import { EmptyMJMLError } from './Error'
import { fixLegacyAttrs, removeCDATA } from './helpers/postRender'
import { parseInstance } from './helpers/mjml'
import cloneDeep from 'lodash/cloneDeep'
import configParser from './parsers/config'
import documentParser from './parsers/document'
import defaultContainer from './configs/defaultContainer'
import defaultFonts from './configs/listFontsImports'
import he from 'he'
import importFonts from './helpers/importFonts'
import includeExternal from './includeExternal'
import juice from 'juice'
import MJMLElementsCollection, { postRenders } from './MJMLElementsCollection'
import isBrowser from './helpers/isBrowser'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

const debug = require('debug')('mjml-engine/mjml2html')

export default class MJMLRenderer {

  constructor (content, options = {}) {
    if (!isBrowser) {
      configParser()
    }

    this.attributes = {
      container: defaultContainer(),
      defaultAttributes: {},
      cssClasses: {},
      css: [],
      fonts: cloneDeep(defaultFonts)
    }

    this.content = content
    this.options = options
    this.options["level"] = this.options["level"] || "strict"

    if (typeof this.content === 'string') {
      this.parseDocument()
    }
  }

  parseDocument () {
    this.content = includeExternal(this.content)

    debug('Start parsing document')
    const { html, errors } = documentParser(this.content, this.attributes, this.options)

    this.content = html
    this.errors = errors
    debug('Content parsed')
  }

  render () {
    if (!this.content) {
      throw new EmptyMJMLError(`.render: No MJML to render in options ${this.options.toString()}`)
    }

    const rootElemComponent = React.createElement(MJMLElementsCollection[this.content.tagName], { mjml: parseInstance(this.content, this.attributes ) })

    debug('Render to static markup')
    const renderedMJML = ReactDOMServer.renderToStaticMarkup(rootElemComponent)

    debug('React rendering done. Continue with special overrides.')
    const MJMLDocument = this.attributes.container.replace('__content__', renderedMJML)

    return { errors: this.errors, html: this.postRender(MJMLDocument) }
  }

  postRender (MJMLDocument) {
    const dom = require('./helpers/dom').default

    let $ = dom.parseHTML(MJMLDocument)

    importFonts({ $, fonts: this.attributes.fonts })
    $ = fixLegacyAttrs($)

    postRenders.forEach(postRender => {
      if (typeof postRender === 'function') {
        $ = postRender($)
      }
    })

    let finalMJMLDocument = dom.getHTML($)
    finalMJMLDocument     = removeCDATA(finalMJMLDocument)

    finalMJMLDocument = juice(finalMJMLDocument, {
      extraCss: `${this.attributes.css.join('')}`,
      removeStyleTags: false,
      applyStyleTags: false,
      insertPreservedExtraCss: false
    })

    if (this.options.beautify) {
      const beautify = require('js-beautify').html

      finalMJMLDocument = beautify(finalMJMLDocument, {
        indent_size: 2,
        wrap_attributes_indent_size: 2
      })
    }

    if (this.options.minify) {
      const minify = require('html-minifier').minify

      finalMJMLDocument = minify(finalMJMLDocument, {
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        minifyCSS: true
      })
    }

    finalMJMLDocument = he.decode(finalMJMLDocument)

    return finalMJMLDocument
  }

}
