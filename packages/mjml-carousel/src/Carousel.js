import { BodyComponent } from 'mjml-core'
import { range, repeat, min, map } from 'lodash'

import conditionalTag, { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import genRandomHexString from 'mjml-core/lib/helpers/genRandomHexString'

export default class MjCarousel extends BodyComponent {
  static componentName = 'mj-carousel'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'border-radius': 'string',
    'container-background-color': 'color',
    'dark-container-background-color': 'color',
    'dark-left-icon': 'string',
    'dark-right-icon': 'string',
    'dark-tb-border-color': 'color',
    'dark-tb-hover-border-color': 'color',
    'dark-tb-selected-border-color': 'color',
    'icon-width': 'unit(px,%)',
    'left-icon': 'string',
    padding: 'unit(px,%){1,4}',
    'padding-top': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'right-icon': 'string',
    'support-dark-mode-image': 'enum(outlook)',
    'tb-border': 'string',
    'tb-border-radius': 'string',
    'tb-hover-border-color': 'color',
    'tb-selected-border-color': 'color',
    'tb-width': 'unit(px,%)',
    thumbnails: 'enum(visible,hidden,supported)',
  }

  static defaultAttributes = {
    align: 'center',
    'border-radius': '6px',
    'icon-width': '44px',
    'left-icon': 'https://i.imgur.com/xTh3hln.png',
    'right-icon': 'https://i.imgur.com/os7o9kz.png',
    thumbnails: 'visible',
    'tb-border': '2px solid transparent',
    'tb-border-radius': '6px',
    'tb-hover-border-color': '#fead0d',
    'tb-selected-border-color': '#ccc',
  }

  darkClasses = null

  constructor(initialDatas = {}) {
    super(initialDatas)
    this.carouselId = genRandomHexString(6)
  }

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData

    const darkContainerBackgroundColor =
      this.attributes['dark-container-background-color']
    if (darkContainerBackgroundColor) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBackgroundColor,
      })
    }

    return this.darkClasses
  }

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      return [base, containerDarkClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    const { length } = this.props.children
    const { carouselId } = this

    const globalData = this.context && this.context.globalData
    const includeSharedStyles =
      !globalData || globalData.carouselSharedStylesEmitted === false
    const darkClasses = this.getDarkClasses()

    if (darkClasses.container) {
      emitDarkModeHeadStyle(globalData)
    }

    if (globalData && includeSharedStyles) {
      globalData.carouselSharedStylesEmitted = true
    }

    if (!length) return ''

    const hideImageSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio:checked ${repeat(
            '+ * ',
            i,
          )}+ .mj-carousel-content .mj-carousel-image`,
      )
      .join(',\n')

    const visibleImageSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-image-${i + 1}`,
      )
      .join(',\n')

    const visibleNextSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-next-${
            ((i + (1 % length) + length) % length) + 1
          }`,
      )
      .join(',\n')

    const visiblePreviousSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-previous-${
            ((i - (1 % length) + length) % length) + 1
          }`,
      )
      .join(',\n')

    const selectedThumbnailSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-${carouselId}-thumbnail-${
            i + 1
          }`,
      )
      .join(',\n')

    const visibleThumbnailSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-${carouselId}-thumbnail`,
      )
      .join(',\n')

    const hoverHideImageSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-thumbnail:hover ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-main .mj-carousel-image`,
      )
      .join(',\n')

    const hoverShowImageSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-thumbnail-${i + 1}:hover ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-main .mj-carousel-image-${i + 1}`,
      )
      .join(',\n')

    const hoverBorderSelector = `.mj-carousel-${carouselId}-thumbnail:hover`
    const sharedCss = `
    .mj-carousel {
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
    .mj-carousel-thumbnail,
    .mj-carousel-next,
    .mj-carousel-previous {
      touch-action: manipulation;
    }
    .mj-carousel-radio,
    .mj-carousel-next,
    .mj-carousel-previous,
    .mj-carousel-image img + div,
    .mj-carousel-thumbnail img + div,
    .mj-carousel noinput .mj-carousel-arrows,
    .mj-carousel noinput .mj-carousel-thumbnails {
      display: none !important;
    }
    .mj-carousel-previous-icons,
    .mj-carousel-next-icons,
    .mj-carousel noinput,
    .mj-carousel noinput .mj-carousel-image-1 {
      display: block !important;
    }
    @media screen yahoo {
      .mj-carousel-previous-icons,
      .mj-carousel-next-icons {
        display: none !important;
      }
    }
    `

    const instanceCss = `
    .mj-carousel-${carouselId}-icons-cell {
      display: table-cell !important;
      width: ${this.getAttribute('icon-width')} !important;
    }
    ${hideImageSelectors} {
      display: none !important;
    }
    ${visibleImageSelectors},
    ${visibleNextSelectors},
    ${visiblePreviousSelectors} {
      display: block !important;
    }
    ${selectedThumbnailSelectors} {
      border-color: ${this.getAttribute('tb-selected-border-color')} !important;
    }
    ${visibleThumbnailSelectors} {
      display: inline-block !important;
    }
    ${hoverHideImageSelectors} {
      display: none !important;
    }
    ${hoverBorderSelector} {
      border-color: ${this.getAttribute('tb-hover-border-color')} !important;
    }
    ${hoverShowImageSelectors} {
      display: block !important;
    }
    `

    const darkCss = []
    const darkSelectedBorderColor = this.getAttribute(
      'dark-tb-selected-border-color',
    )

    if (darkSelectedBorderColor) {
      darkCss.push(`
    @media (prefers-color-scheme: dark) {
      ${selectedThumbnailSelectors} {
        border-color: ${darkSelectedBorderColor} !important;
      }
    }
    `)
    }

    const darkHoverBorderColor = this.getAttribute('dark-tb-hover-border-color')

    if (darkHoverBorderColor) {
      darkCss.push(`
    @media (prefers-color-scheme: dark) {
      ${hoverBorderSelector} {
        border-color: ${darkHoverBorderColor} !important;
      }
    }
    `)
    }

    const instanceFallback = `
      @media screen yahoo {
          .mj-carousel-${this.carouselId}-icons-cell {
              display: none !important;
          }
          .mj-carousel-${carouselId}-radio-1:checked ${repeat(
            '+ *',
            length - 1,
          )}+ .mj-carousel-content .mj-carousel-${carouselId}-thumbnail-1 {
              border-color: transparent;
          }
      }
    `
    return `${includeSharedStyles ? sharedCss : ''}${instanceCss}${
      includeSharedStyles ? '\n' : ''
    }${darkCss.join('\n')}${instanceFallback}`
  }

  getStyles() {
    return {
      carousel: {
        div: {
          display: 'table',
          width: '100%',
          'table-layout': 'fixed',
          'text-align': 'center',
          'font-size': '0px',
        },
        table: {
          'caption-side': 'top',
          display: 'table-caption',
          'table-layout': 'fixed',
          width: '100%',
        },
      },
      images: {
        td: {
          padding: '0px',
        },
      },
      controls: {
        div: {
          display: 'none',
        },
        img: {
          display: 'block',
          width: this.getAttribute('icon-width'),
        },
        td: {
          'font-size': '0px',
          display: 'none',
          padding: '0px',
        },
      },
    }
  }

  thumbnailsWidth() {
    if (!this.props.children.length) return 0
    return (
      this.getAttribute('tb-width') ||
      `${min([this.context.parentWidth / this.props.children.length, 110])}px`
    )
  }

  imagesAttributes() {
    return map(this.children, 'attributes')
  }

  getSupportDarkModeImage() {
    return this.getAttribute('support-dark-mode-image')
  }

  generateRadios() {
    const supportDarkModeImage = this.getSupportDarkModeImage()

    return this.renderChildren(this.props.children, {
      renderer: (component) => component.renderRadio(),
      attributes: {
        carouselId: this.carouselId,
        'support-dark-mode-image': supportDarkModeImage,
      },
    })
  }

  generateThumbnails() {
    if (!['visible', 'supported'].includes(this.getAttribute('thumbnails')))
      return ''

    const supportDarkModeImage = this.getSupportDarkModeImage()

    return this.renderChildren(this.props.children, {
      attributes: {
        'dark-tb-border-color': this.getAttribute('dark-tb-border-color'),
        'tb-border': this.getAttribute('tb-border'),
        'tb-border-radius': this.getAttribute('tb-border-radius'),
        'tb-width': this.thumbnailsWidth(),
        carouselId: this.carouselId,
        'support-dark-mode-image': supportDarkModeImage,
      },
      renderer: (component) => component.renderThumbnail(),
    })
  }

  generateControls(direction, icon, darkIcon) {
    const iconWidth = parseInt(this.getAttribute('icon-width'), 10)

    const renderIcon = `${
      darkIcon
        ? `<picture>
                  <source ${this.htmlAttributes({
                    srcset: darkIcon,
                    media: '(prefers-color-scheme: dark)',
                  })} />
                  <img
                    ${this.htmlAttributes({
                      src: icon,
                      alt: direction,
                      style: 'controls.img',
                      width: iconWidth,
                    })}
                  />
                </picture>`
        : `<img
                  ${this.htmlAttributes({
                    src: icon,
                    alt: direction,
                    style: 'controls.img',
                    width: iconWidth,
                  })}
                />`
    }`

    return `
      <td
        ${this.htmlAttributes({
          class: `mj-carousel-${this.carouselId}-icons-cell`,
          style: 'controls.td',
        })}
      >
        <div
          ${this.htmlAttributes({
            class: `mj-carousel-${direction}-icons`,
            style: 'controls.div',
          })}
        >
          ${range(1, this.props.children.length + 1)
            .map(
              (i) => `
              <label
                ${this.htmlAttributes({
                  for: `mj-carousel-${this.carouselId}-radio-${i}`,
                  class: `mj-carousel-${direction} mj-carousel-${direction}-${i}`,
                })}
              >
                ${renderIcon}
              </label>
            `,
            )
            .join('')}
        </div>
      </td>
    `
  }

  generateImages() {
    const supportDarkModeImage = this.getSupportDarkModeImage()

    return `
      <td
        ${this.htmlAttributes({
          style: 'images.td',
        })}
      >
        <div
          ${this.htmlAttributes({
            class: 'mj-carousel-images',
          })}
        >
          ${this.renderChildren(this.props.children, {
            attributes: {
              'border-radius': this.getAttribute('border-radius'),
              carouselId: this.carouselId,
              'support-dark-mode-image': supportDarkModeImage,
            },
          })}
        </div>
      </td>
    `
  }

  generateCarousel() {
    return `
      <table
        ${this.htmlAttributes({
          style: 'carousel.table',
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          width: '100%',
          role: 'none',
          class: 'mj-carousel-main',
        })}
      >
        <tr>
          ${this.generateControls('previous', this.getAttribute('left-icon'), this.getAttribute('dark-left-icon'))}
          ${this.generateImages()}
          ${this.generateControls('next', this.getAttribute('right-icon'), this.getAttribute('dark-right-icon'))}
        </tr>
      </table>
    `
  }

  renderFallback() {
    const { children } = this.props
    if (children.length === 0) return ''

    return `<!-- prettier-ignore -->${msoConditionalTag(
      this.renderChildren([children[0]], {
        attributes: {
          isFallback: true,
        },
      }),
    )}`
  }

  getChildContext() {
    return {
      ...this.context,
      thumbnails: this.getAttribute('thumbnails'),
    }
  }

  render() {
    return `
      ${conditionalTag(
        `
        <div
          ${this.htmlAttributes({
            class: 'mj-carousel',
          })}
        >
          ${this.generateRadios()}
          <div
            ${this.htmlAttributes({
              class: `mj-carousel-content mj-carousel-${this.carouselId}-content`,
              style: 'carousel.div',
            })}
          >
            ${this.generateThumbnails()}
            ${this.generateCarousel()}
          </div>
        </div>
      `,
        true,
      )}
      ${this.renderFallback()}
    `
  }
}
