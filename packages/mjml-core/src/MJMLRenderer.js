import cloneDeep from 'lodash/cloneDeep'
import curryRight from 'lodash/curryRight'
import defaults from 'lodash/defaults'
import he from 'he'
import { html as beautify } from 'js-beautify'
import MJMLValidator from 'mjml-validator'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { EmptyMJMLError, MJMLValidationError } from './Error'
import { fixLegacyAttrs, removeCDATA } from './helpers/postRender'
import { parseInstance } from './helpers/mjml'
import configParser from './parsers/config'
import documentParser from './parsers/document'
import defaultContainer from './configs/defaultContainer'
import defaultFonts from './configs/listFontsImports'
import dom from './helpers/dom'
import importFonts from './helpers/importFonts'
import includeExternal from './includeExternal'
import MJMLElementsCollection, { postRenders } from './MJMLElementsCollection'
import isBrowser from './helpers/isBrowser'

const debug = require('debug')('mjml-engine/mjml2html')

const minifyHTML = htmlDocument => {
  const { minify } = require('html-minifier')

  return minify(htmlDocument, { collapseWhitespace: true, removeEmptyAttributes: true, minifyCSS: true })
}
const beautifyHTML = htmlDocument => beautify(htmlDocument, { indent_size: 2, wrap_attributes_indent_size: 2 })
const inlineExternal = (htmlDocument, css) => {
  const juice = require('juice')

  return juice(htmlDocument, {
    extraCss: css,
    removeStyleTags: false,
    applyStyleTags: false,
    insertPreservedExtraCss: false
  })
}

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
    this.options = defaults(options, {
      level: "soft",
      disableMjStyle: false,
      disableMjInclude: false,
      disableMinify: false
    })

    if (typeof this.content === 'string') {
      this.parseDocument()
    }
  }

  parseDocument () {
    if (!this.options.disableMjInclude) {
      this.content = includeExternal(this.content)
    }

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
    const rootElemComponent = React.createElement(rootComponent, { mjml: parseInstance(this.content, this.attributes) })
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

    return [
      removeCDATA,
      !this.options.disableMjStyle ? curryRight(inlineExternal)(externalCSS) : undefined,
      this.options.beautify ? beautifyHTML : undefined,
      !this.options.disableMinify && this.options.minify ? minifyHTML : undefined,
      he.decode
    ]
      .filter(element => typeof element == 'function')
      .reduce((res, fun) => fun(res), dom.getHTML($))
  }

}
