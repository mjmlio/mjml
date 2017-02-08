import { MJMLElement } from 'mjml-core'
import { Component } from 'react'

const tagName = 'mj-accordion-title'
const endingTag = true
const parentTag = ['mj-accordion']
const defaultMJMLDefinition = {
  attributes: {
  }
}
const baseStyles = {
}

@MJMLElement
class AccordionTitle extends Component {
  render () {
    // None should call this...
    return null
  }
}

AccordionTitle.tagName = tagName
AccordionTitle.endingTag = endingTag
AccordionTitle.parentTag = parentTag
AccordionTitle.defaultMJMLDefinition = defaultMJMLDefinition
AccordionTitle.baseStyles = baseStyles

export default AccordionTitle
