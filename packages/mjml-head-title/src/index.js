import { HeadComponent } from 'mjml-core'

export default class MjTitle extends HeadComponent {
  static endingTag = true

  handler() {
    const { add } = this.context

    add('title', this.getContent())
  }
}
