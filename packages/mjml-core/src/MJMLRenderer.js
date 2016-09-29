import { EmptyMJMLError, MJMLValidationError } from './Error'
import { fixLegacyAttrs, removeCDATA } from './helpers/postRender'
import { parseInstance } from './helpers/mjml'
import cloneDeep from 'lodash/cloneDeep'
import configParser from './parsers/config'
import curryRight from 'lodash/curryRight'
import documentParser from './parsers/document'
import defaultContainer from './configs/defaultContainer'
import defaultFonts from './configs/listFontsImports'
import dom from './helpers/dom'
import he from 'he'
import importFonts from './helpers/importFonts'
import includeExternal from './includeExternal'
import juice from 'juice'
import { html as beautify } from 'js-beautify'
import { minify } from 'html-minifier'
import MJMLValidator from 'mjml-validator'
import MJMLElementsCollection, { postRenders } from './MJMLElementsCollection'
import isBrowser from './helpers/isBrowser'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

const debug = require('debug')('mjml-engine/mjml2html')

const minifyHTML = htmlDocument => minify(htmlDocument, { collapseWhitespace: true, removeEmptyAttributes: true, minifyCSS: true })
const beautifyHTML = htmlDocument => beautify(htmlDocument, { indent_size: 2, wrap_attributes_indent_size: 2 })
const inlineExternal = (htmlDocument, css) => juice(htmlDocument, { extraCss: css, removeStyleTags: false, applyStyleTags: false, insertPreservedExtraCss: false })

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
    this.options["level"] = this.options["level"] || "soft"

    if (typeof this.content === 'string') {
      this.parseDocument()
    }
  }

  parseDocument () {
    this.content = includeExternal(this.content)

    debug('Start parsing document')
    this.content = documentParser(this.content, this.attributes, this.options)
    debug('Content parsed')
  }

  validate () {
    if (this.options.level == "skip") {
      return;
    }

    this.errors = MJMLValidator(this.content)

    if (this.options.level == "strict" && this.errors.length > 0) {
      throw new MJMLValidationError(this.errors)
    }
  }

  render () {
    if (!this.content) {
      throw new EmptyMJMLError(`.render: No MJML to render in options ${this.options.toString()}`)
    }

    debug('Validating markup')
    this.validate()

    const rootComponent = MJMLElementsCollection[this.content.tagName]

    if (!rootComponent) {
      return { errors: this.errors }
    }

    debug('Render to static markup')
    const rootElemComponent = React.createElement(rootComponent, { mjml: parseInstance(this.content, this.attributes ) })
    const renderedMJML = ReactDOMServer.renderToStaticMarkup(rootElemComponent)

    debug('React rendering done. Continue with special overrides.')
    const MJMLDocument = this.attributes.container.replace('__content__', renderedMJML)

    return { errors: this.errors, html: this.postRender(MJMLDocument) }
  }

  postRender (MJMLDocument) {
    const externalCSS = this.attributes.css.join('')

    let $ = dom.parseHTML(MJMLDocument)

    importFonts({ $, fonts: this.attributes.fonts })
    $ = fixLegacyAttrs($)

    postRenders.forEach(postRender => {
      if (typeof postRender === 'function') {
        $ = postRender($)
      }
    })

    return [ removeCDATA,
             curryRight(inlineExternal)(externalCSS),
             this.options.beautify ? beautifyHTML : undefined,
             this.options.minify ? minifyHTML : undefined,
             he.decode ].filter(element => typeof element == 'function')
                        .reduce((res, fun) => fun(res), dom.getHTML($))
  }

}
