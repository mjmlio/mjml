import { EmptyMJMLError, MJMLValidationError } from './Error'
import { fixLegacyAttrs, insertHeadCSS } from './helpers/postRender'
import { parseInstance } from './helpers/mjml'
import cloneDeep from 'lodash/cloneDeep'
import configParser from './parsers/config'
import curryRight from 'lodash/curryRight'
import each from 'lodash/each'
import find from 'lodash/find'
import documentParser from './parsers/document'
import defaults from 'lodash/defaults'
import defaultContainer from './configs/defaultContainer'
import defaultFonts from './configs/listFontsImports'
import dom from './helpers/dom'
import he from 'he'
import importFonts from './helpers/importFonts'
import includeExternal from './includeExternal'
import { html as beautify } from 'js-beautify'
import MJMLValidator from 'mjml-validator'
import MJMLElementsCollection, { postRenders } from './MJMLElementsCollection'
import MJMLHeadElements from './MJMLHead'
import isBrowser from './helpers/isBrowser'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import warning from 'warning'

const DANGEROUS_CHARS = ['{{', '}}', '<%', '%>', '<=', '=>', '<- ', ' ->', '{%', '%}', '{{{', '}}}']
const SEED = Math.floor(Math.random() * 0x10000000000).toString(16)
const PLACEHOLDER = `__MJML__${SEED}__`
const mjmlSanitizer = (mjml) => {
  if (mjml.children && mjml.children) {
    each(mjml.children, mjmlSanitizer)
  }

  if (mjml.content) {
    mjml.content = sanitizer(mjml.content)
  }
}

const sanitizer = (text) => DANGEROUS_CHARS.reduce((content, char, index) => content.replace(new RegExp(char, 'g'), `${PLACEHOLDER}${index}`), text)
const restore = (text) => DANGEROUS_CHARS.reduce((content, char, index) => content.replace(new RegExp(`${PLACEHOLDER}${index}`, 'g'), char), text)

const getMJBody = (root) => find(root.children, ['tagName', 'mj-body'])
const getMJHead = (root) => find(root.children, ['tagName', 'mj-head'])

const minifyHTML = htmlDocument => {
  const { minify } = require('html-minifier')

  return minify(htmlDocument, { collapseWhitespace: true, removeEmptyAttributes: true, minifyCSS: true })
}
const beautifyHTML = htmlDocument => beautify(htmlDocument, { indent_size: 2, wrap_attributes_indent_size: 2 })
const inlineExternal = (htmlDocument, css) => {
  if (!css || css.length == 0) {
    return htmlDocument
  }

  const juice = require('juice')

  return juice(htmlDocument, { extraCss: css.join('\n'), removeStyleTags: false, applyStyleTags: false, insertPreservedExtraCss: false })
}

export default class MJMLRenderer {

  constructor (content, options = {}) {
    if (!isBrowser()) {
      configParser(options)
    }

    this.attributes = {
      container: defaultContainer(),
      defaultAttributes: {},
      cssClasses: {},
      css: [],
      inlineCSS: [],
      fonts: cloneDeep(defaultFonts)
    }

    this.content = content
    this.options = defaults(options, { level: "soft", disableMjStyle: false, disableMjInclude: false, disableMinify: false })

    if (typeof this.content === 'string') {
      this.parseDocument()
    }
  }

  parseDocument () {
    if (!this.options.disableMjInclude) {
      this.content = includeExternal(this.content, this.options)
    }

    this.content = documentParser(this.content)
  }

  validate (root) {
    if (this.options.level == "skip") {
      this.errors = []
      return;
    }

    this.errors = MJMLValidator(root)

    if (this.options.level == "strict" && this.errors.length > 0) {
      throw new MJMLValidationError(this.errors)
    }
  }

  render () {
    if (!this.content || !getMJBody(this.content)) {
      throw new EmptyMJMLError(`.render: No MJML to render in options ${this.options.toString()}`)
    }

    mjmlSanitizer(this.content)

    const body = getMJBody(this.content)
    const head = getMJHead(this.content)

    if (head && head.children.length > 0) {
      each(head.children, (headElement) => {
        const handlerName = headElement.tagName
        const handler = MJMLHeadElements[handlerName]

        if (handler) {
          handler(headElement, this.attributes)
        } else {
          warning(false, `No handler found for: ${handlerName}, in mj-head, skipping it`)
        }

      })
    }

    const rootElement = body.children[0]

    this.validate(rootElement)

    const rootComponent = MJMLElementsCollection[rootElement.tagName]

    if (!rootComponent) {
      return { errors: this.errors }
    }

    const rootElemComponent = React.createElement(rootComponent, { mjml: parseInstance(rootElement, this.attributes ) })
    const renderedMJML = ReactDOMServer.renderToStaticMarkup(rootElemComponent)

    const MJMLDocument = this.attributes.container
      .replace('__content__', renderedMJML || '')
      .replace('__title__', this.attributes.title || '')
      .replace('__preview__', this.attributes.preview || '')

    return { errors: this.errors, html: this.postRender(MJMLDocument) }
  }

  postRender (MJMLDocument) {
    const externalCSS = this.attributes.inlineCSS

    let $ = dom.parseHTML(MJMLDocument)

    importFonts({ $, fonts: this.attributes.fonts })

    $ = fixLegacyAttrs($)
    $ = insertHeadCSS($, this.attributes.css)

    postRenders.forEach(postRender => {
      if (typeof postRender === 'function') {
        $ = postRender($)
      }
    })

    return [ !this.options.disableMjStyle ? curryRight(inlineExternal)(externalCSS) : undefined,
      this.options.beautify ? beautifyHTML : undefined,
      !this.options.disableMinify && this.options.minify ? minifyHTML : undefined,
      he.decode,
      restore ].filter(element => typeof element == 'function')
               .reduce((res, fun) => fun(res), dom.getHTML($))
  }

}
