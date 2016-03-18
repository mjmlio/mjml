export documentParser from './documentParser'
export MJMLRenderer from './MJMLRenderer'
export MJMLColumnElement from './components/decorators/MJMLColumnElement'
export MJMLElement from './components/decorators/MJMLElement'
export elements from './MJMLElementsCollection'
export { registerElement } from './MJMLElementsCollection'
export const version = () => process.env.MJML_VERSION
