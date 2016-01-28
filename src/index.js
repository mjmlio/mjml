import MJMLElementsCollection, {registerElement} from './MJMLElementsCollection'

module.exports = {
  elements: MJMLElementsCollection,
  documentParser: require('./documentParser'),
  MJMLElement: require('./components/MJMLElement'),
  MJMLColumnElement: require('./components/MJMLColumnElement'),
  mjml2html: require('./mjml2html').default,
  registerElement: registerElement,
  version: require('../package.json').version
}
