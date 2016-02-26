export documentParser from './documentParser'
export mjml2html from './mjml2html'
export MJMLColumnElement from './components/decorators/MJMLColumnElement'
export MJMLElement from './components/decorators/MJMLElement'
export const elements = require('./MJMLElementsCollection').default
export const registerElement = require('./MJMLElementsCollection').registerElement
export const version = () => process.env.MJML_VERSION
