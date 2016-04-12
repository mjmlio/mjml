import { MJMLElement } from 'mjml-core'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-section'
const defaultMJMLDefinition = {
  attributes: {
    'background-repeat': 'repeat',
    'padding': '20px 0',
    'background-size': 'auto'
  }
}
const baseStyles = {
  div: {
    margin: '0 auto'
  },
  table: {
    fontSize: '0px',
    width: '100%'
  },
  td: {
    textAlign: 'center',
    verticalAlign: 'top'
  }
}
const postRender = $ => {
  $('.mj-section-outlook-background').each(function () {
    const url = $(this).data('url')
    const width = $(this).data('width')

    $(this)
      .removeAttr('class')
      .removeAttr('data-url')
      .removeAttr('data-width')

    if (!url) {
      return
    }

    $(this).before(`<!--[if gte mso 9]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${width}px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="${url}" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->`)

    $(this).after(`<!--[if gte mso 9]>
        </v:textbox>
      </v:rect>
      <![endif]-->`)
  })

  $('.mj-section-outlook-open').each(function () {
    const $columnDiv = $(this).next()

    $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)

    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-section-outlook-line').each(function () {
    const $columnDiv = $(this).next()

    $(this).replaceWith(`<!--[if mso]>
    </td><td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;">
      <![endif]-->`)

    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-section-outlook-close').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->`)
  })

  return $
}

@MJMLElement
class Section extends Component {

  styles = this.getStyles()

  isFullWidth () {
    const { mjAttribute } = this.props

    return mjAttribute('full-width') == 'full-width'
  }

  getStyles () {
    const { mjAttribute, parentWidth } = this.props

    const background = mjAttribute('background-url') ? {
      background: `url(${mjAttribute('background-url')}) top center / ${mjAttribute('background-size') || ''} ${mjAttribute('background-repeat') || ''}`
    } : {
      background: mjAttribute('background-color')
    }

    return merge({}, baseStyles, {
      td: {
        fontSize: '0px',
        padding: mjAttribute('padding'),
        paddingBottom: mjAttribute('padding-bottom'),
        paddingLeft: mjAttribute('padding-left'),
        paddingRight: mjAttribute('padding-right'),
        paddingTop: mjAttribute('padding-top'),
        textAlign: mjAttribute('text-align'),
        verticalAlign: mjAttribute('vertical-align')
      },
      div: {
        maxWidth: parentWidth
      }
    }, {
      div: this.isFullWidth() ? {} : cloneDeep(background),
      table: this.isFullWidth() ? {} : cloneDeep(background),
      tableFullwidth: this.isFullWidth() ? cloneDeep(background) : {}
    })
  }

  renderFullWidthSection () {
    const { mjAttribute } = this.props

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        data-legacy-background={mjAttribute('background-url')}
        data-legacy-border="0"
        style={merge({}, this.styles.tableFullwidth, this.styles.table)}>
        <tbody>
          <tr>
            <td>
              {this.renderSection()}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderSection () {
    const { renderWrappedOutlookChildren, mjAttribute, children, parentWidth } = this.props
    const fullWidth = this.isFullWidth()

    return (
      <div style={this.styles.div}>
        <table
          cellPadding="0"
          cellSpacing="0"
          className="mj-section-outlook-background"
          data-legacy-align="center"
          data-legacy-background={fullWidth ? undefined : mjAttribute('background-url')}
          data-legacy-border="0"
          data-url={mjAttribute('background-url') || ''}
          data-width={parentWidth}
          style={this.styles.table}>
          <tbody>
            <tr>
              <td style={this.styles.td}>
                {renderWrappedOutlookChildren(children)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  render () {
    return this.isFullWidth() ? this.renderFullWidthSection() : this.renderSection()
  }

}

Section.tagName = tagName
Section.defaultMJMLDefinition = defaultMJMLDefinition
Section.baseStyles = baseStyles
Section.postRender = postRender

export default Section
