import { MJMLElement, helpers } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-divider'
const parentTag = ['mj-column']
const closingTag = false
const defaultMJMLDefinition = {
  attributes: {
    'align': null,
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    'container-background-color': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'vertical-align': null,
    'width': '100%'
  }
}
const baseStyles = {
  p: {
    fontSize: '1px',
    margin: '0px auto'
  }
}
const postRender = $ => {
  $('.mj-divider-outlook').each(function () {
    const insertNode = `<table align="center" border="0" cellpadding="0" cellspacing="0" style="${$(this).attr('style')}" width="${$(this).data('divider-width')}"><tr><td style="height:0;line-height:0;">&nbsp;</td></tr></table>`

    $(this)
      .removeAttr('data-divider-width')
      .removeAttr('class')
      .after(`${helpers.startConditionalTag}${insertNode}${helpers.endConditionalTag}`)
  })

  return $
}
const schemaXsd = () => (
  `<xs:complexType name="${tagName}">
    ${Object.keys(defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
  </xs:complexType>`
)

@MJMLElement
class Divider extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      p: {
        borderTop: `${defaultUnit(mjAttribute('border-width'))} ${mjAttribute('border-style')} ${mjAttribute('border-color')}`,
        width: defaultUnit(mjAttribute('width'))
      }
    })
  }

  outlookWidth () {
    const { mjAttribute } = this.props
    const parentWidth = parseInt(mjAttribute('parentWidth'))
    const { width, unit } = helpers.widthParser(mjAttribute('width'))

    switch (unit) {
      case '%':
        return parentWidth * width / 100

      default:
        return width
    }
  }

  render () {
    return (
      <p
        className="mj-divider-outlook"
        data-divider-width={this.outlookWidth()}
        style={this.styles.p} />
    )
  }

}

Divider.tagName = tagName
Divider.parentTag = parentTag
Divider.closingTag = closingTag
Divider.defaultMJMLDefinition = defaultMJMLDefinition
Divider.baseStyles = baseStyles
Divider.postRender = postRender
Divider.schemaXsd = schemaXsd

export default Divider
