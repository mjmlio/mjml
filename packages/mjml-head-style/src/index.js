import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-style', {
  canContainMarkup: true,
  handler () {
    const {
      addStyle,
    } = this.context

    addStyle(this.getMjContent())
  }
})
