import { MJMLElement } from 'mjml-core'
import { Component } from 'react'

const tagName = 'mj-accordion-text'
const endingTag = true
const parentTag = ['mj-accordion']
const defaultMJMLDefinition = {
  attributes: {
  }
}
const baseStyles = {
}

@MJMLElement
class AccordionText extends Component {
  render () {
    // None should call this...
    return null
  }
}

AccordionText.tagName = tagName
AccordionText.endingTag = endingTag
AccordionText.parentTag = parentTag
AccordionText.defaultMJMLDefinition = defaultMJMLDefinition
AccordionText.baseStyles = baseStyles

export default AccordionText
