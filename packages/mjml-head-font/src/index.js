import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-font', {
  tagOmission: true,
  handler () {
    const { add } = this.context

    add('fonts', this.getMjAttribute('name'), this.getMjAttribute('href'))
  }
})
