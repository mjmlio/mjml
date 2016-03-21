import Body from './components/Body'
import Button from './components/Button'
import Column from './components/Column'
import Divider from './components/Divider'
import Html from './components/Html'
import Image from './components/Image'
import Invoice from './components/Invoice'
import InvoiceItem from './components/Invoice/Item'
import List from './components/List'
import Location from './components/Location'
import Raw from './components/Raw'
import Section from './components/Section'
import Social from './components/Social'
import Table from './components/Table'
import Text from './components/Text'

const MJMLStandardElements = {
  'body': Body,
  'button': Button,
  'column': Column,
  'divider': Divider,
  'html': Html,
  'image': Image,
  'invoice-item': InvoiceItem,
  'invoice': Invoice,
  'list': List,
  'location': Location,
  'raw': Raw,
  'section': Section,
  'social': Social,
  'table': Table,
  'text': Text
}

export const endingTags = ['mj-text', 'mj-html', 'mj-button', 'mj-list', 'mj-raw', 'mj-table', 'mj-invoice-item', 'mj-location']

export const registerElement = (tagName, element, options = {}) => {
  MJMLStandardElements[tagName] = element

  if (options.endingTag) {
    endingTags.push(`mj-${tagName}`)
  }

  return true
}

export default MJMLStandardElements
