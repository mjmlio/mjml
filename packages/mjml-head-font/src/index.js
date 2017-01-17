import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-font', {
  tagOmission: true,
  handler () {
    const {
      addFont,
    } = this.context

    addFont(this.getMjAttribute('name'), this.getMjAttribute('href'))
  }
})
