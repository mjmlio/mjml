import { HeadComponent } from 'mjml-core'

export default class MjHead extends HeadComponent {
  handler() {
    return this.handlerChildren()
  }
}
