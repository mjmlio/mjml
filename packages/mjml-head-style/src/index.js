import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-style', {
  endingTag: true,
  handler() {
    const { add } = this.context

    add('style', this.getMjContent())
  },
})
