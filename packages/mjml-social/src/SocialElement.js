import { BodyComponent } from 'mjml-core'
import { get, each } from 'lodash'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
} from 'mjml-core/lib/helpers/responsiveMode'
import {
  emitOutlookDarkModeHeadRaw,
  getOutlookDarkModeMediaQuery,
  OUTLOOK_DARK_MODE_BACKGROUND_CLASS,
  OUTLOOK_DARK_MODE_CLASS,
  registerOutlookDarkModeBackgroundRule,
  registerOutlookDarkModeImage,
} from 'mjml-core/lib/helpers/outlookDarkMode'

const IMG_BASE_URL = 'https://www.mailjet.com/images/theme/v1/icons/ico-social/'

const defaultSocialNetworks = {
  facebook: {
    'share-url': 'https://www.facebook.com/sharer.php?u=[[URL]]',
    'background-color': '#3b5998',
    src: `${IMG_BASE_URL}facebook.png`,
  },
  twitter: {
    'share-url': 'https://x.com/intent/tweet?url=[[URL]]',
    'background-color': '#55acee',
    src: `${IMG_BASE_URL}twitter.png`,
  },
  x: {
    'share-url': 'https://x.com/intent/tweet?url=[[URL]]',
    'background-color': '#030303',
    src: `${IMG_BASE_URL}twitter-x.png`,
  },
  google: {
    'share-url': 'https://plus.google.com/share?url=[[URL]]',
    'background-color': '#dc4e41',
    src: `${IMG_BASE_URL}google-plus.png`,
  },
  pinterest: {
    'share-url':
      'https://pinterest.com/pin/create/button/?url=[[URL]]',
    'background-color': '#bd081c',
    src: `${IMG_BASE_URL}pinterest.png`,
  },
  linkedin: {
    'share-url':
      'https://www.linkedin.com/sharing/share-offsite/?url=[[URL]]',
    'background-color': '#0077b5',
    src: `${IMG_BASE_URL}linkedin.png`,
  },
  instagram: {
    'background-color': '#3f729b',
    src: `${IMG_BASE_URL}instagram.png`,
  },
  web: {
    src: `${IMG_BASE_URL}web.png`,
    'background-color': '#4BADE9',
  },
  snapchat: {
    src: `${IMG_BASE_URL}snapchat.png`,
    'background-color': '#FFFA54',
  },
  youtube: {
    src: `${IMG_BASE_URL}youtube.png`,
    'background-color': '#EB3323',
  },
  tumblr: {
    src: `${IMG_BASE_URL}tumblr.png`,
    'share-url':
      'https://www.tumblr.com/widgets/share/tool?canonicalUrl=[[URL]]',
    'background-color': '#344356',
  },
  github: {
    src: `${IMG_BASE_URL}github.png`,
    'background-color': '#000000',
  },
  xing: {
    src: `${IMG_BASE_URL}xing.png`,
    'share-url': 'https://www.xing.com/app/user?op=share&url=[[URL]]',
    'background-color': '#296366',
  },
  vimeo: {
    src: `${IMG_BASE_URL}vimeo.png`,
    'background-color': '#53B4E7',
  },
  medium: {
    src: `${IMG_BASE_URL}medium.png`,
    'background-color': '#000000',
  },
  soundcloud: {
    src: `${IMG_BASE_URL}soundcloud.png`,
    'background-color': '#EF7F31',
  },
  dribbble: {
    src: `${IMG_BASE_URL}dribbble.png`,
    'background-color': '#D95988',
  },
}

each(defaultSocialNetworks, (val, key) => {
  defaultSocialNetworks[`${key}-noshare`] = {
    ...val,
    'share-url': '[[URL]]',
  }
})

// Expand CSS padding shorthand to [top, right, bottom, left] per CSS rules
function expandPadding(padding) {
  const parts = String(padding).trim().split(/\s+/)
  const t = parts[0]
  const r = parts[1] !== undefined ? parts[1] : t
  const b = parts[2] !== undefined ? parts[2] : t
  const l = parts[3] !== undefined ? parts[3] : r
  return [t, r, b, l]
}

function applyGutterEdgeZero(padding, mode, first, last) {
  if (!padding) return padding
  if (!first && !last) return padding
  const [t, r, b, l] = expandPadding(padding)
  return [
    mode === 'vertical' && first ? '0' : t,
    mode === 'horizontal' && last ? '0' : r,
    mode === 'vertical' && last ? '0' : b,
    mode === 'horizontal' && first ? '0' : l,
  ].join(' ')
}

export default class MjSocialElement extends BodyComponent {
  static componentName = 'mj-social-element'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'align--responsive': 'enum(left,center,right)',
    alt: 'string',
    'background-color': 'color',
    'background-color--dark': 'color',
    border: 'string',
    'border-radius': 'string',
    color: 'color',
    'color--dark': 'color',
    'font-family': 'string',
    'font-size': 'unit(px,rem)',
    'font-size--responsive': 'unit(px,rem)',
    'font-style': 'string',
    'font-weight': 'string',
    href: 'string',
    'icon-height': 'unit(px,%)',
    'icon-height--responsive': 'unit(px,%)',
    'icon-position': 'enum(left,right)',
    'icon-size': 'unit(px,%)',
    'icon-size--responsive': 'unit(px,%)',
    'line-height': 'unit(px,%,em,rem)',
    'line-height--responsive': 'unit(px,%,em,rem)',
    name: 'string',
    rel: 'string',
    src: 'string',
    'src--dark': 'string',
    srcset: 'string',
    sizes: 'string',
    'support-dark-mode-image': 'enum(outlook)',
    target: 'string',
    title: 'string',
    'text-decoration': 'string',
    'vertical-align': 'enum(top,middle,bottom)',
  }

  static defaultAttributes = {
    alt: '',
    'icon-position': 'left',
    color: '#000',
    border: '0',
    'border-radius': '3px',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '16px',
    'line-height': '150%',
    'text-decoration': 'none',
  }

  darkClasses = null

  responsiveClasses = null

  outlookDarkBackgroundClass = null

  getOutlookDarkBackgroundClass() {
    if (this.outlookDarkBackgroundClass !== null) {
      return this.outlookDarkBackgroundClass
    }

    const globalData = this.context && this.context.globalData

    if (!globalData) {
      return null
    }

    if (typeof globalData.outlookDarkModeBackgroundCount !== 'number') {
      globalData.outlookDarkModeBackgroundCount = 0
    }

    globalData.outlookDarkModeBackgroundCount += 1
    this.outlookDarkBackgroundClass = `mj-dark-image-bg-${globalData.outlookDarkModeBackgroundCount}`

    return this.outlookDarkBackgroundClass
  }

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData

    const darkBackgroundColor = this.getAttribute('background-color--dark')
    if (darkBackgroundColor) {
      this.darkClasses.background = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      })
    }

    const darkColor = this.getAttribute('color--dark')
    if (darkColor) {
      this.darkClasses.color = registerDarkModeRule(globalData, {
        cssProperty: 'color',
        cssValue: darkColor,
      })
    }

    return this.darkClasses
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) return this.responsiveClasses

    this.responsiveClasses = {
      td: null,
      icon: null,
      tdText: null,
      text: null,
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.td = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['padding', applyGutterEdgeZero(
          this.attributes['padding--responsive'],
          this.getAttribute('mode'),
          this.props.first,
          this.props.last,
        )],
      ]),
    })

    const iconHeightResponsive =
      this.attributes['icon-height--responsive'] || this.attributes['icon-size--responsive']

    this.responsiveClasses.icon = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['padding', this.attributes['icon-padding--responsive']],
      ]).map((declaration) => ({
        ...declaration,
        selectorSuffix: ' td',
      })).concat(buildResponsiveDeclarations([
        ['height', iconHeightResponsive],
      ]).map((declaration) => ({
        ...declaration,
        selectorSuffix: ['', ' td'],
      }))).concat(buildResponsiveDeclarations([
        ['width', this.attributes['icon-size--responsive']],
      ]).map((declaration) => ({
        ...declaration,
        selectorSuffix: ' img',
      }))),
    })

    this.responsiveClasses.tdText = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['padding-left', this.attributes['text-spacing--responsive']],
        ['text-align', this.attributes['align--responsive']],
      ]),
    })

    this.responsiveClasses.text = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['font-size', this.attributes['font-size--responsive']],
        ['line-height', this.attributes['line-height--responsive']],
      ]),
    })

    return this.responsiveClasses
  }

  getStyles() {
    const {
      'icon-size': iconSize,
      'icon-height': iconHeight,
      'background-color': backgroundColor,
    } = this.getSocialAttributes()

    return {
      td: {
        padding: applyGutterEdgeZero(
          this.getAttribute('padding'),
          this.getAttribute('mode'),
          this.props.first,
          this.props.last,
        ),
        'vertical-align': this.getAttribute('vertical-align'),
      },
      table: {},
      icon: {
        padding: this.getAttribute('icon-padding'),
        'font-size': '0',
        height: iconHeight || iconSize,
        background: backgroundColor,
        'border-radius': this.getAttribute('border-radius'),
      },
      img: {
        border: this.getAttribute('border'),
        'border-radius': this.getAttribute('border-radius'),
        display: 'block',
      },
      tdText: {
        'padding-left': this.getAttribute('text-spacing'),
        'text-align': this.getAttribute('align'),
      },
      text: {
        color: this.getAttribute('color'),
        'font-size': this.getAttribute('font-size'),
        'font-weight': this.getAttribute('font-weight'),
        'font-style': this.getAttribute('font-style'),
        'font-family': this.getAttribute('font-family'),
        'line-height': this.getAttribute('line-height'),
        'mso-line-height-alt': '120%',
        'text-decoration': this.getAttribute('text-decoration'),
      },
      outlookDarkBackground: {
        'background-color': backgroundColor || '#f7f7f7',
        'mso-margin-top-alt': '0',
        'mso-margin-bottom-alt': '0',
      },
      outlookDarkPicture: {
        margin: 'auto',
        'text-align': 'center',
        width: '100%',
        height: 'auto',
        'mso-margin-top-alt': '0',
        'mso-margin-bottom-alt': '0',
      },
    }
  }

  getSocialAttributes() {
    const socialNetwork = defaultSocialNetworks[this.getAttribute('name')] || {}
    let href = this.getAttribute('href')

    if (href && get(socialNetwork, 'share-url')) {
      href = socialNetwork['share-url'].replace('[[URL]]', href)
    }

    const attrs = [
      'icon-size',
      'icon-height',
      'srcset',
      'sizes',
      'src',
      'background-color',
    ].reduce(
      (r, attr) => ({
        ...r,
        [attr]: this.getAttribute(attr) || socialNetwork[attr],
      }),
      {},
    )

    return {
      href,
      ...attrs,
    }
  }

  componentHeadStyle = () => {
    const globalData = this.context && this.context.globalData
    const darkClasses = this.getDarkClasses()
    const styles = []

    if (darkClasses.background || darkClasses.color) {
      emitDarkModeHeadStyle(globalData)
    }

    emitResponsiveHeadStyle(globalData)

    const darkSrc = this.getAttribute('src--dark')
    const supportOutlookDarkMode =
      this.getAttribute('support-dark-mode-image') === 'outlook'

    if (!darkSrc || !supportOutlookDarkMode) {
      return ''
    }

    const includeDarkStyles =
      !globalData || globalData.outlookDarkModeStyleEmitted === false

    if (includeDarkStyles) {
      emitOutlookDarkModeHeadRaw(globalData)
      styles.push(getOutlookDarkModeMediaQuery(globalData))
    }

    return styles.join('\n')
  }

  render() {
    const {
      src,
      srcset,
      sizes,
      href,
      'icon-size': iconSize,
    } = this.getSocialAttributes()

    const hasLink = !!this.getAttribute('href')
    const iconPosition = this.getAttribute('icon-position')
    const darkSrc = this.getAttribute('src--dark')
    const supportOutlookDarkMode =
      this.getAttribute('support-dark-mode-image') === 'outlook'
    const globalData = this.context && this.context.globalData
    const darkClasses = this.getDarkClasses()
    const darkBackgroundColor = this.getAttribute('background-color--dark')
    const {
      td: tdResponsiveClass,
      icon: iconResponsiveClass,
      tdText: tdTextResponsiveClass,
      text: textResponsiveClass,
    } = this.getResponsiveClasses()

    const darkPictureClass =
      darkSrc && supportOutlookDarkMode
        ? registerOutlookDarkModeImage(globalData, { darkSrc })
        : null

    const darkBackgroundClass =
      darkSrc && supportOutlookDarkMode && darkBackgroundColor
        ? this.getOutlookDarkBackgroundClass()
        : null

    if (darkBackgroundClass) {
      registerOutlookDarkModeBackgroundRule(globalData, {
        className: darkBackgroundClass,
        backgroundColor: darkBackgroundColor,
      })
    }

    const img = `
      <img
        ${this.htmlAttributes({
          alt: this.getAttribute('alt'),
          title: this.getAttribute('title'),
          src,
          style: 'img',
          width: parseInt(iconSize, 10),
          sizes,
          srcset,
        })}
      />
    `

    const picture = darkSrc
      ? `
        <picture>
          <source ${this.htmlAttributes({
            srcset: darkSrc,
            media: '(prefers-color-scheme: dark)',
          })} />
          ${img}
        </picture>
      `
      : null

    const darkImg = darkSrc && supportOutlookDarkMode
      ? `
        <div ${this.htmlAttributes({
          style: 'outlookDarkBackground',
          class: [
            OUTLOOK_DARK_MODE_BACKGROUND_CLASS,
            darkBackgroundClass,
            darkClasses.background,
          ]
            .filter(Boolean)
            .join(' '),
        })}>
          <div ${this.htmlAttributes({
            style: 'outlookDarkPicture',
            class: `${OUTLOOK_DARK_MODE_CLASS}${
            darkPictureClass ? ` ${darkPictureClass}` : ''
          }`,
          })}>
            ${
              hasLink
                ? `<a ${this.htmlAttributes({
                    href,
                    rel: this.getAttribute('rel'),
                    target: this.getAttribute('target'),
                  })}>` : ''
            }
            ${picture}
            ${hasLink ? `</a>` : ''}
          </div>
        </div>
      `
      : null

    const content = darkImg || picture || img

    const iconTd = `<td ${this.htmlAttributes({
          style: 'icon',
          class: darkClasses.background || undefined,
        })}>
                ${
                  hasLink && !darkImg
                    ? `<a ${this.htmlAttributes({
                        href,
                        rel: this.getAttribute('rel'),
                        target: this.getAttribute('target'),
                      })}>`
                    : ''
                }
                  ${content}
                ${hasLink && !darkImg ? `</a>` : ''}
              </td>`

    const textTd = this.getContent()
      ? `<td ${this.htmlAttributes({ style: 'tdText', class: tdTextResponsiveClass || undefined })}>
            ${
              hasLink
                ? `<a
                ${this.htmlAttributes({
                  href,
                  style: 'text',
                  class: [darkClasses.color, textResponsiveClass].filter(Boolean).join(' ') || null,
                  rel: this.getAttribute('rel'),
                  target: this.getAttribute('target'),
                })}>`
                : `<span
                    ${this.htmlAttributes({
                      style: 'text',
                      class: [darkClasses.color, textResponsiveClass].filter(Boolean).join(' ') || null,
                    })}>`
            }
              ${this.getContent()}
            ${hasLink ? `</a>` : '</span>'}
          </td>`
      : ''

    const innerRow = iconPosition === 'left'
      ? `${iconTd} ${textTd}`
      : `${textTd} ${iconTd}`

    return `<tr
        ${this.htmlAttributes({
          class: this.getAttribute('css-class'),
        })}
      >
        <td ${this.htmlAttributes({
          style: 'td',
          class: tdResponsiveClass || undefined,
        })}>
          <table
            ${this.htmlAttributes({
              border: '0',
              cellpadding: '0',
              cellspacing: '0',
              role: 'none',
              class: iconResponsiveClass || null,
            })}
          >
            <tr>
              ${innerRow}
            </tr>
          </table>
        </td>
      </tr>`
  }
}
