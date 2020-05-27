import mjml2html, { registerComponent } from 'mjml-core'
import { registerDependencies } from 'mjml-validator'

import { Social, SocialElement } from 'mjml-social'
import { Navbar, NavbarLink } from 'mjml-navbar'
import { Carousel, CarouselImage } from 'mjml-carousel'
import {
  Accordion,
  AccordionElement,
  AccordionText,
  AccordionTitle,
} from 'mjml-accordion'

registerComponent(require('mjml-body'))
registerComponent(require('mjml-head'))
registerComponent(require('mjml-head-attributes'))
registerComponent(require('mjml-head-breakpoint'))
registerComponent(require('mjml-head-html-attributes'))
registerComponent(require('mjml-head-font'))
registerComponent(require('mjml-head-preview'))
registerComponent(require('mjml-head-style'))
registerComponent(require('mjml-head-title'))
registerComponent(require('mjml-hero'))
registerComponent(require('mjml-button'))
registerComponent(require('mjml-column'))
registerComponent(require('mjml-divider'))
registerComponent(require('mjml-group'))
registerComponent(require('mjml-image'))

registerComponent(require('mjml-raw'))
registerComponent(require('mjml-section'))
registerComponent(require('mjml-spacer'))
registerComponent(require('mjml-text'))
registerComponent(require('mjml-table'))
registerComponent(require('mjml-wrapper'))

registerComponent(Social)
registerComponent(SocialElement)
registerComponent(Navbar)
registerComponent(NavbarLink)
registerComponent(Accordion)
registerComponent(AccordionElement)
registerComponent(AccordionText)
registerComponent(AccordionTitle)
registerComponent(Carousel)
registerComponent(CarouselImage)

registerDependencies(require('./dependencies'))

export default mjml2html
