import { BodyComponent } from 'mjml-core'
import { get, each } from 'lodash'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
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

export default class MjSocialElement extends BodyComponent {
  static componentName = 'mj-social-element'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    alt: 'string',
    'background-color': 'color',
    'border-radius': 'string',
    color: 'color',
    'dark-background-color': 'color',
    'dark-color': 'color',
    'dark-src': 'string',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-style': 'string',
    'font-weight': 'string',
    href: 'string',
    'icon-height': 'unit(px,%)',
    'icon-padding': 'unit(px,%){1,4}',
    'icon-position': 'enum(left,right)',
    'icon-size': 'unit(px,%)',
    'line-height': 'unit(px,%,)',
    name: 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    rel: 'string',
    src: 'string',
    srcset: 'string',
    sizes: 'string',
    target: 'string',
    title: 'string',
    'support-dark-mode-image': 'enum(outlook)',
    'text-decoration': 'string',
    'text-padding': 'unit(px,%){1,4}',
    'vertical-align': 'enum(top,middle,bottom)',
  }

  static defaultAttributes = {
    alt: '',
    'icon-position': 'left',
    color: '#000',
    'border-radius': '3px',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '13px',
    'line-height': '1',
    padding: '4px',
    'text-padding': '4px 4px 4px 0',
    'text-decoration': 'none',
  }

  darkClasses = null

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

    const darkBackgroundColor = this.getAttribute('dark-background-color')
    if (darkBackgroundColor) {
      this.darkClasses.background = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      })
    }

    const darkColor = this.getAttribute('dark-color')
    if (darkColor) {
      this.darkClasses.color = registerDarkModeRule(globalData, {
        cssProperty: 'color',
        cssValue: darkColor,
      })
    }

    return this.darkClasses
  }

  getStyles() {
    const {
      'icon-size': iconSize,
      'icon-height': iconHeight,
      'background-color': backgroundColor,
    } = this.getSocialAttributes()

    return {
      td: {
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'vertical-align': this.getAttribute('vertical-align'),
      },
      table: {
        background: backgroundColor,
        'border-radius': this.getAttribute('border-radius'),
      },
      icon: {
        padding: this.getAttribute('icon-padding'),
        'font-size': '0',
        height: iconHeight || iconSize,
      },
      img: {
        'border-radius': this.getAttribute('border-radius'),
        display: 'block',
      },
      tdText: {
        padding: this.getAttribute('text-padding'),
        'text-align': this.getAttribute('align'),
      },
      text: {
        color: this.getAttribute('color'),
        'font-size': this.getAttribute('font-size'),
        'font-weight': this.getAttribute('font-weight'),
        'font-style': this.getAttribute('font-style'),
        'font-family': this.getAttribute('font-family'),
        'line-height': this.getAttribute('line-height'),
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

    const darkSrc = this.getAttribute('dark-src')
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
    const darkSrc = this.getAttribute('dark-src')
    const supportOutlookDarkMode =
      this.getAttribute('support-dark-mode-image') === 'outlook'
    const globalData = this.context && this.context.globalData
    const darkClasses = this.getDarkClasses()
    const darkBackgroundColor = this.getAttribute('dark-background-color')

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

    const makeIcon = () => `<td ${this.htmlAttributes({ style: 'td' })}>
          <table
            ${this.htmlAttributes({
              border: '0',
              cellpadding: '0',
              cellspacing: '0',
              role: 'none',
              style: 'table',
              class: darkClasses.background || null,
            })}
          >
            <tr>
              <td ${this.htmlAttributes({ style: 'icon' })}>
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
              </td>
            </tr>
          </table>
        </td>`

    const makeContent = () => `
        ${
          this.getContent()
            ? `<td ${this.htmlAttributes({ style: 'tdText' })}>
            ${
              hasLink
                ? `<a
                ${this.htmlAttributes({
                  href,
                  style: 'text',
                  class: darkClasses.color || null,
                  rel: this.getAttribute('rel'),
                  target: this.getAttribute('target'),
                })}>`
                : `<span
                    ${this.htmlAttributes({
                      style: 'text',
                      class: darkClasses.color || null,
                    })}>`
            }
              ${this.getContent()}
            ${hasLink ? `</a>` : '</span>'}
          </td>`
            : ''
        }
      `

    const renderLeft = () => `${makeIcon()} ${makeContent()}`
    const renderRight = () => `${makeContent()} ${makeIcon()}`

    return `<tr
        ${this.htmlAttributes({
          class: this.getAttribute('css-class'),
        })}
      >
        ${iconPosition === 'left' ? renderLeft() : renderRight()}
      </tr>`
  }
}
