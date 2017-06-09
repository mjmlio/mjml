import { HeadComponent } from 'mjml-core'

export default class extends HeadComponent {

  static tagName = 'mj-font'

  static tagOmission = true

  handler() {
    const {
      add,
    } = this.context

    add('fonts', this.getAttribute('name'), this.getAttribute('href'))
  }

}
