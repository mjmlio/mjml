export documentParser from './parsers/document'
export MJMLRenderer from './MJMLRenderer'
export MJMLElement from './decorators/MJMLElement'
export elements from './MJMLElementsCollection'
export { registerElement } from './MJMLElementsCollection'
export const version = () => process.env.MJML_VERSION
