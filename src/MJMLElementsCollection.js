import Body from './components/Body'
import Button from './components/Button'
import Column from './components/Column'
import Divider from './components/Divider'
import Group from './components/Group'
import Html from './components/Html'
import Image from './components/Image'
import Invoice from './components/Invoice'
import InvoiceItem from './components/Invoice/Item'
import List from './components/List'
import Raw from './components/Raw'
import Section from './components/Section'
import Social from './components/Social'
import Text from './components/Text'

const MJMLStandardElements = {
  'body': Body,
  'button': Button,
  'column': Column,
  'divider': Divider,
  'group': Group,
  'html': Html,
  'image': Image,
  'invoice-item': InvoiceItem,
  'invoice': Invoice,
  'list': List,
  'raw': Raw,
  'section': Section,
  'social': Social,
  'text': Text
}

export const endingTags = ['mj-text', 'mj-html', 'mj-button', 'mj-list', 'mj-raw', 'mj-table', 'mj-invoice-item']
export const unsafeTags = ['mj-raw']

export const registerElement = (tagName, element, options = {}) => {
  MJMLStandardElements[tagName] = element

  if (options.endingTag) {
    endingTags.push(`mj-${tagName}`)
  }

  if (options.unsafeTags) {
    unsafeTags.push(`mj-${tagName}`)
  }

  return true
}

export default MJMLStandardElements
