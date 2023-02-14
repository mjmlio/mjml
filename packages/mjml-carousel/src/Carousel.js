import { BodyComponent } from 'mjml-core'
import { range, repeat, min, map } from 'lodash'

import { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'
import genRandomHexString from 'mjml-core/lib/helpers/genRandomHexString'

export default class MjCarousel extends BodyComponent {
  static componentName = 'mj-carousel'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'border-radius': 'unit(px,%){1,4}',
    'container-background-color': 'color',
    'icon-width': 'unit(px,%)',
    'left-icon': 'string',
    padding: 'unit(px,%){1,4}',
    'padding-top': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'right-icon': 'string',
    thumbnails: 'enum(visible,hidden)',
    'tb-border': 'string',
    'tb-border-radius': 'unit(px,%)',
    'tb-hover-border-color': 'color',
    'tb-selected-border-color': 'color',
    'tb-width': 'unit(px,%)',
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

  constructor(initialDatas = {}) {
    super(initialDatas)
    this.carouselId = genRandomHexString(16)
  }

  componentHeadStyle = () => {
    const { length } = this.props.children
    const { carouselId } = this

    if (!length) return ''

    const carouselCss = `
    .mj-carousel {
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    .mj-carousel-${carouselId}-icons-cell {
      display: table-cell !important;
      width: ${this.getAttribute('icon-width')} !important;
    }

    .mj-carousel-radio,
    .mj-carousel-next,
    .mj-carousel-previous {
      display: none !important;
    }

    .mj-carousel-thumbnail,
    .mj-carousel-next,
    .mj-carousel-previous {
      touch-action: manipulation;
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
      .join(',')} {
      display: block !important;
    }

    .mj-carousel-previous-icons,
    .mj-carousel-next-icons,
    ${range(0, length).map(
      (i) =>
        `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
          '+ * ',
          length - i - 1,
        )}+ .mj-carousel-content .mj-carousel-next-${
          ((i + (1 % length) + length) % length) + 1
        }`,
    )},
    ${range(0, length).map(
      (i) =>
        `.mj-carousel-${carouselId}-radio-${i + 1}:checked ${repeat(
          '+ * ',
          length - i - 1,
        )}+ .mj-carousel-content .mj-carousel-previous-${
          ((i - (1 % length) + length) % length) + 1
        }`,
    )} {
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

    .mj-carousel-image img + div,
    .mj-carousel-thumbnail img + div {
      display: none !important;
    }

    ${range(0, length)
      .map(
        (i) =>
          `.mj-carousel-${carouselId}-thumbnail:hover ${repeat(
            '+ * ',
            length - i - 1,
          )}+ .mj-carousel-main .mj-carousel-image`,
      )
      .join(',')} {
      display: none !important;
    }

    .mj-carousel-thumbnail:hover {
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

    const fallback = `
      .mj-carousel noinput { display:block !important; }
      .mj-carousel noinput .mj-carousel-image-1 { display: block !important;  }
      .mj-carousel noinput .mj-carousel-arrows,
      .mj-carousel noinput .mj-carousel-thumbnails { display: none !important; }

      [owa] .mj-carousel-thumbnail { display: none !important; }
      
      @media screen yahoo {
          .mj-carousel-${this.carouselId}-icons-cell,
          .mj-carousel-previous-icons,
          .mj-carousel-next-icons {
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

    return `${carouselCss}\n${fallback}`
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
          'mso-hide': 'all',
        },
        img: {
          display: 'block',
          width: this.getAttribute('icon-width'),
          height: 'auto',
        },
        td: {
          'font-size': '0px',
          display: 'none',
          'mso-hide': 'all',
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

  generateRadios() {
    return this.renderChildren(this.props.children, {
      renderer: (component) => component.renderRadio(),
      attributes: {
        carouselId: this.carouselId,
      },
    })
  }

  generateThumbnails() {
    if (this.getAttribute('thumbnails') !== 'visible') return ''

    return this.renderChildren(this.props.children, {
      attributes: {
        'tb-border': this.getAttribute('tb-border'),
        'tb-border-radius': this.getAttribute('tb-border-radius'),
        'tb-width': this.thumbnailsWidth(),
        carouselId: this.carouselId,
      },
      renderer: (component) => component.renderThumbnail(),
    })
  }

  generateControls(direction, icon) {
    const iconWidth = parseInt(this.getAttribute('icon-width'), 10)

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
                <img
                  ${this.htmlAttributes({
                    src: icon,
                    alt: direction,
                    style: 'controls.img',
                    width: iconWidth,
                  })}
                />
              </label>
            `,
            )
            .join('')}
        </div>
      </td>
    `
  }

  generateImages() {
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
          'cell-padding': '0',
          'cell-spacing': '0',
          width: '100%',
          role: 'presentation',
          class: 'mj-carousel-main',
        })}
      >
        <tbody>
          <tr>
            ${this.generateControls('previous', this.getAttribute('left-icon'))}
            ${this.generateImages()}
            ${this.generateControls('next', this.getAttribute('right-icon'))}
          </tr>
        </tbody>
      </table>
    `
  }

  renderFallback() {
    const { children } = this.props
    if (children.length === 0) return ''

    return msoConditionalTag(
      this.renderChildren([children[0]], {
        attributes: {
          'border-radius': this.getAttribute('border-radius'),
        },
      }),
    )
  }

  render() {
    return `
      ${msoConditionalTag(
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
