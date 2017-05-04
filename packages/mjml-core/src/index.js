import forEach from 'lodash/forEach'
import identity from 'lodash/identity'
import juice from 'juice'
import {
  html as htmlBeautify,
} from 'js-beautify'
import {
  minify as htmlMinify,
} from 'html-minifier'
import map from 'lodash/map'
import omit from 'lodash/omit'
import parseXML from 'mjml-parser-xml'
import MJMLValidator from 'mjml-validator'
import reduce from 'lodash/reduce'

import components, {
  initComponent,
  registerComponent,
  getFlattenComponents,
} from './components'

import mergeOutlookConditionnals from './helpers/mergeOutlookConditionnals'
import skeleton from './helpers/skeleton'
import traverseMJML from './helpers/traverseMJML'

class ValidationError extends Error {
  constructor(message, errors) {
    super(message)
    this.errors = errors
  }
}

export default function mjml2html (mjml, options = {}) {
  let content = ''
  let errors = []

  const {
    beautify = false,
    fonts = {
      'Open Sans': 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700',
      'Droid Sans': 'https://fonts.googleapis.com/css?family=Droid+Sans:300,400,500,700',
      'Lato': 'https://fonts.googleapis.com/css?family=Lato:300,400,500,700',
      'Roboto': 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      'Ubuntu': 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700',
    },
    inlineCSS = true,
    minify = false,
    style = [],
    keepComments,
    validationLevel = 'soft',
  } = options

  const globalDatas = {
    classes: {},
    defaultAttributes: {},
    fonts,
    mediaQueries: {},
    style,
    title: '',
  }

  if (typeof mjml === 'string') {
    mjml = parseXML(mjml, {keepComments})
  }

  switch (validationLevel) {
    case 'skip':
      break;
    case 'strict':
      errors = MJMLValidator(mjml)

      if (errors.length > 0) {
        throw new ValidationError(`ValidationError: \n ${errors.map(e => e.formattedMessage).join('\n')}`, errors)
      }
      break;
    case 'soft':
    default:
      errors = MJMLValidator(mjml)
      break;
  }

  const processing = (type, context, parseMJML = identity) => {
    const componentRoot = traverseMJML(mjml, child => child.tagName === `mj-${type}`)

    if (componentRoot &&
        componentRoot.children) {
      forEach(componentRoot.children, child => {
        const component = initComponent({
          type,
          name: child.tagName,
          initialDatas: {
            ...parseMJML(child),
            context,
          },
        })

        if (component !== null) {
          if ('handler' in component) {
            component.handler()
          }

          if ('render' in component) {
            content = component.render()
          }
        }
      })
    }
  }

  processing('head', {
    addDefaultAttributes (tagName, attributes) {
      globalDatas.defaultAttributes[tagName] = attributes
    },
    addClass (name, attributes) {
      globalDatas.classes[name] = attributes
    },
    addFont (name, url) {
      globalDatas.fonts[name] = url
    },
    addStyle (style) {
      globalDatas.style.push(style)
    },
    setTitle (title) {
      globalDatas.title = title
    },
  })

  processing('body', {
    addMediaQuery (className, { parsedWidth, unit }) {
      globalDatas.mediaQueries[className] = `{ width:${parsedWidth}${unit} !important; }`
    },
  }, mjml => {
    const parse = mjml => {
      const classes = mjml.attributes['mj-class']
      const attributesClasses = classes ?
        reduce(classes.split(' '), (result, value) => ({
          ...result,
          ...globalDatas.classes[value],
        }), {}) : {}

      return {
        ...mjml,
        attributes: {
          ...omit(mjml.attributes, [ 'mj-class' ]),
          ...attributesClasses,
          ...globalDatas.defaultAttributes[mjml.tagName],
          ...globalDatas.defaultAttributes['mj-all'],
        },
        children: mjml.children && map(mjml.children, parse),
      }
    }

    return parse(mjml)
  })

  if (globalDatas.style.length > 0) {
    content = inlineCSS ? juice(content, {
      applyStyleTags: false,
      extraCss: globalDatas.style.join(''),
      insertPreservedExtraCss: false,
      removeStyleTags: false,
    }) : content
  }

  content = skeleton({
    content,
    ...globalDatas,
  })

  content = beautify ? htmlBeautify(content, {
    indent_size: 2,
    wrap_attributes_indent_size: 2,
    max_preserve_newline: 0,
    preserve_newlines: false,
  }) : content

  content = minify ? htmlMinify(content, {
    collapseWhitespace: true,
    minifyCSS: true,
    removeEmptyAttributes: true,
  }) : content

  content = mergeOutlookConditionnals(content)

  return { html: content, errors: errors }
}

export {
  components,
  getFlattenComponents,
  initComponent,
  registerComponent,
}
