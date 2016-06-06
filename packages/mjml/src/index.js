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
import MjHero from 'mjml-hero'
import MjInvoice from 'mjml-invoice'
import MjNavbar from 'mjml-navbar'
import Raw from 'mjml-raw'
import Section from 'mjml-section'
import Social from 'mjml-social'
import Spacer from 'mjml-spacer'
import Table from 'mjml-table'
import Text from 'mjml-text'
import MJMLHeadAttributes from 'mjml-head-attributes'

const { Hero, HeroContent } = MjHero
const { Invoice, InvoiceItem } = MjInvoice
const { Navbar, InlineLinks, Link } = MjNavbar;

[ Button,
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
  Text ].map(registerMJElement)

registerMJHeadElement('mj-attributes', MJMLHeadAttributes)

export * from 'mjml-core'
