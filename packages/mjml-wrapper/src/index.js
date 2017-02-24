import { helpers } from 'mjml-core'
import merge from 'lodash/merge'
import Section from 'mjml-section'

const tagName = 'mj-wrapper'
const parentTag = ['mj-container']
const defaultMJMLDefinition = merge({}, Section.defaultMJMLDefinition, {
  inheritedAttributes: [
    'width'
  ]
})
const postRender = ($) => {
  $('.mj-wrapper-outlook-open').each(function () {
    const $columnDiv = $(this).next()

    $(this).replaceWith(`${helpers.startConditionalTag}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:${$columnDiv.data('vertical-align')};width:${parseInt($(this).data('width'))}px;">
      ${helpers.endConditionalTag}`)

    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-wrapper-outlook-line').each(function () {
    const $columnDiv = $(this).next()
    const width = parseInt($(this).data('width'))

    $(this).replaceWith(`${helpers.startConditionalTag}
      </td><tr><tr><td style="vertical-align:${$columnDiv.data('vertical-align')};width:${width}px;">
      ${helpers.endConditionalTag}`)

    $columnDiv.removeAttr('data-vertical-align')
  })

  $('.mj-wrapper-outlook-close').each(function () {
    $(this).replaceWith(`${helpers.startConditionalTag}
      </td></tr></table>
      ${helpers.endConditionalTag}`)
  })

  return $
}

class Wrapper extends Section { }

Wrapper.tagName = tagName
Wrapper.parentTag = parentTag
Wrapper.postRender = postRender
Wrapper.defaultMJMLDefinition = defaultMJMLDefinition

export default Wrapper
