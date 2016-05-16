import { registerMJElement, registerMJHeadElement } from 'mjml-core'
import Container from 'mjml-container'
import Button from 'mjml-button'
import Column from 'mjml-column'
import Divider from 'mjml-divider'
import Html from 'mjml-html'
import Image from 'mjml-image'
import Invoice from 'mjml-invoice'
import InvoiceItem from 'mjml-invoice-item'
import List from 'mjml-list'
import Location from 'mjml-location'
import Raw from 'mjml-raw'
import Section from 'mjml-section'
import Social from 'mjml-social'
import Spacer from 'mjml-spacer'
import Table from 'mjml-table'
import Text from 'mjml-text'
import Hero from 'mjml-hero'
import HeroContent from 'mjml-hero-content'
import MJMLHeadAttributes from 'mjml-head-attributes'

[ Container,
  Button,
  Column,
  Divider,
  Html,
  Image,
  Invoice,
  InvoiceItem,
  List,
  Location,
  Raw,
  Section,
  Social,
  Spacer,
  Table,
  Text,
  Hero,
  HeroContent ].map(registerMJElement)

registerMJHeadElement('mj-attributes', MJMLHeadAttributes)

export * from 'mjml-core'
