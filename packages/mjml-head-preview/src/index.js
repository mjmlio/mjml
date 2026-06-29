import { HeadComponent } from 'mjml-core'

export default class MjPreview extends HeadComponent {
  static componentName = 'mj-preview'

  static endingTag = true

  static allowedAttributes = {
    'fill-space': 'string',
    'fill-space-unit': 'string',
  }

  static defaultAttributes = {
    'fill-space': '0',
    'fill-space-unit': '&#8199;&#65279;&#847;',
  }

  handler() {
    const { add } = this.context
    const content = this.getContent() || ''
    const repeat = parseInt(this.getAttribute('fill-space') || '0', 10) || 0
    const unit = ` ${this.getAttribute('fill-space-unit')}`

    const padded = repeat > 0 ? `${content}${unit.repeat(repeat)}` : content

    add('preview', padded)
  }
}
