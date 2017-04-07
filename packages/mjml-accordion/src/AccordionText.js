import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'
import merge from 'lodash/merge'

const tagName = 'mj-accordion-text'
const endingTag = true
const parentTag = ['mj-accordion-element']
const defaultMJMLDefinition = {
  attributes: {
    'background-color': null,
    'font-size': '13px',
    'font-family': null,
    'color': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '16px'
  }
}
const baseStyles = {
  td: {}
}

@MJMLElement
class AccordionText extends Component {
  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      td: {
        background: mjAttribute('background-color'),
        color: mjAttribute('color'),
        fontSize: mjAttribute('font-size'),
        fontFamily: mjAttribute('font-family'),
        padding: defaultUnit(mjAttribute('padding'), 'px'),
        paddingTop: defaultUnit(mjAttribute('padding-top'), 'px'),
        paddingBottom: defaultUnit(mjAttribute('padding-bottom'), 'px'),
        paddingRight: defaultUnit(mjAttribute('padding-right'), 'px'),
        paddingLeft: defaultUnit(mjAttribute('padding-left'), 'px')
      }
    })
  }

  render () {
    const { mjContent, mjAttribute } = this.props

    return (
      <td className={mjAttribute('css-class')} style={this.styles.td}>
        { mjContent() }
      </td>
    )
  }
}

AccordionText.tagName = tagName
AccordionText.endingTag = endingTag
AccordionText.parentTag = parentTag
AccordionText.defaultMJMLDefinition = defaultMJMLDefinition
AccordionText.baseStyles = baseStyles

export default AccordionText
