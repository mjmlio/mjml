import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-style', {
  endingTag: true,
  handler () {
    const {
      addStyle,
    } = this.context

    addStyle(this.getMjContent())
  }
})
