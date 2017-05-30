import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-title', {
  endingTag: true,
  handler () {
    const { add } = this.context

    add('title', this.getMjContent())
  }
})
