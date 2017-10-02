import { HeadComponent } from 'mjml-core'

export default class MjStyle extends HeadComponent {
  static endingTag = true

  handler() {
    const {
      add,
    } = this.context

    add(
      this.getAttribute('inline') === 'inline' ? 'inlineStyle' : 'style',
      this.getContent()
    )
  }
}
