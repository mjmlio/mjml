import _ from 'lodash'
import MJMLElement from './decorators/MJMLElement'
import React, { Component } from 'react'

/**
 * Sections are intended to be used as rows within your email. They will be used to structure the layout.
 */
@MJMLElement({
  tagName: 'mj-section',
  attributes: {
    'background-repeat': 'repeat',
    'padding': '20px 0',
    'background-size': 'auto'
  }
})
class Section extends Component {

  static baseStyles = {
    div: {
      margin: '0 auto'
    },
    table: {
      fontSize: 0,
      width: '100%'
    },
    td: {
      textAlign: 'center',
      verticalAlign: 'top'
    }
  }

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

    return _.merge({}, this.constructor.baseStyles, {
      td: {
        fontSize: 0,
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
      div: this.isFullWidth() ? {} : _.cloneDeep(background),
      table: this.isFullWidth() ? {} : _.cloneDeep(background),
      tableFullwidth: this.isFullWidth() ? _.cloneDeep(background) : {}
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
        style={_.merge({}, this.styles.tableFullwidth, this.styles.table)}>
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

export default Section
