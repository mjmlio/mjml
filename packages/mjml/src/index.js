import mjml2html, { registerComponent } from 'mjml-core'
import { dependencies, assignDependencies } from 'mjml-validator'
import presetCore from 'mjml-preset-core'

presetCore.components.forEach((component) => {
  registerComponent(component)
})
assignDependencies(dependencies, presetCore.dependencies)

export default mjml2html
