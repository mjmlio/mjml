import { HeadComponent } from 'mjml-core'

export default class extends HeadComponent {

  static tagName = 'mj-head'

  handler() {
    this.handlerChildren()
  }

}
