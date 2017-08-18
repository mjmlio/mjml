import { MJMLElement, helpers } from 'mjml-core'
import cloneDeep from 'lodash/cloneDeep'
import React, { Component } from 'react'

const tagName = 'mj-section'
const parentTag = ['mj-container', 'mj-wrapper']
const defaultMJMLDefinition = {
  attributes: {
    'background-color': null,
    'background-url': null,
    'background-repeat': 'repeat',
    'background-size': 'auto',
    'border': null,
    'border-bottom': null,
    'border-left': null,
    'border-radius': null,
    'border-right': null,
    'border-top': null,
    'direction': 'ltr',
    'full-width': null,
    'padding': '20px 0',
    'padding-top': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'text-align': 'center',
    'vertical-align': 'top',
    'css-class': ''
  }
}
const baseStyles = {
  div: {
    margin: '0px auto'
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
    const width = parseInt($(this).data('width'))

    $(this)
      .removeAttr('class')
      .removeAttr('data-url')
      .removeAttr('data-width')

    if (!url) {
      return
    }

    $(this).before(`${helpers.startConditionalTag}
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${width}px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="${url}" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      ${helpers.endConditionalTag}`)

    $(this).after(`${helpers.startConditionalTag}
        <p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p>
        </v:textbox>
      </v:rect>
      ${helpers.endConditionalTag}`)
  })

  $('.mj-section-outlook-open').each(function () {
    const $columnDiv = $(this).next()
    const classes = $columnDiv.attr('data-class') ? $columnDiv.attr('data-class')
                                                              .split(' ')
                                                              .map(c => `${c}-outlook`)
                                                              .join(' ') : false

    $(this).replaceWith(`${helpers.startConditionalTag}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;"${classes ? ` class="${classes}"` : ''}>
      ${helpers.endConditionalTag}`)

    $columnDiv.removeAttr('data-vertical-align')
    $columnDiv.removeAttr('data-class')
  })

  $('.mj-section-outlook-line').each(function () {
    const $columnDiv = $(this).next()
    const width = parseInt($(this).data('width'))
    const classes = $columnDiv.attr('data-class') ? $columnDiv.attr('data-class')
                                                              .split(' ')
                                                              .map(c => `${c}-outlook`)
                                                              .join(' ') : false

    $(this).replaceWith(`${helpers.startConditionalTag}
      </td><td style="vertical-align:${$columnDiv.data('vertical-align')};width:${width}px;"${classes ? ` class="${classes}"` : ''}>
      ${helpers.endConditionalTag}`)

    $columnDiv.removeAttr('data-vertical-align')
    $columnDiv.removeAttr('data-class')
  })

  $('.mj-section-outlook-close').each(function () {
    $(this).replaceWith(`${helpers.startConditionalTag}
      </td></tr></table>
      ${helpers.endConditionalTag}`)
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
    const { mjAttribute, parentWidth, defaultUnit } = this.props

    const background = mjAttribute('background-url') ? {
      background: `${mjAttribute('background-color') || ''} url(${mjAttribute('background-url')}) top center / ${mjAttribute('background-size') || ''} ${mjAttribute('background-repeat') || ''}`.trim()
    } : {
      background: mjAttribute('background-color')
    }

    return helpers.merge({}, baseStyles, {
      table: {
        borderRadius: defaultUnit(mjAttribute('border-radius'), "px")
      },
      td: {
        border: mjAttribute('border'),
        borderBottom: mjAttribute('border-bottom'),
        borderLeft: mjAttribute('border-left'),
        borderRight: mjAttribute('border-right'),
        borderTop: mjAttribute('border-top'),
        direction: mjAttribute('direction'),
        fontSize: '0px',
        padding: defaultUnit(mjAttribute('padding'), 'px'),
        paddingBottom: defaultUnit(mjAttribute('padding-bottom'), 'px'),
        paddingLeft: defaultUnit(mjAttribute('padding-left'), 'px'),
        paddingRight: defaultUnit(mjAttribute('padding-right'), 'px'),
        paddingTop: defaultUnit(mjAttribute('padding-top'), 'px'),
        textAlign: mjAttribute('text-align'),
        verticalAlign: mjAttribute('vertical-align')
      },
      div: {
        borderRadius: defaultUnit(mjAttribute('border-radius'), "px"),
        maxWidth: defaultUnit(parentWidth)
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
        className={mjAttribute('css-class')}
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        data-legacy-background={mjAttribute('background-url')}
        data-legacy-border="0"
        style={helpers.merge({}, this.styles.tableFullwidth, this.styles.table)}
        data-class={mjAttribute('css-class')}
      >
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
    const divProps = fullWidth ? {} : {
      "className": mjAttribute('css-class'),
      "data-class": mjAttribute('css-class')
    }

    return (
      <div
        style={this.styles.div}
        {...divProps}
      >
        <table
          role="presentation"
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
Section.parentTag = parentTag
Section.defaultMJMLDefinition = defaultMJMLDefinition
Section.baseStyles = baseStyles
Section.postRender = postRender

export default Section
