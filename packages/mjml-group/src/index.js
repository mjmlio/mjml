import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'
import cx from 'classnames'

const tagName = 'mj-group'
const parentTag = ['mj-section', 'mj-navbar']
const defaultMJMLDefinition = {
  attributes: {
    'width': null,
    'background-color': null,
    'vertical-align': null
  }
}
const baseStyles = {
  div: {
    verticalAlign: 'top'
  }
}
const postRender = $ => {
  $('.mj-group-outlook-open').each(function () {
    const $parent = $(this).parent()
    const mjGroupBg = $parent.data('mj-group-background')
    const $columnDiv = $(this).next()
    const bgColor = mjGroupBg ? `bgcolor="${mjGroupBg}"` : ``
    const classes = $columnDiv.attr('data-class') ? $columnDiv.attr('data-class').split(' ').map(c => `${c}-outlook`).join(' ') : false
    $columnDiv.removeAttr('data-class')

    $(this).replaceWith(`${helpers.startConditionalTag}
      <table ${bgColor} role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;"${classes ? ` class="${classes}"` : ''}>
      ${helpers.endConditionalTag}`)

    $parent.removeAttr('data-mj-group-background')
    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-group-outlook-line').each(function () {
    const $columnDiv = $(this).next()
    const classes = $columnDiv.attr('data-class') ? $columnDiv.attr('data-class').split(' ').map(c => `${c}-outlook`).join(' ') : false
    $columnDiv.removeAttr('data-class')

    $(this).replaceWith(`${helpers.startConditionalTag}
            </td>
            <td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;"${classes ? ` class="${classes}"` : ''}>
      ${helpers.endConditionalTag}`)

    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-group-outlook-close').each(function () {
    $(this).replaceWith(`${helpers.startConditionalTag}
            </td>
          </tr>
        </table>
      ${helpers.endConditionalTag}`)
  })

  return $
}

@MJMLElement
class Group extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return helpers.merge({}, baseStyles, {
      div: {
        background: mjAttribute('background-color'),
        display: 'inline-block',
        verticalAlign: mjAttribute('vertical-align'),
        fontSize: '0px',
        lineHeight: '0px',
        textAlign: 'left',
        width: '100%'
      }
    })
  }

  getGroupClass () {
    const { mjAttribute, sibling } = this.props
    const width = mjAttribute('width')

    if (width == undefined) {
      return `mj-column-per-${parseInt(100 / sibling)}`
    }

    const { width: parsedWidth, unit } = helpers.widthParser(width)

    switch (unit) {
      case '%':
        return `mj-column-per-${parsedWidth}`

      case 'px':
        return `mj-column-px-${parsedWidth}`
    }
  }

  renderChildren () {
    const { children } = this.props

    return children.map(child => React.cloneElement(child, { mobileWidth: "mobileWidth" }))
  }

  render () {
    const { mjAttribute, sibling, renderWrappedOutlookChildren } = this.props
    const width = mjAttribute('width') || (100 / sibling)
    const mjGroupClass = this.getGroupClass()
    const divClasses = cx(mjGroupClass, 'outlook-group-fix', mjAttribute('css-class'))

    return (
      <div
        className={divClasses}
        data-class={mjAttribute('css-class')}
        data-column-width={parseInt(width)}
        data-vertical-align={this.styles.div.verticalAlign}
        data-mj-group-background={mjAttribute('background-color')}
        style={this.styles.div}>
        {renderWrappedOutlookChildren(this.renderChildren())}
      </div>
    )
  }

}

Group.tagName = tagName
Group.baseStyles = baseStyles
Group.postRender = postRender
Group.parentTag = parentTag
Group.defaultMJMLDefinition = defaultMJMLDefinition

export default Group
