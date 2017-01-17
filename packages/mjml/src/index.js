import mjml2html, {
  registerComponent,
} from 'mjml-core'

registerComponent(require('mjml-head-attributes'))
registerComponent(require('mjml-head-font'))
registerComponent(require('mjml-head-style'))
registerComponent(require('mjml-head-title'))

registerComponent(require('mjml-container'))
registerComponent(require('mjml-section'))
registerComponent(require('mjml-column'))
registerComponent(require('mjml-text'))
registerComponent(require('mjml-divider'))
registerComponent(require('mjml-image'))

export default function (mjml, options) {
  return mjml2html(mjml, options)
}
