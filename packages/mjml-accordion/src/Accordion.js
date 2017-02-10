import { MJMLElement, helpers } from 'mjml-core'
import MjAccordionTitle from './AccordionTitle'
import MjAccordionText from './AccordionText'
import React, { Component } from 'react'
import find from 'lodash/find'

const tagName = 'mj-accordion'
const parentTag = ['mj-column', 'mj-hero-content']
const defaultMJMLDefinition = {
  attributes: {
    'container-background-color': null,
    'border': null,
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
  label: {
    fontSize: '13px'
  },
  input: {
    display: 'none'
  },
  title: {
    table: {
      width: '100%'
    },
    td2: {
      padding: '16px'
    },
    img: {
      display: 'none',
      width: '32px',
      height: '32px'
    }
  },
  content: {
    table: {
      width: '100%'
    }
  }
}
const postRender = $ => {
  if ($('.mj-accordion-element').length == 0) {
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

const findChildren = (elements, tagName) => find(elements, elem => elem.props.mjml.get('tagName') == tagName)

@MJMLElement
class Accordion extends Component {
  getStyles () {
    const { mjAttribute, defaultUnit } = this.props
    const iconBackground = this.title && this.title.props && this.title.props.mjml && this.title.props.mjml.get('attributes').get('background-color')

    return helpers.merge({}, baseStyles, {
      label: {
        fontFamily: mjAttribute('font-family')
      },
      title: {
        table: {
          border: mjAttribute('border')
        },
        td2: {
          background: iconBackground,
          verticalAlign: mjAttribute('icon-align')
        },
        img: {
          width: defaultUnit(mjAttribute('width'), 'px'),
          height: defaultUnit(mjAttribute('height'), 'px')
        }
      },
      content: {
        table: {
          border: mjAttribute('border'),
          borderTop: '0px'
        }
      }
    })
  }

  renderIcons () {
    const { mjAttribute } = this.props

    return (
      <td className="mj-accordion-ico" style={this.styles.title.td2}>
        <img
          src={mjAttribute('icon-unwrapped-url')}
          alt={mjAttribute('icon-unwrapped-alt')}
          className="mj-accordion-more"
          style={this.styles.title.img} />
        <img
          src={mjAttribute('icon-wrapped-url')}
          alt={mjAttribute('icon-wrapped-alt')}
          className="mj-accordion-less"
          style={this.styles.title.img} />
      </td>
    )
  }

  render () {
    const { children, mjAttribute } = this.props

    this.title = findChildren(children ? children.toArray() : [], 'mj-accordion-title')
    this.styles = this.getStyles()

    const content = findChildren(children ? children.toArray() : [], 'mj-accordion-text')
    const accordionTitle = [ this.title || <MjAccordionTitle />, this.renderIcons()]

    return (
      <label className="mj-accordion-element" style={this.styles.label}>{ // eslint-disable-line
      }
        <input className="mj-accordion-checkbox" type="checkbox" style={this.styles.input} />
        <div>
          <div className="mj-accordion-title">
            <table
              data-legacy-border="0"
              cellPadding="0"
              cellSpacing="0"
              style={this.styles.title.table}>
              <tbody>
                <tr>
                  {mjAttribute('icon-position') == 'right' ? accordionTitle : accordionTitle.reverse()}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mj-accordion-content">
            <table
              data-legacy-border="0"
              cellPadding="0"
              cellSpacing="0"
              style={this.styles.content.table}>
              <tbody>
                <tr>
                  { content || <MjAccordionText /> }
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </label>
    )
  }

}

Accordion.tagName = tagName
Accordion.parentTag = parentTag
Accordion.defaultMJMLDefinition = defaultMJMLDefinition
Accordion.baseStyles = baseStyles
Accordion.postRender = postRender

export default Accordion
