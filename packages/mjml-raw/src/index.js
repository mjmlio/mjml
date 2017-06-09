import { BodyComponent } from 'mjml-core'

export default class extends BodyComponent {

  static tagName = 'mj-raw'

  static endingTag = true

  render() {
    return this.getContent()
  }

}
