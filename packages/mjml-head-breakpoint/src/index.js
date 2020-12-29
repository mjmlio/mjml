import { HeadComponent } from 'mjml-core'

export default class MjBreakpoint extends HeadComponent {
  static componentName = 'mj-breakpoint'

  static endingTag = true

  static allowedAttributes = {
    width: 'unit(px)',
  }

  handler() {
    const { add } = this.context

    add('breakpoint', this.getAttribute('width'))
  }
}
