import { HeadComponent } from 'mjml-core'

export default class extends HeadComponent {

  static tagName = 'mj-style'

  static endingTag = true

  handler() {
    const {
      add,
    } = this.context

    add('style', this.getContent())
  }

}
