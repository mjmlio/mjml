import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-title', {
  canContainMarkup: true,
  handler () {
    const {
      setTitle,
    } = this.context

    setTitle(this.getMjContent())
  }
})
