import { registerMJElement, registerMJHeadElement } from 'mjml-core'

import Button from 'mjml-button'
import Column from 'mjml-column'
import Container from 'mjml-container'
import Divider from 'mjml-divider'
import Group from 'mjml-group'
import Html from 'mjml-html'
import Image from 'mjml-image'
import List from 'mjml-list'
import Location from 'mjml-location'
import MJCarousel from 'mjml-carousel'
import MJHero from 'mjml-hero'
import MJInvoice from 'mjml-invoice'
import MJNavbar from 'mjml-navbar'
import Raw from 'mjml-raw'
import Section from 'mjml-section'
import Social from 'mjml-social'
import Spacer from 'mjml-spacer'
import Table from 'mjml-table'
import Text from 'mjml-text'
import Wrapper from 'mjml-wrapper'

import MJHeadAttributes from 'mjml-head-attributes'
import MJHeadFont from 'mjml-head-font'
import MJHeadStyle from 'mjml-head-style'
import MJHeadTitle from 'mjml-head-title'

const { Hero, HeroContent } = MJHero
const { Invoice, InvoiceItem } = MJInvoice
const { Carousel, CarouselImage } = MJCarousel;
const { Navbar, InlineLinks, Link } = MJNavbar;

[ Button,
  Carousel,
  CarouselImage,
  Column,
  Container,
  Divider,
  Group,
  Hero,
  HeroContent,
  Html,
  Image,
  InlineLinks,
  Invoice,
  InvoiceItem,
  Link,
  List,
  Location,
  Navbar,
  Raw,
  Section,
  Social,
  Spacer,
  Table,
  Text,
  Wrapper ].map(registerMJElement);

[ MJHeadAttributes,
  MJHeadFont,
  MJHeadStyle,
  MJHeadTitle ].map( headElement => registerMJHeadElement(headElement.name, headElement.handler))

export * from 'mjml-core'
