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
    $(this).replaceWith(`${helpers.startConditionalTag}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="width:${parseInt($(this).data('width'))}px;">
      ${helpers.endConditionalTag}`)
  })

  $('.mj-wrapper-outlook-line').each(function () {
    const width = parseInt($(this).data('width'))

    $(this).replaceWith(`${helpers.startConditionalTag}
      </td></tr><tr><td style="width:${width}px;">
      ${helpers.endConditionalTag}`)
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
