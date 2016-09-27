import { MJMLElement } from 'mjml-core'
// import Image from 'mjml-image'
import Image from '../../mjml-image/src'
import React from 'react'

const tagName = 'mj-chart'
const defaultMJMLDefinition = {
  attributes: {
    'height': 'auto',
    'padding': '10px 25px',
    'align': 'center',
    'alt': '',
    'border': 'none',
    'border-radius': '',
    'href': '',
    'src': '',
    'target': '_blank',
    'title': ''
  }
}
const endingTag = true
const baseStyles = {
  table: {
    borderCollapse: 'collapse',
    borderSpacing: '0px'
  },
  img: {
    border: 'none',
    borderRadius: '',
    display: 'block',
    outline: 'none',
    textDecoration: 'none',
    width: '100%'
  }
}

@MJMLElement
class Chart extends Image {

  renderImage () {
    const { mjAttribute } = this.props

    const img = (
      <img
        data-fg="ok"
        alt={mjAttribute('alt')}
        title={mjAttribute('title')}
        height={mjAttribute('height')}
        src={mjAttribute('src')}
        style={this.styles.img}
        width={this.getContentWidth()} />
    )

    if (mjAttribute('href') != '') {
      return (
        <a
          href={mjAttribute('href')}
          target={mjAttribute('target')}>
          {img}
        </a>
      )
    }

    return img
  }
}

Chart.tagName = tagName
Chart.defaultMJMLDefinition = defaultMJMLDefinition
Chart.endingTag = endingTag
Chart.baseStyles = baseStyles

export default Chart
