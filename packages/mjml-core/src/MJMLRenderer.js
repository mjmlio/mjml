import { EmptyMJMLError } from './Error'
import { fixLegacyAttrs, removeCDATA } from './helpers/postRender'
import { parseInstance } from './helpers/mjml'
import cloneDeep from 'lodash/cloneDeep'
import defaultContainer from './configs/defaultContainer'
import defaultFonts from './configs/listFontsImports'
import he from 'he'
import importFonts from './helpers/importFonts'
import includeExternal from './includeExternal'
import isEmpty from 'lodash/isEmpty'
import MJMLElementsCollection, { postRenders, registerMJElement } from './MJMLElementsCollection'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import warning from 'warning'

const debug = require('debug')('mjml-engine/mjml2html')

export default class MJMLRenderer {

  constructor (content, options = {}) {
    this.registerDotfile()

    this.attributes = {
      container: defaultContainer(),
      defaultAttributes: {},
      cssClasses: {},
      fonts: cloneDeep(defaultFonts)
    }

    this.content = content
    this.options = options

    if (typeof this.content === 'string') {
      this.content = includeExternal(this.content)
      this.parseDocument()
    }
  }

  registerDotfile () {
    const fs = require('fs')
    const path = process.cwd()

    try {
      fs.statSync(`${path}/.mjmlconfig`)
    } catch (e) {
      return warning(!isEmpty(MJMLElementsCollection), `No .mjmlconfig found in path ${path}, consider to add one`)
    }

    try {
      const mjmlConfig = JSON.parse(fs.readFileSync(`${path}/.mjmlconfig`).toString())
      const { packages } = mjmlConfig

      packages.forEach(file => {
        if (!file) {
          return
        }

        try {
          const Component = require.main.require(file)
          registerMJElement(Component.default || Component)
        } catch (e) {
          warning(false, `.mjmlconfig file ${file} opened from ${path} has an error : ${e}`)
        }
      })
    } catch (e) {
      warning(false, `.mjmlconfig has a ParseError: ${e}`)
    }
  }

  parseDocument () {
    const documentParser = require('./parsers/document').default

    debug('Start parsing document')
    this.content = documentParser(this.content, this.attributes)
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

    return this.postRender(MJMLDocument)
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
