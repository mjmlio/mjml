import mjml2htmlCore, { components, assignComponents } from 'mjml-core'
import { dependencies, assignDependencies } from 'mjml-validator'
import presetCore from 'mjml-preset-core'

assignComponents(components, presetCore.components)
assignDependencies(dependencies, presetCore.dependencies)

export default async function mjml2html(input, options = {}) {
  return mjml2htmlCore(input, options)
}
