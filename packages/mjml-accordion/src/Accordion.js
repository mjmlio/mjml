import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'
import find from 'lodash/find'

const tagName = 'mj-accordion'
const parentTag = ['mj-column', 'mj-hero-content']
const defaultMJMLDefinition = {
  attributes: {
  }
}
const baseStyles = {
  input: {
    display: 'none'
  },
  title: {
    table: {
      width: '100%'
    },
    td: {
      padding: '16px',
      width: '100%'
    },
    td2: {
      padding: '16px',
      verticalAlign: 'middle'
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
    },
    td: {
      padding: '16px'
    }
  }
}
const postRender = $ => {
  if ($('.mj-accordion-element').length == 0) {
    return $
  }

  $('.mj-accordion-icons, .mj-accordion-checkbox').insertBefore($('<!--[if !mso | IE]><!-->'))
  $('.mj-accordion-icons, .mj-accordion-checkbox').insertAfter($('<!--<![endif]-->'))

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

  styles = this.getStyles()

  getStyles () {
    return helpers.merge({}, baseStyles, {
    })
  }

  render () {
    const { children } = this.props

    this.title = findChildren(children.toArray() || [], 'mj-accordion-title')
    this.content = findChildren(children.toArray() || [], 'mj-accordion-text')

    return (
      <label htmlFor="a" className="mj-accordion-element"> { // eslint-disable-line jsx-a11y/label-has-for
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
                  <td style={this.styles.title.td}>{this.title ? this.title.props.mjml.get('content') : ''}</td>
                  <td className="mj-accordion-icons" style={this.styles.title.td2}>
                    <img
                      src="http://i.imgur.com/bIXv1bk.png"
                      alt="+"
                      className="mj-accordion-more"
                      style={this.styles.title.img} />
                    <img
                      src="http://i.imgur.com/w4uTygT.png"
                      alt="-"
                      className="mj-accordion-less"
                      style={this.styles.title.img} />
                  </td>
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
                  <td style={this.styles.content.td}>{this.content ? this.content.props.mjml.get('content') : ''}</td>
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
