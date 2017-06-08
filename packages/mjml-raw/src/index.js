import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-raw', {
  endingTag: true,
  rawElement: true,
  render() {
    return this.getMjContent()
  },
})
