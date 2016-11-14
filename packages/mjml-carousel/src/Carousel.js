import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'
import range from 'lodash/range'
import repeat from 'lodash/repeat'

const tagName = 'mj-carousel'
const parentTag = ['mj-column', 'mj-hero-content']
const defaultMJMLDefinition = {
  attributes: {
    'icon-width': '44',
    'left-icon': 'http://i.imgur.com/xTh3hln.png',
    'right-icon': 'http://i.imgur.com/os7o9kz.png',
    'thumbnails': 'visible'
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
      display: 'table-caption',
      captionSide: 'top',
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
    }
  },
  images: {
    div: {
      padding: '20px'
    },
    firstImageDiv: {},
    img: {
      borderRadius: '6px',
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
      width: '90px',
      border: '2px solid transparent',
      borderRadius: '6px',
      overflow: 'hidden'
    },
    img: {
      borderRadius: '6px',
      display: 'block',
      width: '100%',
      height: 'auto'
    }
  }
}

const postRender = $ => {
  const length = $('.mj-carousel').data('length') * 1
  const carouselCss = `<style type="text/css">
  .mj-carousel {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
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
    border-color: #fead0d !important;
  }

  .mj-carousel-image img + div,
  .mj-carousel-thumbnail img + div {
    display: none !important;
  }

  ${range(0, length).map(i => `.mj-carousel-thumbnail:hover ${repeat('+ * ', length - i - 1)}+ .mj-carousel-main .mj-carousel-image`).join(',')} {
    display: none !important;
  }

  .mj-carousel-thumbnail:hover {
    border-color: #ccc !important;
  }

  ${range(0, length).map(i => `.mj-carousel-thumbnail-${i + 1}:hover ${repeat('+ * ', length - i - 1)}+ .mj-carousel-main .mj-carousel-image-${i + 1}` ).join(',')} {
    display: block !important;
  }
  </style>`

  $('head').append(carouselCss)

  return $
}

@MJMLElement
class Carousel extends Component {

  styles = this.getStyles()

  getStyles () {
    return helpers.merge({}, baseStyles, {

    })
  }

  generateRadio () {
    return this.images.map((img, index) => {
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
    const { mjAttribute } = this.props
    const imgWidth = mjAttribute('parentWidth') / this.images.size

    return this.images.map((img, index) => {
      const imgIndex = index + 1


      return (
        <a style={this.styles.thumbnails.a} key={`mj-carousel-thumbnail-${imgIndex}`} href={`#${imgIndex}`} className={`mj-carousel-thumbnail mj-carousel-thumbnail-${imgIndex}`}>
          <label htmlFor={`mj-carousel-radio-${imgIndex}`}>
            <img src={img} alt="" style={this.styles.thumbnails.img} width={imgWidth} />
          </label>
        </a>
      )
    })
  }

  generateControls (classAffix, icon) {
    const { mjAttribute } = this.props
    const iconWidth = mjAttribute('icon-width')

    return (
      <td>
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
          { this.images.map((src, index) => {
            return (
              <div
                key={`mj-carousel-image-${index + 1}`}
                className={`mj-carousel-image mj-carousel-image-${index + 1}`}
                style={index === 0 ? this.styles.images.firstImageDiv : this.styles.images.otherImageDiv}>
                <a href="http://www.mjml.io/#1" target="_blank">
                  <img src={src} alt="" style={this.styles.images.img} width="400" border="0" />
                </a>
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
    this.images = children.map(img => img.props.mjml.get('attributes').get('src') )

    return (
      <div className="mj-carousel" data-first-image={this.images[0]} data-length={this.images.size}>
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
