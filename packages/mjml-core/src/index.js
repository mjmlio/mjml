import warning from 'warning'

import MJMLRenderer from './MJMLRenderer'
import elements, { registerMJElement } from './MJMLElementsCollection'
import mjCssClasses, { setMjCssClasses } from './mjCssClasses'
import mjDefaultAttributes, { setMjDefaultAttributes } from './mjDefaultAttributes'
import MJMLHeadElements, { registerMJHeadElement } from './MJMLHead'
import * as helpers from './helpers'

export documentParser from './parsers/document'
export MJMLElement from './decorators/MJMLElement'
export { MJMLRenderer, registerMJElement, elements, helpers, mjCssClasses, mjDefaultAttributes, registerMJHeadElement, MJMLHeadElements, setMjDefaultAttributes, setMjCssClasses }
export const version = () => require('../package.json').version
export const mjml2html = (mjml, options = {}) => new MJMLRenderer(mjml, options).render()
export const registerElement = Component => {
  warning(false, 'Please now use registerMJElement, registerElement is deprecated will no longer be supported soon')

  return registerMJElement(Component)
}
