import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-accordion'
const parentTag = ['mj-column', 'mj-hero-content']
const defaultMJMLDefinition = {
  attributes: {
    'container-background-color': null,
    'border':  '2px solid black',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'icon-align': 'middle',
    'icon-wrapped-url': 'http://i.imgur.com/bIXv1bk.png',
    'icon-wrapped-alt': '+',
    'icon-unwrapped-url': 'http://i.imgur.com/w4uTygT.png',
    'icon-unwrapped-alt': '-',
    'icon-position': 'right',
    'icon-height': '32px',
    'icon-width': '32px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px'
  }
}
const baseStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  }
}
const postRender = $ => {
  if ($('.mj-accordion').length == 0) {
    return $
  }

  $('<!--[if !mso | IE]><!-->').insertBefore($('.mj-accordion-ico, .mj-accordion-checkbox'))
  $('<!--<![endif]-->').insertAfter($('.mj-accordion-ico, .mj-accordion-checkbox'))

  $('head').append(`
    <style type="text/css" id="mj-accordion-css">
      noinput.mj-accordion-checkbox { display:block!important; }

      @media yahoo, only screen and (min-width:0) {
        .mj-accordion-element { display:block; }
        input.mj-accordion-checkbox, .mj-accordion-less { display:none!important; }
        input.mj-accordion-checkbox + * .mj-accordion-title { cursor:pointer; touch-action:manipulation; -webkit-user-select:none; -moz-user-select:none; user-select:none; }
        input.mj-accordion-checkbox + * .mj-accordion-content { overflow:hidden; display:none; }
        input.mj-accordion-checkbox + * .mj-accordion-more { display:block!important; }
        input.mj-accordion-checkbox:checked + * .mj-accordion-content { display:block; }
        input.mj-accordion-checkbox:checked + * .mj-accordion-more { display:none!important; }
        input.mj-accordion-checkbox:checked + * .mj-accordion-less { display:block!important; }
      }

      @goodbye { @gmail }
    </style>
  `)

  return $
}

@MJMLElement
class Accordion extends Component {
  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return helpers.merge({}, baseStyles, {
      table: {
        border: mjAttribute('border'),
        borderBottom: 'none',
        fontFamily: mjAttribute('font-family')
      }
    })
  }

  renderAccordion (accordion) {
    const { mjAttribute } = this.props
    const attributes = accordion.props.mjml && accordion.props.mjml.get('attributes')

    if (!attributes) {
      return accordion
    }

    const computedAttributes = [
      'icon-wrapped-url',
      'icon-wrapped-alt',
      'icon-unwrapped-url',
      'icon-unwrapped-alt',
      'icon-position',
      'icon-height',
      'icon-width'
    ].reduce((res, attr) => {
      if (!attributes.get(attr)) {
        res['attributes'][attr] = mjAttribute(attr)
      }

      return res
    }, {
      attributes: {
        'border': mjAttribute('border')
      }
    })

    return React.cloneElement(accordion, { mjml: accordion.props.mjml.mergeDeep(computedAttributes) })
  }

  render () {
    const { children } = this.props

    return (
      <table
        data-border="0"
        cellPadding="0"
        cellSpacing="0"
        style={this.styles.table}
        className="mj-accordion">
        <tbody>
          { children.map(c => this.renderAccordion(c)) }
        </tbody>
      </table>
    )
  }

}

Accordion.tagName = tagName
Accordion.parentTag = parentTag
Accordion.defaultMJMLDefinition = defaultMJMLDefinition
Accordion.baseStyles = baseStyles
Accordion.postRender = postRender

export default Accordion
