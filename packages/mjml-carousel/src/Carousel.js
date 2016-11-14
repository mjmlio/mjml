import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'
import range from 'lodash/range'

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
    firstDiv: {},
    img: {
      display: 'block',
      width: '600px',
      maxWidth: '100%',
      height: 'auto'
    },
    otherDiv: {
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
    img: {
      display: 'block',
      width: '100%',
      height: 'auto'
    }
  }
}

const postRender = $ => {
  const carouselCss = `<style type="text/css">
  .mj-carousel {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .mj-carousel-main {
    display: table-caption;
    caption-side: top;
    width: 100%;
  }

  .mj-carousel-content {
    display: table;
    width: 100%;
    table-layout: fixed;
    text-align: center;
    font-size: 0;
  }

  .mj-carousel-thumbnail {
    display: inline-block;
    width: 90px;
    border: 2px solid transparent;
    border-radius: 6px;
    overflow: hidden;
  }

  .mj-carousel-thumbnail img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 6px;
  }

  .mj-carousel-image img {
    border-radius: 6px;
  }

  .mj-carousel-images {
    padding: 20px;
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

  .mj-carousel-radio:checked + * + * + * + * + .mj-carousel-content .mj-carousel-image,
  .mj-carousel-radio:checked + * + * + * + .mj-carousel-content .mj-carousel-image,
  .mj-carousel-radio:checked + * + * + .mj-carousel-content .mj-carousel-image,
  .mj-carousel-radio:checked + * + .mj-carousel-content .mj-carousel-image,
  .mj-carousel-radio:checked + .mj-carousel-content .mj-carousel-image {
    display: none !important;
  }

  .mj-carousel-radio-1:checked + * + * + * + * + .mj-carousel-content .mj-carousel-image-1,
  .mj-carousel-radio-2:checked + * + * + * + .mj-carousel-content .mj-carousel-image-2,
  .mj-carousel-radio-3:checked + * + * + .mj-carousel-content .mj-carousel-image-3,
  .mj-carousel-radio-4:checked + * + .mj-carousel-content .mj-carousel-image-4,
  .mj-carousel-radio-5:checked + .mj-carousel-content .mj-carousel-image-5 {
    display: block !important;
  }

  .mj-carousel-previous-icons,
  .mj-carousel-next-icons,
  .mj-carousel-radio-1:checked + * + * + * + * + .mj-carousel-content .mj-carousel-next-2,
  .mj-carousel-radio-1:checked + * + * + * + * + .mj-carousel-content .mj-carousel-previous-5,
  .mj-carousel-radio-2:checked + * + * + * + .mj-carousel-content .mj-carousel-next-3,
  .mj-carousel-radio-2:checked + * + * + * + .mj-carousel-content .mj-carousel-previous-1,
  .mj-carousel-radio-3:checked + * + * + .mj-carousel-content .mj-carousel-next-4,
  .mj-carousel-radio-3:checked + * + * + .mj-carousel-content .mj-carousel-previous-2,
  .mj-carousel-radio-4:checked + * + .mj-carousel-content .mj-carousel-next-5,
  .mj-carousel-radio-4:checked + * + .mj-carousel-content .mj-carousel-previous-3,
  .mj-carousel-radio-5:checked + .mj-carousel-content .mj-carousel-next-1,
  .mj-carousel-radio-5:checked + .mj-carousel-content .mj-carousel-previous-4 {
    display: block !important;
  }

  .mj-carousel-radio-1:checked + * + * + * + * + .mj-carousel-content .mj-carousel-thumbnail-1,
  .mj-carousel-radio-2:checked + * + * + * + .mj-carousel-content .mj-carousel-thumbnail-2,
  .mj-carousel-radio-3:checked + * + * + .mj-carousel-content .mj-carousel-thumbnail-3,
  .mj-carousel-radio-4:checked + * + .mj-carousel-content .mj-carousel-thumbnail-4,
  .mj-carousel-radio-5:checked + .mj-carousel-content .mj-carousel-thumbnail-5 {
    border-color: #fead0d;
  }

  .mj-carousel-image img + div,
  .mj-carousel-thumbnail img + div {
    display: none !important;
  }

  .mj-carousel-thumbnail:hover + * + * + * + * + .mj-carousel-main .mj-carousel-image,
  .mj-carousel-thumbnail:hover + * + * + * + .mj-carousel-main .mj-carousel-image,
  .mj-carousel-thumbnail:hover + * + * + .mj-carousel-main .mj-carousel-image,
  .mj-carousel-thumbnail:hover + * + .mj-carousel-main .mj-carousel-image,
  .mj-carousel-thumbnail:hover + .mj-carousel-main .mj-carousel-image {
    display: none !important;
  }

  .mj-carousel-thumbnail:hover {
    border-color: #ccc;
  }

  .mj-carousel-thumbnail-1:hover + * + * + * + * + .mj-carousel-main .mj-carousel-image-1,
  .mj-carousel-thumbnail-2:hover + * + * + * + .mj-carousel-main .mj-carousel-image-2,
  .mj-carousel-thumbnail-3:hover + * + * + .mj-carousel-main .mj-carousel-image-3,
  .mj-carousel-thumbnail-4:hover + * + .mj-carousel-main .mj-carousel-image-4,
  .mj-carousel-thumbnail-5:hover + .mj-carousel-main .mj-carousel-image-5 {
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
      return <input key={`mj-carousel-radio-${index + 1}`} defaultChecked={index === 0} type="radio" name="mj-carousel-radio" id={`mj-carousel-radio-${index + 1}`} style={this.styles.radio.input} />
    })
  }

  generateThumbnails () {
    const { mjAttribute } = this.props
    const imgWidth = mjAttribute('parentWidth') / this.images.size

    return this.images.map((img, index) => {
      const imgIndex = index + 1


      return (
        <a key={`mj-carousel-thumbnail-${imgIndex}`} href={`#${imgIndex}`} className={`mj-carousel-thumbnail mj-carousel-thumbnail-${imgIndex}`}>
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
              <label key={`mj-carousel-radio-${i}`} htmlFor={`mj-carousel-radio-${i}`} className={`mj-carousel-previous mj-carousel-previous-${i}`}>
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
        <div className="mj-carousel-images">
          { this.images.map((src, index) => {
            return (
              <div key={`mj-carousel-image-${index + 1}`} className={`mj-carousel-image mj-carousel-image-${index + 1}`} style={index === 0 ? this.styles.images.firstDiv : this.styles.images.otherDiv}>
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
      <table border="0" cellpPdding="0" cellSpacing="0" width="100%" role="presentation" className="mj-carousel-main">
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
      <div className="mj-carousel" data-first-image={this.images[0]}>
        {this.generateRadio()}
        <div className="mj-carousel-content">
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
