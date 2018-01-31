import { BodyComponent } from 'mjml-core'

export default class MjRaw extends BodyComponent {
  constructor(props) {
    super(props)
    this.rawElement = true
  }
  static endingTag = true

  render() {
    return this.getContent()
  }
}
