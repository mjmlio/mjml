const _ = require('lodash');
const swagger = require('./swagger.json');

const EXCLUDE_IMAGE_ATTRIBUTES = [
  // automatically generated attributes:
  'src', 'width', 'height',
  // currently not supported mjml-image attributes:
  'href', 'target'];
const {
  default: {
    defaultMJMLDefinition: {
      attributes: imageRawAttributes
    }
  }
} = require('mjml-image');
const {
  imageCharts: {
    documentation: DOCUMENTATION_ENDPOINT,
    api: API_ENDPOINT
  }
} = require('../package.json');

function meta (parameter) {
  return parameter['x-meta'];
}

const chartAttributes = swagger.paths['/chart'].get.parameters
  .filter(parameter => parameter.in === 'query' && meta(parameter).implementation.status === 'COMPLETE')
  .map(parameter => ({
    name: parameter.name,
    link: `${DOCUMENTATION_ENDPOINT}${meta(parameter).link}`,
    description: parameter.description,
    examples: meta(parameter).examples,
    pattern: parameter.pattern,
    enum: parameter.enum,
    required: parameter.required
  }));

const imageAttributes = _.chain(imageRawAttributes)
  .toPairs()
  .filter(([attribute]) => !EXCLUDE_IMAGE_ATTRIBUTES.includes(attribute))
  .map(([attribute, defaultValue]) => ({
    name: attribute,
    link: '#mjml-image',
    defaultValue: defaultValue
  }))
  .value();

module.exports = {
  chartAttributes,
  imageAttributes,
  API_ENDPOINT,
  EXCLUDE_IMAGE_ATTRIBUTES
};
