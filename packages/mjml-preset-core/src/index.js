import { Social, SocialElement } from 'mjml-social'
import { Navbar, NavbarLink } from 'mjml-navbar'
import { Carousel, CarouselImage } from 'mjml-carousel'
import {
  Accordion,
  AccordionElement,
  AccordionText,
  AccordionTitle,
} from 'mjml-accordion'
import Body from 'mjml-body'
import Head from 'mjml-head'
import HeadAttributes from 'mjml-head-attributes'
import HeadBreakpoint from 'mjml-head-breakpoint'
import HeadHtmlAttributes from 'mjml-head-html-attributes'
import HeadFont from 'mjml-head-font'
import HeadPreview from 'mjml-head-preview'
import HeadStyle from 'mjml-head-style'
import HeadTitle from 'mjml-head-title'
import Hero from 'mjml-hero'
import Button from 'mjml-button'
import Column from 'mjml-column'
import Divider from 'mjml-divider'
import Group from 'mjml-group'
import Image from 'mjml-image'
import Raw from 'mjml-raw'
import Section from 'mjml-section'
import Spacer from 'mjml-spacer'
import Text from 'mjml-text'
import Table from 'mjml-table'
import Wrapper from 'mjml-wrapper'
import dependencies from './dependencies'

const components = [
  Body,
  Head,
  HeadAttributes,
  HeadBreakpoint,
  HeadHtmlAttributes,
  HeadFont,
  HeadPreview,
  HeadStyle,
  HeadTitle,
  Hero,
  Button,
  Column,
  Divider,
  Group,
  Image,

  Raw,
  Section,
  Spacer,
  Text,
  Table,
  Wrapper,

  Social,
  SocialElement,
  Navbar,
  NavbarLink,
  Accordion,
  AccordionElement,
  AccordionText,
  AccordionTitle,
  Carousel,
  CarouselImage,
]

const presetCore = {
  components,
  dependencies,
}

export default presetCore
