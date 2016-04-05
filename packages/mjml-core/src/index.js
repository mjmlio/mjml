import MJMLRenderer from './MJMLRenderer'

export documentParser from './parsers/document'
export MJMLElement from './decorators/MJMLElement'
export elements from './MJMLElementsCollection'
export { registerMJElement } from './MJMLElementsCollection'
export { registerMJElement as registerElement } from './MJMLElementsCollection'
export { MJMLRenderer }
export const version = () => require('../package.json').version
export const mjml2html = (mjml, options = {}) => new MJMLRenderer(mjml, options).render()
