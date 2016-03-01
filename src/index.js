export documentParser from './documentParser'
export mjml2html from './mjml2html'
export MJMLColumnElement from './components/decorators/MJMLColumnElement'
export MJMLElement from './components/decorators/MJMLElement'
export elements from './MJMLElementsCollection'
export { registerElement } from './MJMLElementsCollection'
export const version = () => process.env.MJML_VERSION
