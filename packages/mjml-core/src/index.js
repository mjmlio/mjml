import _ from 'lodash'
import juice from 'juice'
import {
  html as htmlBeautify,
} from 'js-beautify'
import {
  minify as htmlMinify,
} from 'html-minifier'
import parseXML from 'mjml-parser-xml'

import components, {
  initComponent,
  registerComponent,
} from './components'

import skeleton from './helpers/skeleton'
import traverseMJML from './helpers/traverseMJML'

export default function mjml2html (mjml, options = {}) {

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
  } = options

  let content = ''

  const globalDatas = {
    classes: {},
    defaultAttributes: {},
    fonts,
    mediaQueries: {},
    style,
    title: '',
  }

  if (typeof mjml === 'string') {
    mjml = parseXML(mjml, {
      CDATASections: _.chain({
        ...components.head,
        ...components.body,
      })
      .filter(component => component.prototype.canContainMarkup)
      .map(component => component.getName())
      .value(),
    })
  }

  const processing = (type, context, parseMJML = _.identity) => {
    const componentRoot = traverseMJML(mjml, child => child.tagName === `mj-${type}`)

    if (componentRoot &&
        componentRoot.children) {
      _.forEach(componentRoot.children, child => {
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
        _.reduce(classes.split(' '), (result, value, key) => ({
          ...result,
          ...globalDatas.classes[value],
        }), {}) : {}

      return {
        ...mjml,
        attributes: {
          ..._.omit(mjml.attributes, [ 'mj-class' ]),
          ...attributesClasses,
          ...globalDatas.defaultAttributes[mjml.tagName],
          ...globalDatas.defaultAttributes['mj-all'],
        },
        children: mjml.children && _.map(mjml.children, parse),
      }
    }

    return parse(mjml)
  })

  content = beautify ? htmlBeautify(content, {
    indent_size: 2,
    wrap_attributes_indent_size: 2,
  }) : content

  content = minify ? htmlMinify(content, {
    collapseWhitespace: true,
    minifyCSS: true,
    removeEmptyAttributes: true,
  }) : content

  if (globalDatas.style.length > 0) {
    content = inlineCSS ? juice(content, {
      applyStyleTags: false,
      extraCss: globalDatas.style.join(''),
      insertPreservedExtraCss: false,
      removeStyleTags: false,
    }) : content
  }

  return skeleton({
    content,
    ...globalDatas,
  })

}

export {
  components,
  initComponent,
  registerComponent,
}
