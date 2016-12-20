import mjmlValidator, { formatValidationError, rulesCollection, registerMJRule } from 'mjml-validator'
import elements, { registerMJElement } from './MJMLElementsCollection'
import MJMLRenderer from './MJMLRenderer'
import MJMLHeadElements, { registerMJHeadElement } from './MJMLHead'
import * as helpers from './helpers'

export MJMLElement from './decorators/MJMLElement'
export { MJMLRenderer, registerMJElement, elements, helpers, registerMJHeadElement, MJMLHeadElements, formatValidationError, registerMJRule, rulesCollection }
export const documentParser = (content, attributes) => {
  const documentParser = require('./parsers/document').default

  return documentParser(content, attributes)
}

export const version = () => '__MJML_VERSION__'
export const MJMLValidator = mjmlValidator
export const mjml2html = (mjml, options = {}) => new MJMLRenderer(mjml, options).render()
