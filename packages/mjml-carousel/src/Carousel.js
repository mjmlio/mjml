import { BodyComponent } from 'mjml-core'
import { range, repeat, min, map } from 'lodash'

import conditionalTag, { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
  registerResponsivePaddingGroup,
} from 'mjml-core/lib/helpers/responsiveMode'
import genRandomHexString from 'mjml-core/lib/helpers/genRandomHexString'

export default class MjCarousel extends BodyComponent {
  static componentName = 'mj-carousel'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'align--responsive': 'enum(left,center,right)',
    'aria-label': 'string',
    'aria-roledescription': 'string',
    'border-radius': 'string',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'container-border-radius': 'string',
    'icon-width': 'unit(px,%)',
    'icon-width--responsive': 'unit(px,%)',
    'left-icon': 'string',
    'left-icon--dark': 'string',
    padding: 'unit(px,%){1,4}',
    'padding--responsive': 'unit(px,%){1,4}',
    'padding-top': 'unit(px,%)',
    'padding-top--responsive': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-bottom--responsive': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-left--responsive': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-right--responsive': 'unit(px,%)',
    'right-icon': 'string',
    'right-icon--dark': 'string',
    role: 'string',
    'support-dark-mode-image': 'enum(outlook)',
    'tb-border': 'string',
    'tb-border-color--dark': 'color',
    'tb-border-radius': 'string',
    'tb-hover-border-color': 'color',
    'tb-hover-border-color--dark': 'color',
    'tb-selected-border-color': 'color',
    'tb-selected-border-color--dark': 'color',
    'tb-width': 'unit(px,%)',
    'tb-width--responsive': 'unit(px,%)',
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

  responsiveClasses = null

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
      this.attributes['container-background-color--dark']
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
      const containerResponsiveClass = this.getResponsiveClasses().container
      return [base, containerDarkClass, containerResponsiveClass]
        .filter(Boolean)
        .join(' ') || undefined
    }

    return this.attributes[name]
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) {
      return this.responsiveClasses
    }

    this.responsiveClasses = {
      container: null,
      content: null,
      iconsCell: null,
      iconImage: null,
      thumbnail: null,
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.container = registerResponsivePaddingGroup(
      globalData,
      this.attributes,
    )

    this.responsiveClasses.content = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['text-align', this.attributes['align--responsive']],
      ]),
    })

    this.responsiveClasses.iconsCell = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['width', this.attributes['icon-width--responsive']],
      ]),
    })

    this.responsiveClasses.iconImage = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['width', this.attributes['icon-width--responsive']],
      ]),
    })

    this.responsiveClasses.thumbnail = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['width', this.attributes['tb-width--responsive']],
      ]),
    })

    return this.responsiveClasses
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

    emitResponsiveHeadStyle(globalData)

    if (globalData && includeSharedStyles) {
      globalData.carouselSharedStylesEmitted = true
    }

    if (!length) return ''

    const focusVisibleThumbnailSelectors = range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:focus-visible ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-${carouselId}-thumbnail-${
            i + 1
          }`,
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
    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio:checked ${repeat(
            '+ * ',
            i,
          )}+ .mj-carousel-content .mj-carousel-image`,
      )
      .join(',')} {
      display: none !important;
    }
    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-image-${i + 1}`,
      )
      .join(',')},
    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-next-${
            ((i + (1 % length) + length) % length) + 1
          }`,
      )
      .join(',')},
    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-previous-${
            ((i - (1 % length) + length) % length) + 1
          }`,
      )
      .join(',')} {
      display: block !important;
    }
    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-${carouselId}-thumbnail-${
            i + 1
          }`,
      )
      .join(',')} {
      border-color: ${this.getAttribute('tb-selected-border-color')} !important;
    }
    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-content .mj-carousel-${carouselId}-thumbnail`,
      )
      .join(',')} {
      display: inline-block !important;
    }
    ${focusVisibleThumbnailSelectors} {
      outline: 5px auto Highlight;
      outline-color: -webkit-focus-ring-color;
    }
    ${hoverHideImageSelectors} {
      display: none !important;
    }
    .mj-carousel-${carouselId}-thumbnail:hover {
      border-color: ${this.getAttribute('tb-hover-border-color')} !important;
    }
    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-thumbnail-${i + 1}:hover ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-main .mj-carousel-image-${i + 1}`,
      )
      .join(',')} {
      display: block !important;
    }
    `

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
      .join(',')

    const hoverBorderSelector = `.mj-carousel-${carouselId}-thumbnail:hover`

    const darkCss = []
    const darkSelectedBorderColor = this.getAttribute(
      'tb-selected-border-color--dark',
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

    const darkHoverBorderColor = this.getAttribute('tb-hover-border-color--dark')

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
      @media only screen and (min-width:0) {
        ${range(1, length + 1)
          .map((i) => `.mj-carousel-${carouselId}-radio-${i}`)
          .join(',\n          ')} {
            display: block !important;
            position: absolute;
            opacity: 0;
            height: 0;
        }
      }

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
          'text-align': this.getAttribute('align'),
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
        'tb-border-color--dark': this.getAttribute('tb-border-color--dark'),
        'tb-border': this.getAttribute('tb-border'),
        'tb-border-radius': this.getAttribute('tb-border-radius'),
        'tb-width': this.thumbnailsWidth(),
        'tb-width--responsive': this.getAttribute('tb-width--responsive'),
        carouselId: this.carouselId,
        'support-dark-mode-image': supportDarkModeImage,
      },
      renderer: (component) => component.renderThumbnail(),
    })
  }

  generateControls(direction, icon, darkIcon) {
    const iconWidth = parseInt(this.getAttribute('icon-width'), 10)
    const { iconsCell, iconImage } = this.getResponsiveClasses()

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
                    class: iconImage,
                    style: 'controls.img',
                    width: iconWidth,
                  })}
                />`
    }`

    return `
      <td
        ${this.htmlAttributes({
          class: [
            `mj-carousel-${this.carouselId}-icons-cell`,
            iconsCell,
          ].filter(Boolean).join(' '),
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
          class: 'mj-carousel-main',
          role: this.getAttribute('role') ? this.getAttribute('role') : 'none',
          'aria-label': this.getAttribute('aria-label'),
          'aria-roledescription': this.getAttribute('aria-roledescription'),
        })}
      >
        <tr>
          ${this.generateControls('previous', this.getAttribute('left-icon'), this.getAttribute('left-icon--dark'))}
          ${this.generateImages()}
          ${this.generateControls('next', this.getAttribute('right-icon'), this.getAttribute('right-icon--dark'))}
        </tr>
      </table>
    `
  }

  renderFallback() {
    const { children } = this.props
    if (children.length === 0) return ''

    return `${msoConditionalTag(
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
      carouselThumbnailResponsiveClass: this.getResponsiveClasses().thumbnail,
      carouselSlidesCount: this.props.children.length,
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
              class: [
                'mj-carousel-content',
                `mj-carousel-${this.carouselId}-content`,
                this.getResponsiveClasses().content,
              ].filter(Boolean).join(' '),
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
