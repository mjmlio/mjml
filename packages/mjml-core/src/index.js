import warning from 'warning'

import MJMLRenderer from './MJMLRenderer'
import elements, { registerMJElement } from './MJMLElementsCollection'
import * as helpers from './helpers'

export documentParser from './parsers/document'
export MJMLElement from './decorators/MJMLElement'
export { MJMLRenderer, registerMJElement, elements, helpers }
export const mjml2html = (mjml, options = {}) => new MJMLRenderer(mjml, options).render()
export const registerElement = Component => {
  warning(false, 'Please now use registerMJElement, registerElement is deprecated will no longer be supported soon')

  return registerMJElement(Component)
}
