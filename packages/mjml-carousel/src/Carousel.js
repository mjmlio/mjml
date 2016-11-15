import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'
import range from 'lodash/range'
import repeat from 'lodash/repeat'
import min from 'lodash/min'

const tagName = 'mj-carousel'
const parentTag = ['mj-column', 'mj-hero-content']
const defaultMJMLDefinition = {
  attributes: {
    'align': 'center',
    'border-radius': '6px',
    'icon-width': '44px',
    'left-icon': 'http://i.imgur.com/xTh3hln.png',
    'padding': null,
    'padding-top': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'right-icon': 'http://i.imgur.com/os7o9kz.png',
    'thumbnails': 'visible',
    'tb-border': '2px solid transparent',
    'tb-border-radius': '6px',
    'tb-hover-border-color': '#fead0d',
    'tb-selected-border-color': '#ccc',
    'tb-width': null
  }
}
const baseStyles = {
  carousel: {
    div: {
      display: 'table',
      width:' 100%',
      tableLayout: 'fixed',
      textAlign: 'center',
      fontSize: '0'
    },
    table: {
      captionSide: 'top',
      display: 'table-caption',
      tableLayout: 'fixed',
      width: '100%'
    }
  },
  controls: {
    div: {
      display: 'none',
      msoHide: 'all'
    },
    img: {
      display: 'block',
      width: '100%',
      height: 'auto'
    },
    td: {
      display: 'none',
      msoHide: 'all'
    }
  },
  images: {
    div: {
      padding: '20px'
    },
    firstImageDiv: {},
    img: {
      display: 'block',
      width: '600px',
      maxWidth: '100%',
      height: 'auto'
    },
    otherImageDiv: {
      display: 'none',
      msoHide: 'all'
    }
  },
  radio: {
    input: {
      display: 'none',
      msoHide: 'all'
    }
  },
  thumbnails: {
    a: {
      display: 'inline-block',
      overflow: 'hidden'
    },
    img: {
      display: 'block',
      width: '100%',
      height: 'auto'
    }
  }
}
const postRender = $ => {
  const $mjCarousel = $('.mj-carousel')

  if ($mjCarousel.length === 0) {
    return $
  }

  const length = $mjCarousel.data('length') * 1

  const carouselCss = `<style type="text/css">
  .mj-carousel {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .mj-carousel-icons-cell {
    display: table-cell !important;
    width: ${$mjCarousel.data('icon-width')} !important;
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

  ${range(0, length).map(i => `.mj-carousel-radio:checked ${repeat('+ * ', i)}+ .mj-carousel-content .mj-carousel-image` ).join(',')} {
    display: none !important;
  }

  ${range(0, length).map(i => `.mj-carousel-radio-${i + 1}:checked ${repeat('+ * ', length - i - 1)}+ .mj-carousel-content .mj-carousel-image-${i + 1}` ).join(',')} {
    display: block !important;
  }

  .mj-carousel-previous-icons,
  .mj-carousel-next-icons,
  ${range(0, length).map(i => `.mj-carousel-radio-${i + 1}:checked ${repeat('+ * ', length - i - 1)}+ .mj-carousel-content .mj-carousel-next-${((i + 1 % length) + length) % length + 1}`)},
  ${range(0, length).map(i => `.mj-carousel-radio-${i + 1}:checked ${repeat('+ * ', length - i - 1)}+ .mj-carousel-content .mj-carousel-previous-${((i - 1 % length) + length) % length + 1}`)} {
    display: block !important;
  }

  ${range(0, length).map(i => `.mj-carousel-radio-${i + 1}:checked ${repeat('+ * ', length - i - 1)}+ .mj-carousel-content .mj-carousel-thumbnail-${i + 1}` ).join(',')} {
    border-color: ${$mjCarousel.data('selected-border-color')} !important;
  }

  .mj-carousel-image img + div,
  .mj-carousel-thumbnail img + div {
    display: none !important;
  }

  ${range(0, length).map(i => `.mj-carousel-thumbnail:hover ${repeat('+ * ', length - i - 1)}+ .mj-carousel-main .mj-carousel-image`).join(',')} {
    display: none !important;
  }

  .mj-carousel-thumbnail:hover {
    border-color: ${$mjCarousel.data('hover-border-color')} !important;
  }

  ${range(0, length).map(i => `.mj-carousel-thumbnail-${i + 1}:hover ${repeat('+ * ', length - i - 1)}+ .mj-carousel-main .mj-carousel-image-${i + 1}` ).join(',')} {
    display: block !important;
  }
  </style>`

  const fallback = `
  <style type="text/css" id="mj-carousel-fallback">
    .mj-carousel noinput { display:block !important; }
    .mj-carousel noinput .mj-carousel-image-1 { display: block !important;  }
    .mj-carousel noinput .mj-carousel-arrows,
    .mj-carousel noinput .mj-carousel-thumbnails { display: none !important; }

    [owa] .mj-carousel-thumbnail { display: none !important; }

    @media screen yahoo {
        .mj-carousel-icons-cell,
        .mj-carousel-previous-icons,
        .mj-carousel-next-icons {
            display: none !important;
        }

        .mj-carousel-radio-1:checked ${repeat('+ *', length - 1)}+ .mj-carousel-content .mj-carousel-thumbnail-1 {
            border-color: transparent;
        }
    }
  </style>`

  $('head').append(carouselCss)
  $('head').append(fallback)

  $('.mj-carousel').before(`<!--[if !mso]><!-->`)
  $('.mj-carousel').after(`${helpers.endNegationConditionalTag}
    <!--[if mso]>
    ${$('.mj-carousel-image-1').html()}
    ${helpers.endConditionalTag}`)

  return $
}

@MJMLElement
class Carousel extends Component {

  getStyles () {
    const { mjAttribute } = this.props

    return helpers.merge({}, baseStyles, {
      images: {
        img: {
          borderRadius: '6px'
        }
      },
      thumbnails: {
        img: {
          borderRadius: mjAttribute('tb-border-radius')
        },
        a: {
          border: mjAttribute('tb-border'),
          borderRadius: mjAttribute('tb-border-radius'),
          width: this.thumbnailsWidth()
        }
      }
    })
  }

  thumbnailsWidth () {
    const { mjAttribute } = this.props

    return mjAttribute('tb-width') ? mjAttribute('tb-width') : `${min([mjAttribute('parentWidth') / this.images.size, 110])}px`
  }

  generateRadio () {
    return this.images.map(({src}, index) => {
      return (
        <input
          key={`mj-carousel-radio-${index + 1}`}
          className={`mj-carousel-radio mj-carousel-radio-${index + 1}`}
          defaultChecked={index === 0}
          type="radio" name="mj-carousel-radio"
          id={`mj-carousel-radio-${index + 1}`}
          style={this.styles.radio.input} />
      )
    })
  }

  generateThumbnails () {
    const imgWidth = this.thumbnailsWidth()

    return this.images.map(({src, alt, 'thumbnails-src': thumbsSrc}, index) => {
      const imgIndex = index + 1

      return (
        <a style={this.styles.thumbnails.a} key={`mj-carousel-thumbnail-${imgIndex}`} href={`#${imgIndex}`} className={`mj-carousel-thumbnail mj-carousel-thumbnail-${imgIndex}`}>
          <label htmlFor={`mj-carousel-radio-${imgIndex}`}>
            <img src={thumbsSrc || src } alt={alt} style={this.styles.thumbnails.img} width={parseInt(imgWidth)} />
          </label>
        </a>
      )
    })
  }

  generateControls (classAffix, icon) {
    const { mjAttribute } = this.props
    const iconWidth = parseInt(mjAttribute('icon-width'))

    return (
      <td className="mj-carousel-icons-cell" style={this.styles.controls.td}>
        <div className={`mj-carousel-${classAffix}-icons`} style={this.styles.controls.div}>
          { range(1, this.images.size + 1).map(i => {
            return (
              <label
                key={`mj-carousel-radio-${i}`}
                htmlFor={`mj-carousel-radio-${i}`}
                className={`mj-carousel-${classAffix} mj-carousel-${classAffix}-${i}`}>
                <img src={icon}alt="" style={this.styles.controls.img} width={iconWidth} />
              </label>
            )
          }) }
        </div>
      </td>
    )
  }

  generateImages () {
    return (
      <td>
        <div className="mj-carousel-images" style={this.styles.images.div}>
          { this.images.map(({src, alt, href}, index) => {
            const image = <img src={src} alt={alt} style={this.styles.images.img} width="400" border="0" />

            return (
              <div
                key={`mj-carousel-image-${index + 1}`}
                className={`mj-carousel-image mj-carousel-image-${index + 1}`}
                style={index === 0 ? this.styles.images.firstImageDiv : this.styles.images.otherImageDiv}>
                { href ? <a href={href} target="_blank">{image}</a> : image }
              </div>
            )
          })}
        </div>
      </td>
    )
  }

  generateCarousel () {
    const { mjAttribute } = this.props

    return (
      <table
        border="0"
        cellpPdding="0"
        cellSpacing="0"
        width="100%"
        role="presentation"
        style={this.styles.carousel.table}
        className="mj-carousel-main">
        <tbody>
          <tr>
            {this.generateControls('previous', mjAttribute('left-icon'))}
            {this.generateImages()}
            {this.generateControls('next', mjAttribute('right-icon'))}
          </tr>
        </tbody>
      </table>
    )
  }

  render () {
    const { children, mjAttribute } = this.props

    this.images = children.map(img => img.props.mjml.get('attributes').toObject())
    this.styles = this.getStyles()

    return (
      <div
        className="mj-carousel"
        data-length={this.images.size}
        data-icon-width={mjAttribute('icon-width')}
        data-hover-border-color={mjAttribute('tb-hover-border-color')}
        data-selected-border-color={mjAttribute('tb-selected-border-color')}>
        {this.generateRadio()}
        <div className="mj-carousel-content" style={this.styles.carousel.div}>
          {mjAttribute('thumbnails') == "visible" ? this.generateThumbnails() : null}
          {this.generateCarousel()}
        </div>
      </div>
    )
  }
}

Carousel.tagName = tagName
Carousel.parentTag = parentTag
Carousel.defaultMJMLDefinition = defaultMJMLDefinition
Carousel.baseStyles = baseStyles
Carousel.postRender = postRender

export default Carousel
