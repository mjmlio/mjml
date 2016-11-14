import { MJMLElement } from 'mjml-core'
import { Component } from 'react'

const tagName = 'mj-carousel-image'
const endingTag = true
const selfClosing = true
const parentTag = ['mj-carousel']
const defaultMJMLDefinition = {
  attributes: {
    src: null,
    alt: null
  }
}
const baseStyles = {
}

@MJMLElement
class CarouselImage extends Component {
  render () {
    return null
  }

}

CarouselImage.tagName = tagName
CarouselImage.endingTag = endingTag
CarouselImage.parentTag = parentTag
CarouselImage.selfClosing = selfClosing
CarouselImage.defaultMJMLDefinition = defaultMJMLDefinition
CarouselImage.baseStyles = baseStyles

export default CarouselImage
