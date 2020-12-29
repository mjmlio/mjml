import { BodyComponent } from 'mjml-core'

export default class MjRaw extends BodyComponent {
  static componentName = 'mj-raw'

  static endingTag = true

  static rawElement = true

  render() {
    return this.getContent()
  }
}
