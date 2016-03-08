import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'

import MJImage from './Image'
import MJText  from './Text'

@MJMLColumnElement({
  tagName: 'mj-location',
  attributes: {
    'color': '#3aa7ed',
    'font-family': 'Roboto, sans-serif',
    'font-size': '18px',
    'font-weight': 500,
    'padding': '10px 25px',
    'img-src': 'http://i.imgur.com/DPCJHhy.png'
  }
})
class Location extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      text: {
        color: mjAttribute('color'),
        textDecoration: 'none'
      }
    })
  }

  getAttributes () {
    const { mjAttribute } = this.props

    return {
      text: {
        'font-family': mjAttribute('font-family'),
        'font-size': mjAttribute('font-size'),
        'font-weight': mjAttribute('font-weight'),
        'text-decoration': mjAttribute('text-decoration'),
        'padding': 0
      },
      img: {
        'padding': 0,
        'src': mjAttribute('img-src')
      }
    }
  }

  render () {
    const { mjAttribute } = this.props
    const attrs  = this.getAttributes()

    const address = `http://maps.google.com/maps?q=${encodeURIComponent(mjAttribute('address'))}`
    const text    = mjAttribute('text') || mjAttribute('address')

    return (
      <table width="100%">
        <tbody>
          <MJImage
            {...attrs.img}
            href={address} />
          <MJText
            {...attrs.text}
            align="center">
            <a style={this.styles.text} href={address} target="_blank">{text}</a>
          </MJText>
        </tbody>
      </table>
    )
  }
}

export default Location
