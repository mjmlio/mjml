import { registerMJElement, registerMJHeadElement } from 'mjml-core'
import Button from 'mjml-button'
import Column from 'mjml-column'
import Container from 'mjml-container'
import Divider from 'mjml-divider'
import Hero from 'mjml-hero'
import HeroContent from 'mjml-hero-content'
import Html from 'mjml-html'
import Image from 'mjml-image'
import InlineLinks from 'mjml-inline-links'
import Invoice from 'mjml-invoice'
import InvoiceItem from 'mjml-invoice-item'
import Link from 'mjml-link'
import List from 'mjml-list'
import Location from 'mjml-location'
import Navbar from 'mjml-navbar'
import Raw from 'mjml-raw'
import Section from 'mjml-section'
import Social from 'mjml-social'
import Spacer from 'mjml-spacer'
import Table from 'mjml-table'
import Text from 'mjml-text'
import MJMLHeadAttributes from 'mjml-head-attributes'

[ Button,
  Column,
  Container,
  Divider,
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
  Text ].map(registerMJElement)

registerMJHeadElement('mj-attributes', MJMLHeadAttributes)

export * from 'mjml-core'
