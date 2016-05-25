import warning from 'warning'

import MJMLRenderer from './MJMLRenderer'
import elements, { registerMJElement } from './MJMLElementsCollection'
import mjCssClasses, { setMjCssClasses } from './mjCssClasses'
import mjDefaultAttributes, { setMjDefaultAttributes } from './mjDefaultAttributes'
import MJMLHeadElements, { registerMJHeadElement } from './MJMLHead'
import * as helpers from './helpers'

export MJMLElement from './decorators/MJMLElement'
export { MJMLRenderer, registerMJElement, elements, helpers, mjCssClasses, mjDefaultAttributes, registerMJHeadElement, MJMLHeadElements, setMjDefaultAttributes, setMjCssClasses }
export const documentParser = content => {
  const documentParser = require('./parsers/document').default

  return documentParser(content)
}
export const version = () => '__MJML_VERSION__'
export const mjml2html = (mjml, options = {}) => new MJMLRenderer(mjml, options).render()
export const registerElement = Component => {
  warning(false, 'Please now use registerMJElement, registerElement is deprecated will no longer be supported soon')

  return registerMJElement(Component)
}
