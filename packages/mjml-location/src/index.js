import { MJMLElement } from 'mjml-core'
import MJMLImage from 'mjml-image'
import MJMLText from 'mjml-text'
import React, { Component } from 'react'

const tagName = 'mj-location'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const selfClosingTag = true
const defaultMJMLDefinition = {
  attributes: {
    'align': null,
    'color': '#3aa7ed',
    'container-background-color': null,
    'font-family': 'Roboto, sans-serif',
    'font-size': '18px',
    'font-weight': '500',
    'img-src': 'http://i.imgur.com/DPCJHhy.png',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'vertical-align': null
  }
}

@MJMLElement
class Location extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return {
      text: {
        color: mjAttribute('color'),
        textDecoration: 'none'
      }
    }
  }

  getAttributes () {
    const { mjAttribute, defaultUnit } = this.props

    return {
      text: {
        'columnElement': true,
        'font-family': mjAttribute('font-family'),
        'font-size': defaultUnit(mjAttribute('font-size')),
        'font-weight': mjAttribute('font-weight'),
        'padding': '0px',
        'text-decoration': mjAttribute('text-decoration')
      },
      img: {
        'columnElement': true,
        'padding': '0px',
        'src': mjAttribute('img-src')
      }
    }
  }

  render () {
    const { mjAttribute } = this.props
    const attrs = this.getAttributes()

    const address = mjAttribute('href') || `http://maps.google.com/maps?q=${encodeURIComponent(mjAttribute('address'))}`
    const text = mjAttribute('text') || mjAttribute('address')

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        data-legacy-border="0"
        width="100%">
        <tbody>
          <MJMLImage
            {...attrs.img}
            href={address} />
          <MJMLText
            {...attrs.text}
            align="center">
            <a
              href={address}
              style={this.styles.text}
              target="_blank">
              {text}
            </a>
          </MJMLText>
        </tbody>
      </table>
    )
  }
}

Location.tagName = tagName
Location.parentTag = parentTag
Location.endingTag = endingTag
Location.defaultMJMLDefinition = defaultMJMLDefinition
Location.selfClosingTag = selfClosingTag

export default Location
