import warning from 'warning'

import MJMLRenderer from './MJMLRenderer'
import elements, { registerMJElement } from './MJMLElementsCollection'

export documentParser from './parsers/document'
export MJMLElement from './decorators/MJMLElement'
export { MJMLRenderer, registerMJElement, elements }
export const version = () => require('../package.json').version
export const mjml2html = (mjml, options = {}) => new MJMLRenderer(mjml, options).render()
export const registerElement = Component => {
  warning(false, 'Please now use registerMJElement, registerElement is deprecated will no longer be supported soon')

  return registerMJElement(Component)
}
