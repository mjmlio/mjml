import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-style', {
  endingTag: true,
  handler () {
    const { add } = this.context

    addStyle('style', this.getMjContent())
  }
})
