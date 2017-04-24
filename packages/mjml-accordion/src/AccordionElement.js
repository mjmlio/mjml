import { MJMLElement, helpers } from 'mjml-core'
import MjAccordionTitle from './AccordionTitle'
import MjAccordionText from './AccordionText'
import React, { Component } from 'react'
import find from 'lodash/find'

const tagName = 'mj-accordion-element'
const parentTag = ['mj-accordion']
const defaultMJMLDefinition = {
  attributes: {
    'background-color': null,
    'font-family': null,
    'icon-align': null,
    'icon-wrapped-url': null,
    'icon-wrapped-alt': null,
    'icon-unwrapped-url': null,
    'icon-unwrapped-alt': null,
    'icon-position': null,
    'icon-height': null,
    'icon-width': null
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

const findChildren = (elements, tagName) => find(elements, elem => elem.props.mjml.get('tagName') == tagName)

@MJMLElement
class AccordionElement extends Component {
  getStyles () {
    const { mjAttribute, defaultUnit } = this.props
    const iconBackground = this.title && this.title.props && this.title.props.mjml && this.title.props.mjml.get('attributes').get('background-color')

    return helpers.merge({}, baseStyles, {
      td: {
        background: mjAttribute('background-color')
      },
      label: {
        fontFamily: mjAttribute('font-family')
      },
      title: {
        table: {
          borderBottom: mjAttribute('border')
        },
        td2: {
          background: iconBackground,
          verticalAlign: mjAttribute('icon-align')
        },
        img: {
          width: defaultUnit(mjAttribute('icon-width'), 'px'),
          height: defaultUnit(mjAttribute('icon-height'), 'px')
        }
      },
      content: {
        table: {
          borderBottom: mjAttribute('border')
        }
      }
    })
  }

  renderIcons () {
    const { mjAttribute } = this.props

    return (
      <td className="mj-accordion-ico" style={this.styles.title.td2} key="icons">
        <img
          key="icon-wrapped"
          src={mjAttribute('icon-wrapped-url')}
          alt={mjAttribute('icon-wrapped-alt')}
          className="mj-accordion-more"
          style={this.styles.title.img} />
        <img
          key="icon-unwrapped"
          src={mjAttribute('icon-unwrapped-url')}
          alt={mjAttribute('icon-unwrapped-alt')}
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
      <tr className={mjAttribute('css-class')}>
        <td style={this.styles.td}>
          <label className="mj-accordion-element" style={this.styles.label}>{ // eslint-disable-line
          }
            <input className="mj-accordion-checkbox" type="checkbox" style={this.styles.input} />
            <div>
              <div className="mj-accordion-title" key="title">
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
              <div className="mj-accordion-content" key="content">
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
        </td>
      </tr>
    )
  }

}

AccordionElement.tagName = tagName
AccordionElement.parentTag = parentTag
AccordionElement.defaultMJMLDefinition = defaultMJMLDefinition
AccordionElement.baseStyles = baseStyles

export default AccordionElement
