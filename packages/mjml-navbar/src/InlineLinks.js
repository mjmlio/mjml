import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import url from 'url'
import React, { Component } from 'react'
import crypto from 'crypto'

const tagName = 'mj-inline-links'
const defaultMJMLDefinition = {
  attributes: {
    'align': 'center',
    'ico-align': 'center',
    'ico-open': '9776',
    'ico-close': '8855',
    'ico-color': '#000000',
    'ico-font-size': '30px',
    'ico-font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'ico-text-transform': 'uppercase',
    'ico-padding': '10px',
    'ico-text-decoration': 'none',
    'ico-line-height': '30px'
  }
}

const baseStyles = {
  div: {
    'width': '100%'
  },
  trigger: {
    display: 'none',
    maxHeight: '0px',
    maxWidth: '0px',
    fontSize: '0px',
    overflow: 'hidden'
  },
  label: {
    display: 'block',
    cursor: 'pointer',
    msoHide: 'all',
    MozUserSelect: 'none',
    userSelect: 'none'
  },
  icoOpen: {
    msoHide: 'all'
  },
  icoClose: {
    display: 'none',
    msoHide: 'all'
  }
}
const postRender = $ => {
  $('.mj-inline-links')
    .each(function () {
      $(this)
        .prepend(`<!--[if gte mso 9]>
  			  <table border="0" cellpadding="0" cellspacing="0" align="${$(this).data('align')}">
            <tr>
  		  <![endif]-->`)
        .append(`<!--[if gte mso 9]>
            </tr>
          </table>
        <![endif]-->`)
        .removeAttr('data-align')
    })

  $('.mj-menu-trigger')
    .each(function () {
      const id = $(this).children('label').attr('for')

      $(this)
        .before(`<!--[if !mso]><!-->
          <input type="checkbox" id="${id}" class="mj-menu-checkbox" style="display:none !important; max-height:0; visibility:hidden;" />
        <!--<![endif]-->`)
    })

  if ($('.mj-menu-trigger').length) {
    $('head')
      .append(`<style type="text/css">
        noinput.mj-menu-checkbox { display:block!important; max-height:none!important; visibility:visible!important; }

        @media only screen and (max-width:480px) {
          .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links { display:none!important; }
          .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-inline-links,
          .mj-menu-checkbox[type="checkbox"] ~ .mj-menu-trigger { display:block!important; max-width:none!important; max-height:none!important; font-size:inherit!important; }
          .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links > a { display:block!important; }
          .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-close { display:block!important; }
          .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-open { display:none!important; }
        }
      </style>`)
  }

  return $
}

@MJMLElement
class InlineLinks extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit, getPadding } = this.props

    return merge({}, baseStyles, {
      div: {
        textAlign: mjAttribute('align')
      },
      label: {
        textAlign: mjAttribute('ico-align'),
        color: mjAttribute('ico-color'),
        fontSize: defaultUnit(mjAttribute('ico-font-size'), 'px'),
        fontFamily: mjAttribute('ico-font-family'),
        textTransform: mjAttribute('ico-text-transform'),
        textDecoration: mjAttribute('ico-text-decoration'),
        lineHeight: defaultUnit(mjAttribute('ico-line-height'), 'px'),
        paddingTop: getPadding('top', 'ico-'),
        paddingLeft: getPadding('left', 'ico-'),
        paddingRight: getPadding('right', 'ico-'),
        paddingBottom: getPadding('bottom', 'ico-')
      }
    })
  }

  renderChildren () {
    const { children, mjAttribute } = this.props
    const baseUrl = mjAttribute('base-url')
    const perform = (mjml) => {
      if (mjml.get('tagName') === 'mj-link') {
        mjml = mjml.setIn(['attributes', 'href'], url.resolve(baseUrl, mjml.getIn(['attributes', 'href'])))
      }
      return mjml
    }

    return children.map(child => React.cloneElement(child, { mjml: perform(child.props.mjml) }))
  }

  renderHamburger () {
    const { mjAttribute } = this.props
    const key = crypto.randomBytes(8).toString('hex')

    return (
      <div
        className="mj-menu-trigger"
        style={this.styles.trigger}>
        <label
          htmlFor={key}
          className="mj-menu-label"
          style={this.styles.label}>
          <span
            className="mj-menu-icon-open"
            style={this.styles.icoOpen}>
            {String.fromCharCode(mjAttribute('ico-open'))}
          </span>
          <span
            className="mj-menu-icon-close"
            style={this.styles.icoClose}>
            {String.fromCharCode(mjAttribute('ico-close'))}
          </span>
        </label>
      </div>
    )
  }

  render () {
    const { mjAttribute } = this.props

    return (
      <div>
        { mjAttribute('hamburger') === 'hamburger'
          ? this.renderHamburger()
          : null }
        <div
          className="mj-inline-links"
          style={this.styles.div}
          data-align={mjAttribute('align')}>
          {this.renderChildren()}
        </div>
      </div>
    )
  }
}

InlineLinks.tagName = tagName
InlineLinks.defaultMJMLDefinition = defaultMJMLDefinition
InlineLinks.baseStyles = baseStyles
InlineLinks.postRender = postRender

export default InlineLinks
