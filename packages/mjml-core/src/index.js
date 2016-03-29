import MJMLRenderer from './MJMLRenderer'

export documentParser from './parsers/document'
export MJMLElement from './decorators/MJMLElement'
export elements from './MJMLElementsCollection'
export { registerElement } from './MJMLElementsCollection'
export { MJMLRenderer }
export const version = () => process.env.MJML_VERSION
export const mjml2html = (mjml, options = {}) => new MJMLRenderer(mjml, options).render()
