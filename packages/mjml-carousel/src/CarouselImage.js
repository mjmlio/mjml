import { BodyComponent, suffixCssClasses } from 'mjml-core'

import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitOutlookDarkModeHeadRaw,
  getOutlookDarkModeMediaQuery,
  OUTLOOK_DARK_MODE_BACKGROUND_CLASS,
  OUTLOOK_DARK_MODE_CLASS,
  registerOutlookDarkModeImage,
} from 'mjml-core/lib/helpers/outlookDarkMode'

export default class MjCarouselImage extends BodyComponent {
  static componentName = 'mj-carousel-image'

  static endingTag = true

  static allowedAttributes = {
    alt: 'string',
    'border-radius': 'string',
    'dark-src': 'string',
    'dark-tb-border-color': 'color',
    'dark-thumbnails-src': 'string',
    href: 'string',
    rel: 'string',
    src: 'string',
    'support-dark-mode-image': 'enum(outlook)',
    target: 'string',
    'tb-border': 'string',
    'tb-border-radius': 'string',
    'thumbnails-src': 'string',
    title: 'string',
  }

  static defaultAttributes = {
    alt: '',
  }

  darkClasses = null

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData
    const darkThumbnailBorderColor = this.getAttribute('dark-tb-border-color')

    if (darkThumbnailBorderColor) {
      this.darkClasses.border = registerDarkModeRule(globalData, {
        cssProperty: 'border-color',
        cssValue: darkThumbnailBorderColor,
      })
    }

    return this.darkClasses
  }

  getStyles() {
    const hasThumbnailsSupported = this.hasThumbnailsSupported()
    return {
      images: {
        img: {
          'border-radius': this.getAttribute('border-radius'),
          display: 'block',
          width: this.context.containerWidth,
          'max-width': '100%',
        },
        firstImageDiv: {},
        otherImageDiv: {
          display: 'none',
        },
        outlookDarkBackground: {
          'background-color': '#f7f7f7',
        },
        outlookDarkPicture: {
          margin: 'auto',
          'text-align': 'center',
          width: '100%',
          height: 'auto',
        },
      },
      radio: {
        input: {
          display: 'none',
        },
      },
      thumbnails: {
        a: {
          border: this.getAttribute('tb-border'),
          'border-radius': this.getAttribute('tb-border-radius'),
          display: hasThumbnailsSupported ? 'none' : 'inline-block',
          overflow: 'hidden',
          width: this.getAttribute('tb-width'),
        },
        img: {
          display: 'block',
          width: '100%',
        },
      },
    }
  }

  hasThumbnailsSupported() {
    const thumbnails =
      this.getAttribute('thumbnails') || this.context.thumbnails
    return thumbnails === 'supported'
  }


  getOutlookDarkModeClass(variant, darkSrc) {
    const supportOutlookDarkMode =
      this.getAttribute('support-dark-mode-image') === 'outlook'
    const globalData = this.context && this.context.globalData
    const carouselId = this.getAttribute('carouselId')
    const darkMainSrc = this.getAttribute('dark-src')
    const darkThumbnailSrc = this.getAttribute('dark-thumbnails-src')

    if (!supportOutlookDarkMode || !globalData || !darkSrc || !carouselId) {
      return null
    }

    const sharesMainDarkClass =
      variant === 'main' || !darkThumbnailSrc || darkThumbnailSrc === darkMainSrc

    const cacheKey = sharesMainDarkClass
      ? `mj-carousel-${carouselId}-image-${this.props.index + 1}-main`
      : `mj-carousel-${carouselId}-image-${this.props.index + 1}-thumbnail`

    return registerOutlookDarkModeImage(globalData, {
      darkSrc,
      cacheKey,
    })
  }

  renderDarkModePicture(
    imgAttributes,
    darkSrc,
    outlookClass = null,
    linkAttributes = null,
  ) {
    const img = `
      <img
        ${this.htmlAttributes(imgAttributes)}
      />
    `

    if (!darkSrc) {
      return img
    }

    const picture = `
      <picture>
        <source ${this.htmlAttributes({
          srcset: darkSrc,
          media: '(prefers-color-scheme: dark)',
        })} />
        ${img}
      </picture>
    `

    // Wrap with Outlook dark-mode divs if class is provided.
    // If a link is provided, keep it as the immediate parent of picture inside wrappers.
    if (outlookClass) {
      const content = linkAttributes
        ? `<a ${this.htmlAttributes(linkAttributes)}>${picture}</a>`
        : picture

      return `
        <div ${this.htmlAttributes({
          style: 'images.outlookDarkBackground',
          class: OUTLOOK_DARK_MODE_BACKGROUND_CLASS,
        })}>
          <div ${this.htmlAttributes({
            style: 'images.outlookDarkPicture',
            class: `${OUTLOOK_DARK_MODE_CLASS} ${outlookClass}`,
          })}>
            ${content}
          </div>
        </div>
      `
    }

    return picture
  }

  renderThumbnail() {
    const { carouselId, src, alt, 'tb-width': width, target } = this.attributes
    const imgIndex = this.props.index + 1
    const borderDarkClass = this.getDarkClasses().border
    const cssClass = suffixCssClasses(
      this.getAttribute('css-class'),
      'thumbnail',
    )
    const thumbnailSrc = this.getAttribute('thumbnails-src') || src
    const darkThumbnailSrc =
      this.getAttribute('dark-thumbnails-src') || this.getAttribute('dark-src')
    const outlookThumbnailClass = this.getOutlookDarkModeClass(
      'thumbnail',
      darkThumbnailSrc,
    )

    const thumbnail = this.renderDarkModePicture(
      {
        style: 'thumbnails.img',
        src: thumbnailSrc,
        alt,
        width: parseInt(width, 10),
      },
      darkThumbnailSrc,
      outlookThumbnailClass,
    )

    return `
      <a
        ${this.htmlAttributes({
          style: 'thumbnails.a',
          href: `#${imgIndex}`,
          target,
          class: [
            'mj-carousel-thumbnail',
            `mj-carousel-${carouselId}-thumbnail`,
            `mj-carousel-${carouselId}-thumbnail-${imgIndex}`,
            cssClass,
            borderDarkClass,
          ]
            .filter(Boolean)
            .join(' '),
        })}
      >
        <label ${this.htmlAttributes({
          for: `mj-carousel-${carouselId}-radio-${imgIndex}`,
        })}>
          ${thumbnail}
        </label>
      </a>
    `
  }

  renderRadio() {
    const { index } = this.props
    const carouselId = this.getAttribute('carouselId')

    return `
      <input
        ${this.htmlAttributes({
          class: `mj-carousel-radio mj-carousel-${carouselId}-radio mj-carousel-${carouselId}-radio-${
            index + 1
          }`,
          checked: index === 0 ? true : null,
          type: 'radio',
          name: `mj-carousel-radio-${carouselId}`,
          id: `mj-carousel-${carouselId}-radio-${index + 1}`,
          style: 'radio.input',
        })}
      />
    `
  }

  render() {
    const { src, alt, href, rel, target, title } = this.attributes
    const { index } = this.props
    const isFallback = this.getAttribute('isFallback') === 'true' || this.getAttribute('isFallback') === true

    // For fallback (classic Outlook), render plain img without picture tag
    if (isFallback) {
      const plainImg = `<img
        ${this.htmlAttributes({
          title,
          src,
          alt,
          style: 'images.img',
          width: parseInt(this.context.containerWidth, 10),
          border: '0',
        })}
      />`

      const cssClass = this.getAttribute('css-class') || ''

      return `<div
        ${this.htmlAttributes({
          class: `mj-carousel-image mj-carousel-image-${index + 1} ${cssClass}`,
          style: index === 0 ? 'images.firstImageDiv' : 'images.otherImageDiv',
        })}
      >
        ${
          href
            ? `<a ${this.htmlAttributes({ href, rel, target })}>${plainImg}</a>`
            : plainImg
        }
      </div>`
    }

    // Normal render with dark-src support
    const outlookMainClass = this.getOutlookDarkModeClass(
      'main',
      this.getAttribute('dark-src'),
    )

    const outlookLinkAttributes =
      href && outlookMainClass
        ? {
            href,
            rel,
            target,
          }
        : null

    const image = this.renderDarkModePicture(
      {
        title,
        src,
        alt,
        style: 'images.img',
        width: parseInt(this.context.containerWidth, 10),
        border: '0',
      },
      this.getAttribute('dark-src'),
      outlookMainClass,
      outlookLinkAttributes,
    )

    const cssClass = this.getAttribute('css-class') || ''

    return `<div
        ${this.htmlAttributes({
          class: `mj-carousel-image mj-carousel-image-${index + 1} ${cssClass}`,
          style: index === 0 ? 'images.firstImageDiv' : 'images.otherImageDiv',
        })}
      >
        ${
          href && !outlookMainClass
            ? `<a ${this.htmlAttributes({ href, rel, target })}>${image}</a>`
            : image
        }
      </div>`
  }

  componentHeadStyle = () => {
    const globalData = this.context && this.context.globalData
    const darkClasses = this.getDarkClasses()
    const supportOutlookDarkMode =
      this.getAttribute('support-dark-mode-image') === 'outlook'
    const darkSrc = this.getAttribute('dark-src')
    const darkThumbnailsSrc = this.getAttribute('dark-thumbnails-src')

    if (darkClasses.border) {
      emitDarkModeHeadStyle(globalData)
    }

    if (
      !supportOutlookDarkMode ||
      (!darkSrc && !darkThumbnailsSrc) ||
      !globalData
    ) {
      return ''
    }

    const styles = []

    const includeDarkStyles =
      !globalData || globalData.outlookDarkModeStyleEmitted === false

    if (includeDarkStyles) {
      emitOutlookDarkModeHeadRaw(globalData)
      styles.push(getOutlookDarkModeMediaQuery())
    }

    return styles.join('\n')
  }
}
