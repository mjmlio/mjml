import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'
import merge from 'lodash/merge'

const tagName = 'mj-hero-content'
const parentTag = ['mj-hero']
const defaultMJMLDefinition = {
  attributes: {
    'width': '100%',
    'padding': '0px',
    'align': 'center',
    'background-color': 'transparent'
  }
}
const endingTag = false

const baseStyles = {
  div: {
    float: 'center'
  },
  table: {
    width: '100%',
    margin: '0px'
  }
}

const postRender = $ => {
  const $mjHeroContent = $('.mj-hero-content')

  $mjHeroContent.each(function () {
    const width = $(this).css('width')
    const align = $(this).data('align')
    const backgroundColor = $(this).data('background-color')

    $(this).before(`${helpers.startConditionalTag}
      <table border="0" cellpadding="0" cellspacing="0" align="${align}" width="${width.replace('px', '')}" style="width:${width};"><tr><td style="padding:0;background-color:${backgroundColor};">
      ${helpers.endConditionalTag}`)
    .after(`${helpers.startConditionalTag}
      </td></tr></table>
      ${helpers.endConditionalTag}`)
    .removeAttr('data-background-color')
    .removeAttr('data-align')
  })

  if ($mjHeroContent.length > 0 ) {
    $('head').append(`<style type="text/css">
      @media only screen and (max-width:480px) {
        .mj-hero-content {
          width: 100% !important;
        }
      }
    </style>`)
  }

  return $
}

@MJMLElement
class HeroContent extends Component {
  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit, getPadding } = this.props

    return merge({}, baseStyles, {
      div: {
        float: mjAttribute('align'),
        margin: mjAttribute('align') === 'center' ? '0px auto' : '0px',
        width: defaultUnit(mjAttribute('width'), 'px'),
        backgroundColor: mjAttribute('background-color')
      },
      td: {
        paddingTop: getPadding('top'),
        paddingLeft: getPadding('left'),
        paddingRight: getPadding('right'),
        paddingBottom: getPadding('bottom')
      }
    })
  }

  render () {
    const { mjAttribute, children } = this.props

    return (
      <div
        className="mj-hero-content"
        data-align={mjAttribute('align')}
        data-background-color={mjAttribute('background-color')}
        style={this.styles.div}>
        <table
          border="0"
          cellPadding="0"
          cellSpacing="0"
          style={this.styles.table}
          >
          <tbody>
            <tr>
              <td style={this.styles.td}>
                <table style={this.styles.table}>
                  <tbody>
                    {children}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

HeroContent.tagName = tagName
HeroContent.defaultMJMLDefinition = defaultMJMLDefinition
HeroContent.endingTag = endingTag
HeroContent.baseStyles = baseStyles
HeroContent.postRender = postRender
HeroContent.parentTag = parentTag

export default HeroContent
