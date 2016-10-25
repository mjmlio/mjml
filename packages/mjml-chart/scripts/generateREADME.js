'use strict';
const fs = require('fs');
const path = require('path');
const table = require('markdown-table');
const truncate = require('truncate');
const {
  chartAttributes,
  imageAttributes
} = require('./model');

const README_IN = path.resolve(__dirname, 'templates/README.md.tmpl');

const mdChartAttributesTable = table([
  ['attribute', 'description', 'value examples']
].concat(chartAttributes.map(({name, link, description, examples}) => [`[${name}](${link})`, description, examples.map(example => `\`${truncate(example, 40)}\``).join(', ')])));

const mdImageAttributesTable = table([
  ['attribute', 'default values']
].concat(imageAttributes.map(({name, defaultValue}) => [`[${name}](#mjml-image)`, defaultValue || 'n/a'])))

const readme = fs.readFileSync(README_IN, 'utf8')
  .replace('{mdChartAttributesTable}', mdChartAttributesTable)
  .replace('{mdImageAttributesTable}', mdImageAttributesTable)

console.log(readme); // eslint-disable-line no-console
