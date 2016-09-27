'use strict';
const fs = require('fs');
const path = require('path');
const table = require('markdown-table');
const truncate = require('truncate');

const README_IN = path.resolve(__dirname, 'README.tmpl.md');
const README_OUT = path.resolve(__dirname, '../README.md');
const swagger = require('./swagger.json');
const {
  imageCharts: {
    documentation
  }
} = require('../package.json');

function meta (parameter) {
  return parameter['x-meta'];
}

// console.log(JSON.stringify(swagger.paths['/chart'].get.parameters, null, 2));

const parameters = swagger.paths['/chart'].get.parameters
  .filter(parameter => parameter.in === 'query' && meta(parameter).implementation.status === 'COMPLETE');

const mdAttributesTable = table([['attribute', 'description', 'value examples']].concat(parameters.map(parameter => [`[${parameter.name}](${documentation}${meta(parameter).link})`, parameter.description, meta(parameter).examples.map(example => `\`${truncate(example, 40)}\``).join(', ')])));

const readme = fs.readFileSync(README_IN, 'utf8').replace('{mdAttributesTable}', mdAttributesTable);

fs.writeFileSync(README_OUT, readme, 'utf8');
